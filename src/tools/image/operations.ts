import OpenAI from "openai";
import { HttpError, prisma, env } from "wasp/server";
import type { GenerateImage } from "wasp/server/operations";
import * as z from "zod";
import { ensureArgsSchemaOrThrowHttpError } from "../../server/validation";
import { SubscriptionStatus } from "../../payment/plans";

const generateImageInputSchema = z.object({
  prompt: z.string().min(3).max(1000),
  size: z.enum(["512x512", "1024x1024"]).default("1024x1024"),
});

type GenerateImageInput = z.infer<typeof generateImageInputSchema>;
type GenerateImageOutput = { url: string; isPro: boolean };

export const generateImage: GenerateImage<GenerateImageInput, GenerateImageOutput> = async (
  rawArgs,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Login required");
  }

  const { prompt, size } = ensureArgsSchemaOrThrowHttpError(generateImageInputSchema, rawArgs);

  const isPro = context.user.subscriptionStatus === SubscriptionStatus.Active;
  let imageUrl: string;

  if (isPro) {
    if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY === "sk-k...") {
      throw new HttpError(503, "Pro-tier API not configured. Add OPENAI_API_KEY to .env.server.");
    }
    try {
      const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
      const dalleSize = size === "512x512" ? "1024x1024" : "1024x1024";
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: dalleSize,
        quality: "hd",
      });
      if (!response.data || !response.data[0]?.url) {
        throw new HttpError(503, "DALL-E returned no image");
      }
      imageUrl = response.data[0].url;
    } catch (err: any) {
      if (err instanceof HttpError) throw err;
      throw new HttpError(503, `DALL-E error: ${err?.message ?? "unknown"}`);
    }
  } else {
    // Pollinations.ai — free, no API key needed
    const encoded = encodeURIComponent(prompt);
    const [width, height] = size.split("x");
    imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${Date.now()}&model=flux&nologo=true`;
  }

  await prisma.generationJob.create({
    data: {
      userId: context.user.id,
      toolType: "image",
      prompt,
      result: imageUrl,
      isPro,
    },
  });

  return { url: imageUrl, isPro };
};

import Groq from "groq-sdk";
import OpenAI from "openai";
import { HttpError, prisma, env } from "wasp/server";
import type { GenerateText } from "wasp/server/operations";
import * as z from "zod";
import { ensureArgsSchemaOrThrowHttpError } from "../../server/validation";
import { SubscriptionStatus } from "../../payment/plans";

export const TOOL_TYPES = [
  "product_desc",
  "seo_meta",
  "social_caption",
  "code_explainer",
  "summarizer",
  "blog",
] as const;

export type ToolType = (typeof TOOL_TYPES)[number];

const PRO_ONLY_TOOLS: ToolType[] = ["blog"];

const generateTextInputSchema = z.object({
  toolType: z.enum([...TOOL_TYPES] as [string, ...string[]]),
  prompt: z.string().min(3).max(4000),
  options: z.record(z.string(), z.string()).optional(),
});

type GenerateTextInput = {
  toolType: ToolType;
  prompt: string;
  options?: Record<string, string>;
};
type GenerateTextOutput = { result: string; isPro: boolean };

function buildSystemPrompt(toolType: ToolType, options?: Record<string, string>): string {
  switch (toolType) {
    case "product_desc":
      return `You are an expert ecommerce copywriter. Write compelling product descriptions that highlight benefits, features, and drive conversions. Tone: ${options?.tone ?? "professional"}. Language: ${options?.language ?? "English"}. Keep descriptions between 150-300 words unless specified.`;

    case "seo_meta":
      return `You are an SEO expert. Generate optimized meta titles and descriptions for web pages. Return JSON with keys: "title" (50-60 chars), "description" (150-160 chars), "keywords" (comma-separated, 5-8 terms). Always return valid JSON only.`;

    case "social_caption":
      return `You are a social media expert. Write engaging captions for ${options?.platform ?? "Instagram"}. Include relevant hashtags at the end. Tone: ${options?.tone ?? "engaging and friendly"}. Keep it platform-appropriate.`;

    case "code_explainer":
      return `You are a senior software engineer and technical writer. Explain code clearly and concisely. Cover: what it does, how it works, key concepts, and any potential issues. Target audience: ${options?.audience ?? "intermediate developers"}.`;

    case "summarizer":
      return `You are an expert at summarizing text. Create clear, concise summaries that capture the key points. Length: ${options?.length ?? "short"} (short = 2-3 sentences, medium = 1 paragraph, detailed = 3-4 paragraphs).`;

    case "blog":
      return `You are a professional blog writer and content strategist. Write well-structured, SEO-friendly blog posts with engaging headings, clear paragraphs, and a strong call-to-action. Length: ${options?.length ?? "medium"} (short = 500 words, medium = 1000 words, long = 2000+ words). Include an intro, body sections with H2 headings, and a conclusion.`;
  }
}

async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!env.GROQ_API_KEY || env.GROQ_API_KEY === "gsk_...") {
    throw new HttpError(503, "Free-tier API not configured. Add GROQ_API_KEY to .env.server (free at console.groq.com).");
  }
  try {
    const groq = new Groq({ apiKey: env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });
    return completion.choices[0]?.message?.content ?? "";
  } catch (err: any) {
    const msg = err?.message ?? "Groq API failed";
    throw new HttpError(503, `AI provider error: ${msg}`);
  }
}

async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY === "sk-k...") {
    throw new HttpError(503, "Pro-tier API not configured. Add OPENAI_API_KEY to .env.server.");
  }
  try {
    const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });
    return completion.choices[0]?.message?.content ?? "";
  } catch (err: any) {
    const msg = err?.message ?? "OpenAI API failed";
    throw new HttpError(503, `AI provider error: ${msg}`);
  }
}

export const generateText: GenerateText<GenerateTextInput, GenerateTextOutput> = async (
  rawArgs,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "Login required");
  }

  const { toolType: rawToolType, prompt, options } = ensureArgsSchemaOrThrowHttpError(
    generateTextInputSchema,
    rawArgs
  );
  const toolType = rawToolType as ToolType;

  const isPro = context.user.subscriptionStatus === SubscriptionStatus.Active;

  if (PRO_ONLY_TOOLS.includes(toolType) && !isPro) {
    throw new HttpError(403, "Blog Writer is a Pro feature. Upgrade to access it.");
  }

  const systemPrompt = buildSystemPrompt(toolType, options);
  const result = isPro
    ? await callOpenAI(systemPrompt, prompt)
    : await callGroq(systemPrompt, prompt);

  await prisma.generationJob.create({
    data: {
      userId: context.user.id,
      toolType,
      prompt,
      result,
      isPro,
    },
  });

  return { result, isPro };
};

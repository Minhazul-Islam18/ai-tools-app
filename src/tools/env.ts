import * as z from "zod";

export const genkitEnvSchema = z.object({
  GROQ_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

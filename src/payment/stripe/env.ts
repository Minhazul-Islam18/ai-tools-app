import * as z from "zod";

export const stripeEnvSchema = z.object({
  STRIPE_API_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

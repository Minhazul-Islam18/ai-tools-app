import * as z from "zod";
import { paymentPlansSchema } from "../env";

export const polarEnvSchema = z.object({
  POLAR_ORGANIZATION_ACCESS_TOKEN: z.string().optional(),
  POLAR_SANDBOX_MODE: z.string().optional(),
  POLAR_WEBHOOK_SECRET: z.string().optional(),
});

import { HttpError } from "wasp/server";
import type { GetGenerationHistory } from "wasp/server/operations";
import type { GenerationJob } from "wasp/entities";

type GetGenerationHistoryInput = { toolType?: string; limit?: number };
type GetGenerationHistoryOutput = GenerationJob[];

export const getGenerationHistory: GetGenerationHistory<
  GetGenerationHistoryInput,
  GetGenerationHistoryOutput
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Login required");
  }

  return context.entities.GenerationJob.findMany({
    where: {
      userId: context.user.id,
      ...(args.toolType ? { toolType: args.toolType } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: args.limit ?? 20,
  });
};

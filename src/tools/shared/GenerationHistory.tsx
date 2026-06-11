import { useState } from "react";
import { Clock, Copy, Check, Image, Crown } from "lucide-react";
import type { GenerationJob } from "wasp/entities";

interface GenerationHistoryProps {
  jobs: GenerationJob[];
  toolType: string;
}

export function GenerationHistory({ jobs, toolType }: GenerationHistoryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = jobs.filter((j) => j.toolType === toolType);

  if (filtered.length === 0) return null;

  async function handleCopy(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Recent Generations</h3>
      </div>
      <div className="space-y-3">
        {filtered.slice(0, 10).map((job) => (
          <div
            key={job.id}
            className="rounded-lg border bg-card p-4 text-sm"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-muted-foreground line-clamp-1 flex-1">
                <span className="font-medium text-foreground">Prompt:</span> {job.prompt}
              </p>
              <div className="flex items-center gap-2 shrink-0">
                {job.isPro && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                    <Crown className="w-3 h-3" />
                    Pro
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {toolType === "image" ? (
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-muted-foreground" />
                <a
                  href={job.result}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs truncate"
                >
                  View image
                </a>
              </div>
            ) : (
              <div className="relative">
                <p className="text-foreground line-clamp-3 pr-8">{job.result}</p>
                <button
                  onClick={() => handleCopy(job.result, job.id)}
                  className="absolute top-0 right-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy"
                >
                  {copiedId === job.id ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

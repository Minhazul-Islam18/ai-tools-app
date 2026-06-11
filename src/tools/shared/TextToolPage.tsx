import { useState } from "react";
import { useAuth } from "wasp/client/auth";
import { generateText } from "wasp/client/operations";
import { getGenerationHistory, useQuery } from "wasp/client/operations";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { ToolLayout } from "./ToolLayout";
import { GenerationHistory } from "./GenerationHistory";
import { SubscriptionStatus } from "../../payment/plans";
import type { ToolType } from "../text/operations";

interface SelectOption {
  value: string;
  label: string;
}

interface ToolOption {
  key: string;
  label: string;
  options: SelectOption[];
  defaultValue: string;
}

interface TextToolPageProps {
  toolType: ToolType;
  title: string;
  description: string;
  icon: React.ReactNode;
  promptLabel: string;
  promptPlaceholder: string;
  proOnly?: boolean;
  toolOptions?: ToolOption[];
  resultLabel?: string;
  proDescription?: string;
  freeDescription?: string;
}

export function TextToolPage({
  toolType,
  title,
  description,
  icon,
  promptLabel,
  promptPlaceholder,
  proOnly,
  toolOptions = [],
  resultLabel = "Result",
  proDescription,
  freeDescription,
}: TextToolPageProps) {
  const { data: user } = useAuth();
  const isPro = user?.subscriptionStatus === SubscriptionStatus.Active;

  const [prompt, setPrompt] = useState("");
  const [optionValues, setOptionValues] = useState<Record<string, string>>(
    Object.fromEntries(toolOptions.map((o) => [o.key, o.defaultValue]))
  );
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: history } = useQuery(getGenerationHistory, { toolType, limit: 10 });

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await generateText({ toolType, prompt, options: optionValues });
      setResult(res.result);
    } catch (e: any) {
      setError(e.message ?? "Generation failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displayDescription = isPro
    ? proDescription ?? description
    : freeDescription ?? description;

  return (
    <ToolLayout
      title={title}
      description={displayDescription}
      icon={icon}
      proOnly={proOnly}
      isUserPro={isPro}
    >
      <div className="space-y-4">
        {/* Options row */}
        {toolOptions.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {toolOptions.map((opt) => (
              <div key={opt.key}>
                <label className="block text-sm font-medium mb-1.5">{opt.label}</label>
                <select
                  value={optionValues[opt.key]}
                  onChange={(e) =>
                    setOptionValues((prev) => ({ ...prev, [opt.key]: e.target.value }))
                  }
                  className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {opt.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium mb-2">{promptLabel}</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={promptPlaceholder}
            rows={5}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Generate */}
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="text-sm font-medium">{resultLabel}</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-4">
              <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
            </div>
          </div>
        )}
      </div>

      {history && <GenerationHistory jobs={history} toolType={toolType} />}
    </ToolLayout>
  );
}

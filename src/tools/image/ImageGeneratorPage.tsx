import { useState, useEffect } from "react";
import { useAuth } from "wasp/client/auth";
import { generateImage } from "wasp/client/operations";
import { getGenerationHistory, useQuery } from "wasp/client/operations";
import { Image, Download, Sparkles, Loader2, RotateCw } from "lucide-react";
import { ToolLayout } from "../shared/ToolLayout";
import { GenerationHistory } from "../shared/GenerationHistory";
import { SubscriptionStatus } from "../../payment/plans";

const SIZE_OPTIONS = [
  { value: "512x512", label: "512 × 512", proOnly: false },
  { value: "1024x1024", label: "1024 × 1024", proOnly: false },
];

export function ImageGeneratorPage() {
  const { data: user } = useAuth();
  const isPro = user?.subscriptionStatus === SubscriptionStatus.Active;

  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<"512x512" | "1024x1024">("1024x1024");
  const [result, setResult] = useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: history } = useQuery(getGenerationHistory, { toolType: "image", limit: 10 });

  // Preload image with auto-retry — Pollinations first-gen can take 30s+
  useEffect(() => {
    if (!result) return;
    setIsImageLoading(true);
    setImageFailed(false);
    setLoadedUrl(null);

    let cancelled = false;
    let attempt = 0;
    const RETRY_DELAY_MS = 4000;

    function tryLoad() {
      if (cancelled) return;
      attempt++;
      const img = new window.Image();
      img.onload = () => {
        if (cancelled) return;
        setLoadedUrl(result);
        setIsImageLoading(false);
      };
      img.onerror = () => {
        if (cancelled) return;
        // Keep retrying forever — user explicitly wants to wait
        setTimeout(tryLoad, RETRY_DELAY_MS);
      };
      img.src = result + (result.includes("?") ? "&" : "?") + "_retry=" + attempt;
    }

    tryLoad();

    return () => {
      cancelled = true;
    };
  }, [result]);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLoadedUrl(null);
    setImageFailed(false);
    try {
      const res = await generateImage({ prompt, size });
      setResult(res.url);
    } catch (e: any) {
      setError(e.message ?? "Generation failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleRetry() {
    if (!result) return;
    // Force re-trigger preload effect
    const url = result;
    setResult(null);
    setTimeout(() => setResult(url), 50);
  }

  return (
    <ToolLayout
      title="Image Generator"
      description={isPro ? "DALL-E 3 HD — high quality, photorealistic images" : "Pollinations.ai — free unlimited image generation"}
      icon={<Image className="w-6 h-6" />}
      isUserPro={isPro}
    >
      <div className="space-y-4">
        {/* Prompt */}
        <div>
          <label className="block text-sm font-medium mb-2">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city at sunset with flying cars, cyberpunk style, ultra detailed..."
            rows={4}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">{prompt.length}/1000 characters</p>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <div className="flex gap-2">
            {SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSize(opt.value as any)}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                  size === opt.value
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
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
              Generate Image
            </>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Server-side loading placeholder */}
        {isLoading && (
          <div className="rounded-xl border bg-muted/30 aspect-square flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {isPro ? "DALL-E 3 generating..." : "Requesting image..."}
              </p>
            </div>
          </div>
        )}

        {/* Browser image preloading */}
        {result && isImageLoading && !isLoading && (
          <div className="rounded-xl border bg-muted/30 aspect-square flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Pollinations rendering image... (5–20s first time)
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Free Flux model — slow on first request
              </p>
            </div>
          </div>
        )}

        {/* Image failed — show retry */}
        {imageFailed && !isImageLoading && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-6 text-center">
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
              Image didn't load. Pollinations free tier can be slow or rate-limited.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                Retry loading
              </button>
              {result && (
                <a
                  href={result}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border hover:bg-muted transition-colors"
                >
                  Open URL directly
                </a>
              )}
            </div>
          </div>
        )}

        {/* Image ready */}
        {loadedUrl && !isImageLoading && !imageFailed && (
          <div className="rounded-xl border overflow-hidden">
            <img
              src={loadedUrl}
              alt={prompt}
              className="w-full object-cover"
            />
            <div className="p-3 flex justify-end border-t bg-muted/50">
              <a
                href={loadedUrl}
                download="genkit-image.png"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        )}
      </div>

      {history && <GenerationHistory jobs={history} toolType="image" />}
    </ToolLayout>
  );
}

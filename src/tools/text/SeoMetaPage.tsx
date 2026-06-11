import { Search } from "lucide-react";
import { TextToolPage } from "../shared/TextToolPage";

export function SeoMetaPage() {
  return (
    <TextToolPage
      toolType="seo_meta"
      title="SEO Meta Generator"
      description="Generate optimized meta titles, descriptions & keywords"
      freeDescription="Llama 3.3 70B — unlimited free generation"
      proDescription="GPT-4o — enhanced with schema markup suggestions"
      icon={<Search className="w-6 h-6" />}
      promptLabel="Page content or topic"
      promptPlaceholder="Describe your webpage, article, or product...&#10;&#10;Example: A landing page for an AI-powered email marketing tool for small businesses. Key features: automation, analytics, A/B testing."
      resultLabel="SEO Meta Tags"
    />
  );
}

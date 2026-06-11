import { PenLine } from "lucide-react";
import { TextToolPage } from "../shared/TextToolPage";

export function BlogWriterPage() {
  return (
    <TextToolPage
      toolType="blog"
      title="Blog Writer"
      description="Generate full blog posts with SEO structure and headings"
      proDescription="GPT-4o — 500 to 2000+ word posts with H2 sections"
      icon={<PenLine className="w-6 h-6" />}
      promptLabel="Blog topic & key points"
      promptPlaceholder="Describe your blog post topic and any key points to cover...&#10;&#10;Example: 'Why small businesses should use AI tools in 2025 — cover cost savings, automation, marketing, and how to get started.'"
      resultLabel="Blog Post"
      proOnly
      toolOptions={[
        {
          key: "length",
          label: "Length",
          defaultValue: "medium",
          options: [
            { value: "short", label: "Short (~500 words)" },
            { value: "medium", label: "Medium (~1000 words)" },
            { value: "long", label: "Long (2000+ words)" },
          ],
        },
      ]}
    />
  );
}

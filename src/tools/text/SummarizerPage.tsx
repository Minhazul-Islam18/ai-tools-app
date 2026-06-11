import { FileText } from "lucide-react";
import { TextToolPage } from "../shared/TextToolPage";

export function SummarizerPage() {
  return (
    <TextToolPage
      toolType="summarizer"
      title="Text Summarizer"
      description="Summarize long content into clear, concise key points"
      freeDescription="Llama 3.3 70B — unlimited free generation"
      proDescription="GPT-4o — handles long documents"
      icon={<FileText className="w-6 h-6" />}
      promptLabel="Text to summarize"
      promptPlaceholder="Paste any article, report, research paper, email, or long text here..."
      resultLabel="Summary"
      toolOptions={[
        {
          key: "length",
          label: "Summary length",
          defaultValue: "short",
          options: [
            { value: "short", label: "Short (2-3 sentences)" },
            { value: "medium", label: "Medium (1 paragraph)" },
            { value: "detailed", label: "Detailed (3-4 paragraphs)" },
          ],
        },
      ]}
    />
  );
}

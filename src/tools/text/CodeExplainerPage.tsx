import { Code2 } from "lucide-react";
import { TextToolPage } from "../shared/TextToolPage";

export function CodeExplainerPage() {
  return (
    <TextToolPage
      toolType="code_explainer"
      title="Code Explainer"
      description="Understand any code snippet in plain English"
      freeDescription="Llama 3.3 70B — unlimited free generation"
      proDescription="GPT-4o — deep technical analysis"
      icon={<Code2 className="w-6 h-6" />}
      promptLabel="Paste your code"
      promptPlaceholder="Paste any code snippet here — function, class, algorithm, config file, regex, etc."
      resultLabel="Explanation"
      toolOptions={[
        {
          key: "audience",
          label: "Audience",
          defaultValue: "intermediate developers",
          options: [
            { value: "beginners", label: "Beginner" },
            { value: "intermediate developers", label: "Intermediate" },
            { value: "senior engineers", label: "Senior" },
          ],
        },
      ]}
    />
  );
}

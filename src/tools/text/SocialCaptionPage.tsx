import { MessageSquare } from "lucide-react";
import { TextToolPage } from "../shared/TextToolPage";

export function SocialCaptionPage() {
  return (
    <TextToolPage
      toolType="social_caption"
      title="Social Caption Writer"
      description="Write platform-perfect captions with hashtags"
      freeDescription="Llama 3.3 70B — unlimited free generation"
      proDescription="GPT-4o — platform-optimized captions"
      icon={<MessageSquare className="w-6 h-6" />}
      promptLabel="What's the post about?"
      promptPlaceholder="Describe what you're posting about...&#10;&#10;Example: Launching my new handmade ceramic coffee mugs. Rustic style, dishwasher safe, available in 5 colors."
      resultLabel="Caption"
      toolOptions={[
        {
          key: "platform",
          label: "Platform",
          defaultValue: "Instagram",
          options: [
            { value: "Instagram", label: "Instagram" },
            { value: "Twitter/X", label: "Twitter / X" },
            { value: "LinkedIn", label: "LinkedIn" },
            { value: "Facebook", label: "Facebook" },
            { value: "TikTok", label: "TikTok" },
          ],
        },
        {
          key: "tone",
          label: "Tone",
          defaultValue: "engaging and friendly",
          options: [
            { value: "engaging and friendly", label: "Friendly" },
            { value: "professional", label: "Professional" },
            { value: "humorous", label: "Humorous" },
            { value: "inspirational", label: "Inspirational" },
          ],
        },
      ]}
    />
  );
}

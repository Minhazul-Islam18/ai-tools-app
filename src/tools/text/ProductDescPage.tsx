import { ShoppingBag } from "lucide-react";
import { TextToolPage } from "../shared/TextToolPage";

export function ProductDescPage() {
  return (
    <TextToolPage
      toolType="product_desc"
      title="Product Description"
      description="Write compelling ecommerce product descriptions"
      freeDescription="Llama 3.3 70B — unlimited free generation"
      proDescription="GPT-4o — premium quality, bulk generation"
      icon={<ShoppingBag className="w-6 h-6" />}
      promptLabel="Product details"
      promptPlaceholder="Describe your product: name, features, materials, target audience, key benefits...&#10;&#10;Example: Leather wallet, slim design, 6 card slots, RFID blocking, genuine full-grain leather, unisex, premium feel."
      resultLabel="Product Description"
      toolOptions={[
        {
          key: "tone",
          label: "Tone",
          defaultValue: "professional",
          options: [
            { value: "professional", label: "Professional" },
            { value: "casual", label: "Casual" },
            { value: "luxury", label: "Luxury" },
            { value: "playful", label: "Playful" },
          ],
        },
        {
          key: "language",
          label: "Language",
          defaultValue: "English",
          options: [
            { value: "English", label: "English" },
            { value: "Spanish", label: "Spanish" },
            { value: "French", label: "French" },
            { value: "German", label: "German" },
            { value: "Bengali", label: "Bengali" },
          ],
        },
      ]}
    />
  );
}

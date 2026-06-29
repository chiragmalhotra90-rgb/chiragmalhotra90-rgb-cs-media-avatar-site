import type { Metadata } from "next";
import { PresenterBuilder } from "@/components/presenter/presenter-builder";

export const metadata: Metadata = {
  title: "AI Presenter Builder - CS Media & Production",
  description:
    "Upload a PPTX or knowledge base and generate a live AI presenter trained on the material.",
};

export default function AiPresenterBuilderPage() {
  return <PresenterBuilder />;
}

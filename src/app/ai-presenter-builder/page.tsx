import type { Metadata } from "next";
import { PresenterBuilderClient } from "@/components/presenter/presenter-builder-client";

export const metadata: Metadata = {
  title: "AI Presenter Builder · CS Media",
  description: "Upload a deck and generate a Maya-style AI presenter — knowledge base, guardrails, and a live avatar.",
};

export default function AiPresenterBuilderPage() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <PresenterBuilderClient />
    </main>
  );
}

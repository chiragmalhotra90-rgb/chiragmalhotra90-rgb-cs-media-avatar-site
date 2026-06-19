import { AuroraBackground } from "@/components/site/aurora-background";
import { CustomCursor } from "@/components/site/custom-cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { Navbar } from "@/components/site/navbar";
import { AvatarHero } from "@/components/avatar/avatar-hero";
import { MoodSelector } from "@/components/avatar/mood-selector";
import { VoiceCommandButton } from "@/components/avatar/voice-command-button";
import { Problem } from "@/components/site/problem";
import { Engine } from "@/components/site/engine";
import { Services } from "@/components/site/services";
import { Workflow } from "@/components/site/workflow";
import { ProofOfWork } from "@/components/site/proof-of-work";
import { Onboarding } from "@/components/site/onboarding";
import { Pricing } from "@/components/site/pricing";
import { CTA, Footer } from "@/components/site/cta-footer";
import { PaletteProvider } from "@/lib/site/palette-context";
import { AvatarSourceProvider } from "@/lib/avatar/avatar-source-context";
import { VoiceCommandProvider } from "@/lib/avatar/voice-commands";

// Server-side: check if HeyGen/LiveAvatar is configured so we can show the toggle.
// Accepts either LIVEAVATAR_API_KEY (preferred — matches cs-media-next) or
// HEYGEN_API_KEY (legacy fallback).
const HEYGEN_AVAILABLE = !!(
  process.env.LIVEAVATAR_API_KEY ||
  process.env.LIVEAVATAR_AVATAR_ID ||
  process.env.HEYGEN_API_KEY
);

export default function Home() {
  return (
    <PaletteProvider>
      <VoiceCommandProvider>
        <AvatarSourceProvider heygenAvailable={HEYGEN_AVAILABLE}>
          <AuroraBackground />
          <ScrollProgress />
          <CustomCursor />
          <Navbar />
          <MoodSelector>
            <main className="relative min-h-screen">
              <AvatarHero heygenAvailable={HEYGEN_AVAILABLE} />
              <Problem />
              <Engine />
              <Services />
              <Workflow />
              <ProofOfWork />
              <Onboarding />
              <Pricing />
              <CTA />
            </main>
            <Footer />
            <VoiceCommandButton />
          </MoodSelector>
        </AvatarSourceProvider>
      </VoiceCommandProvider>
    </PaletteProvider>
  );
}

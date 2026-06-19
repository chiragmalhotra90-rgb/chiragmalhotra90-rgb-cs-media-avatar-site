// src/lib/avatar/mood-greetings.ts
//
// All 31 greeting strings verbatim from the client brief.
// 3 moods × (4 first-time + variable recall) variations.
// Codex: drop this file in as-is. Do not paraphrase.

export type Mood = "casual" | "funny" | "professional";

export const FIRST_TIME_GREETINGS: Record<Mood, string[]> = {
  casual: [
    "Hey there — I'm the CS Media AI. Photography, video, websites, branding, CRM, automation — we do it all. What are you looking to build?",
    "I'm CS Media's digital brain. We turn brands into experiences — photo, video, sites, AI, the works. Where should we start?",
    "Welcome to CS Media. I handle the questions; our team handles the rest — photography, video, websites, branding, you name it. What can I help with today?",
    "CS Media here — we make brands look and work better. Photography, video, web, AI, CRM. What's on your mind?",
  ],
  funny: [
    "Oh, hello. I'm CS Media's AI — don't worry, I'm not here to steal your job. Just here to help you build something cool. Photography, video, websites, branding, CRM, AI avatars — basically if it makes a brand look good, we're on it. So... what's broken?",
    "Hi. I'm the AI spokesperson for CS Media. Yes, I know — another AI. But I come with actual humans behind me who do photography, video, websites, branding, and automation. I'm just the face. A very handsome algorithm. What can we build for you?",
    "Welcome. I'm the CS Media digital spokesperson. We do photography, video, AI, websites, branding — pretty much everything short of baking you a cake. (We're working on that.) What brings you in?",
    "Hey! I'm CS Media's avatar — part guide, part hype machine, fully digital. We do photo, video, web, CRM, branding, AI — it's a lot. I don't sleep. You probably should. Anyway — what are we creating?",
  ],
  professional: [
    "Good day. I'm the digital spokesperson for CS Media — a full-service brand agency specializing in photography, video production, AI solutions, web development, CRM systems, branding, and marketing automation. How can we support your business today?",
    "Welcome to CS Media. I represent our integrated brand services — photography, videography, web design, AI avatars, CRM, and marketing automation. What can we help you with?",
    "Hello. I'm the CS Media AI representative. Our team delivers end-to-end brand solutions — from photography and video production to websites, CRM, branding, and automation. What project can we assist you with?",
    "Welcome. I'm your point of contact at CS Media. We offer a connected suite of services: photography, video, AI, websites, branding, CRM, and marketing automation. Please tell me what you're looking to achieve.",
  ],
};

export const RECALL_GREETINGS: Record<Mood, string[]> = {
  casual: [
    "Ah, you're back, [Name]. Still mulling over that website design, aren't you? 😏 Want me to nudge you in the right direction?",
    "[Name]! Knew you'd be back. Let me guess — still staring at those design options? Come on, let's settle this.",
    "Welcome back, [Name]. Noticed you left without deciding on the site design. Still stuck? I've got opinions.",
    "Ahh, [Name] returns. The website design, right? I've been waiting. Want me to just pick for you?",
    "Back again, [Name]. Still undecided? Say the word — I'll help you land it.",
  ],
  funny: [
    "[Name]! I knew you'd be back. Not because I'm psychic — because nobody makes a website decision in one visit. So. Shall we actually finish this?",
    "Ahh, [Name]. Second visit. Same dilemma. You know the website design won't pick itself, right? I've been here. Waiting. Recalculating. Let's go.",
    "[NAME]! *dramatically stands up* You came back! I thought you'd abandoned me. The design mockups were getting lonely. Can we please decide now?",
    "Back again, [Name]. Let me guess — you opened 17 tabs, watched 3 YouTube videos about web design, asked 2 friends, and still couldn't decide. It's okay. I'm not your friends. I actually know what works.",
    "[Name]... I see you. I always see you. And I see you still haven't picked a design. Look, I'm an AI — I can literally do this forever. Can you?",
    "Ahh [Name] returns. Based on your cursor movements last time — 47 seconds on the hero layout, 12 seconds on the footer, zero clicks — I'd say you're overthinking this. Want help or just here for the vibes?",
    "[Name]! You're back! I was starting to think it was something I said. 😔 The website design? Still waiting. I don't mind. Really. I'm fine. Everything's fine. Let's go.",
  ],
  professional: [
    "Welcome back, [Name]. I see you were previously reviewing our website design options. Would you like to continue where you left off? I'm here to help you finalize your decision.",
    "Good to see you again, [Name]. It appears the website design selection is still outstanding from your last visit. May I assist you in narrowing down the options?",
    "Welcome back, [Name]. Your website design consultation is still open. Shall we resume?",
    "[Name], welcome back. I've kept your previous session details available — you were reviewing website design concepts. Would you like my guidance to help you reach a decision?",
    "[Name] — good to see you. Your design selection is pending. Ready to proceed?",
    "Welcome back, [Name]. Based on your last visit, the website design remains the outstanding item. I can walk you through the options or provide a recommendation if that would be helpful.",
    "Hello again, [Name]. I noticed you were evaluating our website design packages during your previous session. May I offer some insight to assist your decision?",
  ],
};

// Count: 4×3 first-time + (5+7+7) recall = 12 + 19 = 31 total strings.

/**
 * Strip [Name]/[NAME] placeholders when no name is available
 * (login is currently disabled, so this is the common path).
 */
export function personalizeGreeting(greeting: string, name?: string): string {
  if (name) {
    return greeting
      .replace(/\[Name\]/g, name)
      .replace(/\[NAME\]/g, name.toUpperCase());
  }
  // No name available — strip "[Name] " / "[NAME] " prefixes cleanly
  // so the copy still reads naturally without the placeholder.
  return greeting
    .replace(/\[NAME\]!\s+\*dramatically stands up\*\s+You came back!/g, "You came back! *dramatically stands up*")
    .replace(/Ahh,?\s+\[Name\]\s+returns\./g, "Ahh, you return.")
    .replace(/^\[Name\][\s,]*!/i, "")
    .replace(/^\[Name\],\s*/i, "")
    .replace(/^\[Name\]\s*—\s*/i, "")
    .replace(/^\[Name\]\.\.\.\s*/i, "")
    .replace(/^\[Name\][\s,]+/i, "")
    .replace(/^\[NAME\][\s,]*!/i, "")
    .replace(/^\[NAME\],\s*/i, "")
    .replace(/^\[NAME\]\s*—\s*/i, "")
    .replace(/^\[NAME\]\.\.\.\s*/i, "")
    .replace(/^\[NAME\][\s,]+/i, "")
    .replace(/,\s*\[Name\](?=\.)/g, "")
    .replace(/,\s*\[NAME\](?=\.)/g, "")
    .replace(/\s+\[Name\](?=[\s,.!?—])/g, "")
    .replace(/\s+\[NAME\](?=[\s,.!?—])/g, "")
    .replace(/\[Name\]/g, "")
    .replace(/\[NAME\]/g, "")
    .replace(/\s+,/g, ",")
    .replace(/,\s*\./g, ".")
    .replace(/\s{2,}/g, " ")
    .replace(/^[a-z]/, (c) => c.toUpperCase())
    .trim();
}

/**
 * Pick a greeting deterministically by day so the same visitor
 * hears the same greeting on the same day (feels intentional).
 */
export function pickGreeting(
  mood: Mood,
  status: "first-time" | "returning"
): string {
  const pool =
    status === "first-time"
      ? FIRST_TIME_GREETINGS[mood]
      : RECALL_GREETINGS[mood];
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return pool[dayIndex % pool.length];
}

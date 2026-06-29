/**
 * AI Presenter Builder — file extraction + heuristic presenter-pack generation.
 *
 * Independent implementation (no LLM dependency): we parse the uploaded deck/notes
 * into "slides", then derive a Maya-style presenter pack (opening line, knowledge
 * base, guardrails, suggested questions, and a LiveAvatar context prompt) with
 * deterministic heuristics. Everything here is server-side.
 */

import JSZip from "jszip";

export type DeckSlide = { index: number; title: string; bullets: string[] };

export type PresenterPack = {
  title: string;
  openingLine: string;
  knowledgeBase: { heading: string; points: string[] }[];
  guardrails: string[];
  suggestedQuestions: string[];
  liveAvatarPrompt: string;
};

export type ExtractResult = { slides: DeckSlide[]; sourceKind: string };

const XML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

function decodeXml(s: string): string {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&[a-z]+;/g, (m) => XML_ENTITIES[m] ?? m)
    .trim();
}

function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function ext(fileName: string): string {
  const m = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "";
}

/** Extract slide text from a .pptx (it's a zip of slideN.xml files). */
async function extractPptx(buffer: ArrayBuffer): Promise<DeckSlide[]> {
  const zip = await JSZip.loadAsync(buffer);
  const slideNames = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => {
      const na = Number(a.match(/slide(\d+)\.xml/)?.[1] ?? 0);
      const nb = Number(b.match(/slide(\d+)\.xml/)?.[1] ?? 0);
      return na - nb;
    });

  const slides: DeckSlide[] = [];
  for (let i = 0; i < slideNames.length; i++) {
    const xml = await zip.files[slideNames[i]].async("string");
    const runs = [...xml.matchAll(/<a:t>([\s\S]*?)<\/a:t>/g)]
      .map((m) => decodeXml(m[1]))
      .filter(Boolean);
    if (!runs.length) continue;
    slides.push({ index: i + 1, title: runs[0], bullets: runs.slice(1) });
  }
  return slides;
}

/** Turn plain text / markdown into slides by headings or blank-line blocks. */
function extractText(text: string): DeckSlide[] {
  const lines = text.split(/\r?\n/);
  const slides: DeckSlide[] = [];
  let current: DeckSlide | null = null;
  const push = () => {
    if (current && (current.title || current.bullets.length)) slides.push(current);
  };
  const isHeading = (l: string) =>
    /^#{1,6}\s+/.test(l) || (/^[A-Z0-9][^a-z]{0,80}$/.test(l.trim()) && l.trim().length > 2 && l.trim().length < 80);

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (isHeading(line)) {
      push();
      current = { index: slides.length + 1, title: line.replace(/^#{1,6}\s+/, ""), bullets: [] };
    } else {
      if (!current) current = { index: slides.length + 1, title: "Overview", bullets: [] };
      current.bullets.push(line.replace(/^[-*•]\s+/, ""));
    }
  }
  push();
  return slides.length ? slides : [{ index: 1, title: "Notes", bullets: [clean(text).slice(0, 600)] }];
}

function extractCsv(text: string): DeckSlide[] {
  const rows = text.split(/\r?\n/).map((r) => r.trim()).filter(Boolean);
  if (!rows.length) return [{ index: 1, title: "Data", bullets: [] }];
  const header = rows[0];
  return [
    { index: 1, title: "Data", bullets: [`Columns: ${header}`, ...rows.slice(1, 25)] },
  ];
}

function extractJson(text: string): DeckSlide[] {
  try {
    const data = JSON.parse(text);
    const slides: DeckSlide[] = [];
    const walk = (obj: unknown, heading: string) => {
      if (obj && typeof obj === "object" && !Array.isArray(obj)) {
        const points: string[] = [];
        for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
          if (v && typeof v === "object") walk(v, k);
          else points.push(`${k}: ${String(v)}`);
        }
        if (points.length) slides.push({ index: slides.length + 1, title: heading, bullets: points });
      } else if (Array.isArray(obj)) {
        obj.slice(0, 30).forEach((item, i) => walk(item, `${heading} ${i + 1}`));
      }
    };
    walk(data, "Overview");
    return slides.length ? slides : extractText(text);
  } catch {
    return extractText(text);
  }
}

export async function extractSlides(buffer: ArrayBuffer, fileName: string): Promise<ExtractResult> {
  const e = ext(fileName);
  if (e === "pptx") return { slides: await extractPptx(buffer), sourceKind: "pptx" };
  const text = new TextDecoder().decode(buffer);
  if (e === "json") return { slides: extractJson(text), sourceKind: "json" };
  if (e === "csv") return { slides: extractCsv(text), sourceKind: "csv" };
  // txt, md, yaml/yml — line/heading based
  return { slides: extractText(text), sourceKind: e || "text" };
}

/* ── Heuristic pack generation ──────────────────────────────────────────── */

function titleFromFile(fileName: string): string {
  return clean(fileName.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ")) || "Your Presentation";
}

function toQuestion(title: string): string {
  const t = clean(title).replace(/[?:.]+$/, "");
  if (/^(why|what|how|who|when|where|which|is|are|do|does|can)\b/i.test(t)) return `${t}?`;
  return `Tell me about ${t.toLowerCase()}.`;
}

export function buildPack(slides: DeckSlide[], fileName: string): PresenterPack {
  const title = titleFromFile(fileName);
  const contentSlides = slides.filter((s) => clean(s.title).length);
  const topics = contentSlides.map((s) => clean(s.title)).filter(Boolean);

  const knowledgeBase = contentSlides.map((s) => ({
    heading: clean(s.title) || `Slide ${s.index}`,
    points: s.bullets.map(clean).filter(Boolean).slice(0, 8),
  }));

  const topTopics = topics.slice(0, 3).join(", ");
  const openingLine =
    `Hi, I'm Maya — your AI presenter for ${title}. ` +
    (topTopics ? `I can walk you through ${topTopics}, or anything else in here. ` : "") +
    `What would you like to start with?`;

  const suggestedQuestions = Array.from(new Set(topics.map(toQuestion))).slice(0, 8);

  const guardrails = [
    "Answer only from the presentation's knowledge base below; do not invent facts, numbers, names, or claims.",
    "Keep answers to 3-5 short sentences unless asked to go deeper.",
    "If something isn't covered here, say you don't have that to hand and offer to follow up — never make it up.",
    "Stay professional and on-topic; politely redirect off-topic questions back to the presentation.",
    "Do not promise outcomes, pricing, or commitments that aren't explicitly in the material.",
  ];

  const kbText = knowledgeBase
    .map((k) => `## ${k.heading}\n${k.points.map((p) => `- ${p}`).join("\n")}`)
    .join("\n\n");

  const liveAvatarPrompt = [
    `You are Maya, a warm, concise AI presenter for "${title}". Open by briefly introducing yourself, then answer the audience's questions. Speak only after they finish; keep replies to 3-5 short sentences.`,
    "",
    "RULES:",
    ...guardrails.map((g) => `- ${g}`),
    "",
    "KNOWLEDGE BASE:",
    kbText,
  ].join("\n");

  return { title, openingLine, knowledgeBase, guardrails, suggestedQuestions, liveAvatarPrompt };
}

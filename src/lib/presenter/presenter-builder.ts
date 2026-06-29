import JSZip from "jszip";
import { chatComplete } from "@/lib/avatar/llm";
import type { ChatMessage } from "z-ai-web-dev-sdk";

export const MAX_PRESENTER_UPLOAD_BYTES = 12 * 1024 * 1024;
export const MAX_MODEL_SOURCE_CHARS = 26000;
export const MAX_RESPONSE_SOURCE_CHARS = 14000;

export type PresenterBuild = {
  projectName: string;
  presenterName: string;
  fileName: string;
  fileType: string;
  bytes: number;
  slideCount: number;
  charCount: number;
  extractedText: string;
  oneLine: string;
  openingText: string;
  knowledgeBase: string;
  presenterPrompt: string;
  guardrails: string[];
  suggestedQuestions: string[];
};

type ExtractedSource = {
  text: string;
  slideCount: number;
};

type AiPresenterPack = {
  presenterName?: string;
  oneLine?: string;
  openingText?: string;
  knowledgeBase?: string;
  guardrails?: string[];
  suggestedQuestions?: string[];
};

const SUPPORTED_EXTENSIONS = new Set([
  "pptx",
  "txt",
  "md",
  "markdown",
  "json",
  "yaml",
  "yml",
  "csv",
]);

export function getFileExtension(name: string): string {
  const cleanName = name.split("?")[0]?.split("#")[0] ?? "";
  return cleanName.includes(".")
    ? cleanName.split(".").pop()?.toLowerCase() ?? ""
    : "";
}

export function isSupportedPresenterFile(name: string): boolean {
  return SUPPORTED_EXTENSIONS.has(getFileExtension(name));
}

export async function extractPresenterSource(
  fileName: string,
  buffer: Buffer
): Promise<ExtractedSource> {
  const ext = getFileExtension(fileName);

  if (!isSupportedPresenterFile(fileName)) {
    throw new Error("Unsupported file. Upload PPTX, TXT, MD, JSON, YAML, or CSV.");
  }

  if (ext === "pptx") {
    return extractPptx(buffer);
  }

  const text = normalizeText(buffer.toString("utf8"));
  if (!text) {
    throw new Error("The file did not contain readable text.");
  }

  return {
    text,
    slideCount: 0,
  };
}

async function extractPptx(buffer: Buffer): Promise<ExtractedSource> {
  const zip = await JSZip.loadAsync(buffer);
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort(byPptxIndex);

  if (slideFiles.length === 0) {
    throw new Error("No PowerPoint slides were found in this PPTX.");
  }

  const slideTexts = await Promise.all(
    slideFiles.map(async (name, index) => {
      const xml = await zip.files[name]?.async("string");
      const text = extractOfficeXmlText(xml ?? "");
      return text ? `Slide ${index + 1}\n${text}` : "";
    })
  );

  const noteFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(name))
    .sort(byPptxIndex);

  const noteTexts = await Promise.all(
    noteFiles.map(async (name, index) => {
      const xml = await zip.files[name]?.async("string");
      const text = extractOfficeXmlText(xml ?? "");
      return text ? `Speaker notes ${index + 1}\n${text}` : "";
    })
  );

  const text = normalizeText([...slideTexts, ...noteTexts].filter(Boolean).join("\n\n"));
  if (!text) {
    throw new Error("The PPTX had slides, but no readable text.");
  }

  return {
    text,
    slideCount: slideFiles.length,
  };
}

function byPptxIndex(a: string, b: string) {
  return extractLastNumber(a) - extractLastNumber(b);
}

function extractLastNumber(value: string) {
  const match = value.match(/(\d+)(?!.*\d)/);
  return match ? Number(match[1]) : 0;
}

function extractOfficeXmlText(xml: string): string {
  const pieces: string[] = [];
  const textMatches = xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g);

  for (const match of textMatches) {
    const value = decodeXml(match[1] ?? "").trim();
    if (value) pieces.push(value);
  }

  return normalizeText(pieces.join("\n"));
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function normalizeText(value: string): string {
  return value
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ \u00a0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

export async function buildPresenterPack(params: {
  projectName: string;
  fileName: string;
  fileType: string;
  bytes: number;
  slideCount: number;
  sourceText: string;
  audience?: string;
  purpose?: string;
}): Promise<PresenterBuild> {
  const projectName = params.projectName.trim() || inferProjectName(params.fileName);
  const sourceForModel = params.sourceText.slice(0, MAX_MODEL_SOURCE_CHARS);
  const aiPack = await tryAiPresenterPack({
    projectName,
    audience: params.audience,
    purpose: params.purpose,
    sourceText: sourceForModel,
  });
  const fallback = buildDeterministicPack({
    projectName,
    audience: params.audience,
    purpose: params.purpose,
    sourceText: sourceForModel,
  });

  const presenterName = cleanSingleLine(aiPack?.presenterName) || fallback.presenterName;
  const oneLine = cleanSingleLine(aiPack?.oneLine) || fallback.oneLine;
  const openingText = cleanSingleLine(aiPack?.openingText) || fallback.openingText;
  const knowledgeBase = normalizeText(aiPack?.knowledgeBase || fallback.knowledgeBase);
  const guardrails = normalizeList(aiPack?.guardrails, fallback.guardrails);
  const suggestedQuestions = normalizeList(aiPack?.suggestedQuestions, fallback.suggestedQuestions);
  const presenterPrompt = buildPresenterPrompt({
    projectName,
    presenterName,
    oneLine,
    knowledgeBase,
    guardrails,
    audience: params.audience,
    purpose: params.purpose,
  });

  return {
    projectName,
    presenterName,
    fileName: params.fileName,
    fileType: params.fileType,
    bytes: params.bytes,
    slideCount: params.slideCount,
    charCount: params.sourceText.length,
    extractedText: params.sourceText.slice(0, MAX_RESPONSE_SOURCE_CHARS),
    oneLine,
    openingText,
    knowledgeBase,
    presenterPrompt,
    guardrails,
    suggestedQuestions,
  };
}

async function tryAiPresenterPack(params: {
  projectName: string;
  audience?: string;
  purpose?: string;
  sourceText: string;
}): Promise<AiPresenterPack | null> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You transform uploaded decks and knowledge bases into training packs for a live AI presenter. Return only strict JSON. Do not use markdown fences.",
    },
    {
      role: "user",
      content: JSON.stringify({
        task:
          "Create a concise AI presenter pack from this source. The presenter must answer only from the supplied knowledge, be honest about missing details, and avoid inventing numbers.",
        outputShape: {
          presenterName: "Maya",
          oneLine: "One sentence describing what this presenter explains.",
          openingText: "A natural first spoken line under 35 words.",
          knowledgeBase:
            "Clean markdown knowledge base grouped by topic. Preserve concrete facts, numbers, names, pricing, dates, and constraints.",
          guardrails: [
            "Rules the presenter must never break.",
            "How to handle unknown or out-of-scope questions.",
          ],
          suggestedQuestions: [
            "Investor/customer question 1",
            "Investor/customer question 2",
            "Investor/customer question 3",
          ],
        },
        projectName: params.projectName,
        audience: params.audience || "buyers, clients, investors, or website visitors",
        purpose: params.purpose || "interactive AI presenter",
        sourceText: params.sourceText,
      }),
    },
  ];

  try {
    const reply = await chatComplete(messages, { maxTokens: 1800 });
    const parsed = parseJsonObject(reply);
    return parsed;
  } catch (error) {
    console.warn("[presenter] AI pack generation fell back", error);
    return null;
  }
}

function parseJsonObject(value: string): AiPresenterPack | null {
  const trimmed = value.trim();
  const body = trimmed.startsWith("{")
    ? trimmed
    : trimmed.match(/\{[\s\S]*\}/)?.[0];
  if (!body) return null;
  const parsed = JSON.parse(body);
  if (!parsed || typeof parsed !== "object") return null;
  return parsed as AiPresenterPack;
}

function buildDeterministicPack(params: {
  projectName: string;
  audience?: string;
  purpose?: string;
  sourceText: string;
}): Required<AiPresenterPack> {
  const source = normalizeText(params.sourceText);
  const firstMeaningfulLine =
    source
      .split("\n")
      .map((line) => line.trim())
      .find((line) => line.length > 18) || params.projectName;

  return {
    presenterName: "Maya",
    oneLine: `${params.projectName} AI presenter trained from the uploaded knowledge base.`,
    openingText: `Hi, I am Maya, your AI presenter for ${params.projectName}. I have read the uploaded knowledge base and can walk you through it.`,
    knowledgeBase: `# ${params.projectName}\n\n${firstMeaningfulLine}\n\n## Uploaded source\n\n${source}`,
    guardrails: [
      "Answer only from the uploaded knowledge base.",
      "If a fact, price, date, valuation, claim, or metric is missing, say that it is not in the uploaded material.",
      "Do not invent customers, revenue, users, legal claims, medical claims, or guarantees.",
      "Keep spoken answers concise and natural.",
    ],
    suggestedQuestions: [
      `What is ${params.projectName}?`,
      "What problem does this solve?",
      "What are the strongest proof points?",
      "What should a buyer or investor ask next?",
    ],
  };
}

function buildPresenterPrompt(params: {
  projectName: string;
  presenterName: string;
  oneLine: string;
  knowledgeBase: string;
  guardrails: string[];
  audience?: string;
  purpose?: string;
}) {
  return normalizeText(`
You are ${params.presenterName}, the live AI presenter for ${params.projectName}.

Purpose: ${params.purpose || "present the uploaded knowledge base clearly"}.
Audience: ${params.audience || "website visitors, clients, buyers, and investors"}.

One-line context:
${params.oneLine}

Operating style:
- Speak naturally, like a polished human presenter.
- Keep answers to 3-5 short sentences unless the visitor asks for detail.
- Use the uploaded knowledge as the source of truth.
- Mention concrete facts, numbers, names, and dates only when they appear in the knowledge base.
- If something is missing, say it is not in the uploaded material and offer to have the human team follow up.

Non-negotiable guardrails:
${params.guardrails.map((rule) => `- ${rule}`).join("\n")}

Knowledge base:
${params.knowledgeBase}
`);
}

function inferProjectName(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");
  return withoutExt
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()) || "AI Presenter";
}

function cleanSingleLine(value: unknown): string {
  return typeof value === "string" ? normalizeText(value).replace(/\n+/g, " ").trim() : "";
}

function normalizeList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const cleaned = value
    .map((item) => cleanSingleLine(item))
    .filter((item) => item.length > 0)
    .slice(0, 8);
  return cleaned.length ? cleaned : fallback;
}

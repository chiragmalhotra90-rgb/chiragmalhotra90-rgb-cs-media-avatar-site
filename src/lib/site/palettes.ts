/**
 * Color palettes extracted from the client-supplied WhatsApp images.
 *
 * Each palette has a primary accent + a darker companion + a brighter
 * highlight. The site's mood engine applies these to the `--brand-accent`,
 * `--brand-accent-2`, and `--brand-accent-3` CSS variables so the entire
 * site (cursor, scrollbar, gradients, glows, 3D face particles, marquee
 * tags, etc.) retints live.
 *
 * Not all 32 images were used — the client asked for "enough options," so
 * we kept 9 distinct palettes spanning warm / cool / earthy / bold moods.
 */

export type Palette = {
  id: string;
  name: string;
  description: string;
  accent: string;   // primary
  accent2: string;  // companion
  accent3: string;  // highlight
  bg: string;       // page background (very dark)
};

export const PALETTES: Palette[] = [
  {
    id: "midnight-cyan",
    name: "Midnight Cyan",
    description: "Default. Cool, executive-grade.",
    accent: "#00f0ff",
    accent2: "#ff0066",
    accent3: "#ffea00",
    bg: "#0a0b12",
  },
  {
    id: "tangerine-leaf",
    name: "Tangerine & Leaf",
    description: "Vibrant, earthy, modern-natural.",
    accent: "#F58F20",
    accent2: "#467434",
    accent3: "#FFFFFF",
    bg: "#0d0f0a",
  },
  {
    id: "moss-iris",
    name: "Moss & Iris",
    description: "Soft, elegant, slightly whimsical.",
    accent: "#8F9D68",
    accent2: "#7A57CD",
    accent3: "#FFF8EB",
    bg: "#0c0d10",
  },
  {
    id: "charcoal-sandy-steel",
    name: "Charcoal · Sandy · Steel",
    description: "Balanced neutral — warm + cool.",
    accent: "#E19C63",
    accent2: "#8BA5BE",
    accent3: "#27262E",
    bg: "#0a0a0e",
  },
  {
    id: "aqua-blanc-carmin",
    name: "Aqua · Blanc · Carmin",
    description: "Clean and modern with a bold accent.",
    accent: "#95D9C0",
    accent2: "#D41F26",
    accent3: "#FFFFFF",
    bg: "#0a0e0c",
  },
  {
    id: "caramel-papaya-blue",
    name: "Caramel · Papaya · Baby Blue",
    description: "Warm and fresh.",
    accent: "#C07F45",
    accent2: "#97C6E0",
    accent3: "#FCEDD6",
    bg: "#0c0a08",
  },
  {
    id: "caribbean-papaya",
    name: "Caribbean Blue & Papaya",
    description: "Tropical, cheerful, vibrant.",
    accent: "#00B4D8",
    accent2: "#FFCF56",
    accent3: "#FFFFFF",
    bg: "#07131a",
  },
  {
    id: "aquamarine-magenta",
    name: "Aquamarine & Magenta",
    description: "Bright teal + deep purple. Bold.",
    accent: "#3DCFAA",
    accent2: "#6D0070",
    accent3: "#FFFFFF",
    bg: "#0a0710",
  },
  {
    id: "lemon-berry",
    name: "Lemon Fizz & Berry Dark",
    description: "Citrus brightness meets deep berry.",
    accent: "#FFF44F",
    accent2: "#92000A",
    accent3: "#FFB74D",
    bg: "#0d0a02",
  },
  {
    id: "golden-forest",
    name: "Golden Rush & Deep Forest",
    description: "Warm gold + earthy deep forest green.",
    accent: "#FFD700",
    accent2: "#1B4332",
    accent3: "#FF9800",
    bg: "#080d0a",
  },
];

export const DEFAULT_PALETTE_ID = "midnight-cyan";

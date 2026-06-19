import type { Metadata } from "next";
import { Space_Grotesk, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CS Media & Production — The Autonomous Production House",
  description:
    "AI-powered content, video, websites, CRM, AI presenters & branded growth assets — built under one connected engine for doctors, founders, brands & sports IPs.",
  keywords: [
    "CS Media",
    "AI content production",
    "AI avatar",
    "short-form video",
    "website & CRM",
    "pitch decks",
    "brand growth",
    "India production house",
  ],
  authors: [{ name: "CS Media & Production" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "CS Media & Production — The Autonomous Production House",
    description:
      "One brief. One engine. A full client-facing system — strategy, media, conversion infrastructure, CRM, automation & reporting.",
    url: "https://csmediaandproduction.in",
    siteName: "CS Media & Production",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CS Media & Production — The Autonomous Production House",
    description:
      "AI-powered content engine for doctors, founders, brands & sports IPs. Built in under 90 days.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

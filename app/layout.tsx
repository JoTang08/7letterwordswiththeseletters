import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Word Finder - Find Words With These Letters",
  description: "Find words with these letters instantly. Free word finder for Scrabble, Wordle, and word puzzles.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

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
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Z1PJBR3SQM" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Z1PJBR3SQM');
        `}} />
      </head>
      <body>{children}</body>
    </html>
  );
}

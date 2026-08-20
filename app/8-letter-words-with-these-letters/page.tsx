import type { Metadata } from "next";
import Link from "next/link";
import EightLetterFinder from "@/components/EightLetterFinder";
import { PAGE_CONFIGS } from "@/lib/config";
import "./eight.css";

export const metadata: Metadata = {
  title: "8-Letter Word Finder (7 Rack Letters + 1 Board Tile) - Bingo Solver",
  description: "Enter your 7 Scrabble tiles to instantly find every 8-letter Bingo word by hooking onto 1 board letter. Grouped by board tile with +50 bonus points.",
  alternates: { canonical: "https://7letterwordswiththeseletters.com/8-letter-words-with-these-letters/" },
  openGraph: {
    type: "website",
    url: "https://7letterwordswiththeseletters.com/8-letter-words-with-these-letters/",
    title: "8-Letter Word Finder (7 Rack Letters + 1 Board Tile)",
    description: "Find every 8-letter Bingo by hooking 7 rack tiles onto 1 board letter. +50 point bonus breakdown included.",
  },
};

const otherPages = PAGE_CONFIGS.filter((c) => c.n !== 8);

export default function EightLetterPage() {
  return (
    <div className="el-page">

      {/* ── Header ── */}
      <header className="el-header">
        <Link href="/" className="el-back">← Home</Link>
        <h1 className="el-h1">8-Letter Word Finder</h1>
        <p className="el-sub">Turn your 7-letter rack into an 8-letter Bingo bonus by hooking onto 1 board letter.</p>
      </header>

      {/* ── Finder ── */}
      <EightLetterFinder />

      {/* ── Explainer ── */}
      <div className="el-seo">
        <section className="el-card">
          <h2>How 8-Letter Bingos Work in Scrabble & Words With Friends</h2>
          <p>
            In Scrabble and Words With Friends, a <strong>Bingo</strong> means playing all 7 tiles from your
            rack in a single turn — earning a <strong>+50 point bonus</strong> on top of the word&apos;s base score.
            But you can also trigger a Bingo with only <strong>6 or 7 rack tiles</strong> by hooking onto a letter
            already on the board to form an <strong>8-letter word</strong>.
          </p>
          <p>
            This tool finds exactly that scenario: enter your 7 rack tiles, and it automatically checks all
            26 possible board letters (A–Z) to reveal every valid 8-letter Bingo you can make by extending
            an existing word on the board.
          </p>

          <h3>Why 8-Letter Bingos Matter</h3>
          <ul className="el-list">
            <li>Earns the full <strong>+50 Bingo bonus</strong> — same as a 7-tile play.</li>
            <li>Often lands on <strong>premium squares</strong> (Double/Triple Word) further out on the board.</li>
            <li>Opponents rarely block all possible hook letters, making these plays hard to prevent.</li>
            <li>Knowing your rack&apos;s 8-letter potential gives you a major strategic edge.</li>
          </ul>

          <h3>How to Use This Tool</h3>
          <ol className="el-list el-list--ol">
            <li>Enter your <strong>7 rack letters</strong> into the search box.</li>
            <li>Use <strong>?</strong> for a blank tile wildcard.</li>
            <li>Click <strong>Find 8-Letter Bingos</strong> — results are grouped by the board letter you need.</li>
            <li>Scan the board for that letter and play your Bingo!</li>
          </ol>
        </section>

        <section className="el-card">
          <h2>Frequently Asked Questions</h2>
          <p><strong>What is an 8-letter Bingo in Scrabble?</strong><br />
          An 8-letter Bingo occurs when you use all 7 of your rack tiles plus 1 letter already on the board to form an 8-letter word in a single turn, earning the standard +50 Bingo bonus.</p>

          <p><strong>Which dictionary does this tool use?</strong><br />
          The default word list is Collins Scrabble Words (CSW/SOWPODS) with 51,626 valid 8-letter words — the international standard. Switch to NWL for North American tournaments.</p>

          <p><strong>Can I use a blank tile?</strong><br />
          Yes — type <strong>?</strong> to represent a blank tile. It matches any letter with a point value of 0.</p>

          <p><strong>Is my search private?</strong><br />
          Yes. All lookups happen entirely in your browser. No letters you enter are sent to our servers. See our <a href="/privacy/">Privacy Policy</a>.</p>
        </section>

        {/* Footer */}
        <footer className="el-footer">
          <p>
            Also try:{" "}
            {otherPages.map((c, i) => (
              <span key={c.n}>
                {i > 0 && " · "}
                <Link href={c.n === 7 ? "/" : `/${c.slug}/`}>{c.n} Letters</Link>
              </span>
            ))}
          </p>
          <p>8 Letter Words With These Letters &copy; 2026</p>
        </footer>
      </div>
    </div>
  );
}

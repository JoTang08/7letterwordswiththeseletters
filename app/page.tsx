import type { Metadata } from "next";
import WordFinderPage from "@/components/WordFinderPage";
import { getConfig } from "@/lib/config";

const config = getConfig(7);

export const metadata: Metadata = {
  title: "7 Letter Words With These Letters - Find Words Instantly",
  description: config.description,
  alternates: { canonical: "https://7letterwordswiththeseletters.com/" },
  openGraph: {
    type: "website",
    url: "https://7letterwordswiththeseletters.com/",
    title: "7 Letter Words With These Letters - Find Words Instantly",
    description: config.description,
    images: [{ url: "https://7letterwordswiththeseletters.com/og-image.png", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <WordFinderPage config={config}>
      <div className="info-section">
        <img
          src="/images/7-letter-words-finder.png"
          alt="7 Letter Words With These Letters - word finder tool interface"
          className="tool-screenshot"
          width={1280}
          height={800}
        />
        <h2>How to Find 7 Letter Words With These Letters</h2>
        <p>Stuck on a 7-letter word puzzle? Our tool instantly finds all valid English words you can make from your letters:</p>
        <ul>
          <li><strong>Type your letters</strong> — any order, up to 7 characters</li>
          <li><strong>Use ? as a wildcard</strong> — one ? replaces one unknown letter</li>
          <li><strong>Get instant results</strong> — all 7-letter matches shown immediately</li>
        </ul>
        <p>Perfect for <strong>Scrabble</strong>, <strong>Wordle</strong>, <strong>Words With Friends</strong>, crossword puzzles, and anagram solving.</p>
      </div>

      <section className="info-section">
        <h2>Find Any 7-Letter Word From Your Letters</h2>
        <p>Scrabble players, Wordle enthusiasts, and crossword solvers all face the same problem: you have a set of letters in front of you and need to know every possible 7-letter word you can form. This tool does the heavy lifting instantly — just enter your letters and get every valid 7-letter word in seconds.</p>

        <h3>Why Focus on 7-Letter Words?</h3>
        <p>In Scrabble, playing all seven tiles from your rack at once earns a 50-point bonus called a &ldquo;bingo.&rdquo; That single bonus can swing an entire game. Experienced players constantly scan their racks for bingo opportunities, and knowing which combinations of seven letters form valid words is a core competitive skill.</p>

        <h3>Tips for Solving 7-Letter Word Puzzles</h3>
        <ul>
          <li>Look for common prefixes like <strong>RE-</strong>, <strong>UN-</strong>, <strong>IN-</strong>, <strong>OUT-</strong></li>
          <li>Check for common suffixes like <strong>-ING</strong>, <strong>-TION</strong>, <strong>-ABLE</strong>, <strong>-NESS</strong></li>
          <li>Learn high-frequency stems: <strong>AEINRST</strong> — the &ldquo;magnificent seven&rdquo;</li>
          <li>Use <strong>?</strong> wildcard when stuck — a blank tile often unlocks new words</li>
        </ul>

        <h3>Frequently Asked Questions</h3>
        <p><strong>Can I use this for Scrabble?</strong><br />Yes — the word list is Collins Scrabble Words (SOWPODS), the official authority for international tournament play. Every word shown is a legitimate, challengeable play.</p>
        <p><strong>What does the ? wildcard do?</strong><br />A <strong>?</strong> acts as a blank tile — it can represent any letter. Type the known letters followed by <code>?</code> and the tool will find all 7-letter words possible.</p>
        <p><strong>What is a 7 letter word with these letters?</strong><br />It depends on your letters — there&rsquo;s no single answer. Enter your letters in the tool above and you&rsquo;ll instantly see every valid 7-letter word you can form (32,909 possibilities in the Collins SOWPODS list).</p>
      </section>

      <section className="info-section">
        <h2>Our Word List: Collins Scrabble Words (SOWPODS)</h2>
        <p>This solver uses SOWPODS, covering <strong>32,909 valid 7-letter words</strong> accepted in international and UK Scrabble competition. The list includes standard inflections: plurals, past tenses, gerunds, and comparative forms. Proper nouns, abbreviations, and hyphenated words are excluded.</p>
        <p>This tool runs entirely in your browser — no letters you enter are sent to any server. See our <a href="/privacy/">privacy policy</a> for details.</p>
      </section>
    </WordFinderPage>
  );
}

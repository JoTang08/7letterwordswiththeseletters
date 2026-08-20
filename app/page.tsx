import type { Metadata } from "next";
import Link from "next/link";
import HomeWordFinder from "@/components/HomeWordFinder";
import { PAGE_CONFIGS } from "@/lib/config";
import "./home.css";

export const metadata: Metadata = {
  title: "7 Letter Words With These Letters - Find Words Instantly",
  description: "Find every 7-letter word from your letters instantly. Free anagram solver for Scrabble (NWL & Collins CSW) and Words With Friends. 25,000+ words.",
  alternates: { canonical: "https://7letterwordswiththeseletters.com/" },
  openGraph: {
    type: "website",
    url: "https://7letterwordswiththeseletters.com/",
    title: "7 Letter Words With These Letters - Find Words Instantly",
    description: "Find every 7-letter word from your letters instantly. Free anagram solver for Scrabble, Wordle, and word puzzles.",
    images: [{ url: "https://7letterwordswiththeseletters.com/og-image.png", width: 1200, height: 630 }],
  },
};

const otherPages = PAGE_CONFIGS.filter((c) => c.n !== 7);

export default function HomePage() {
  return (
    <div className="home-page">
      <HomeWordFinder />

      {/* SEO content */}
      <div className="home-seo">
        <section className="home-seo-section">
          <h2>What Is a 7-Letter Word With These Letters?</h2>
          <p>
            A 7-letter word made from your letter tiles is a <strong>7-letter anagram</strong> — a word
            formed by rearranging exactly seven letters. In word games like <strong>Scrabble</strong> and{" "}
            <strong>Words With Friends</strong>, using all 7 tiles from your rack in a single turn triggers
            a <strong>Bingo</strong>, awarding you an extra <strong>50-point bonus</strong>!
          </p>
          <h3>How to Find All 7-Letter Words</h3>
          <ol className="home-seo-ol">
            <li><strong>Enter Your 7 Letters:</strong> Type your 7 rack letters into the search box at the top of the page.</li>
            <li><strong>Use Wildcards:</strong> Enter <strong>?</strong> or leave a space to represent blank tiles.</li>
            <li><strong>Generate Results:</strong> Click <strong>"Generate 7-Letter Anagrams"</strong> to instantly view all matching words, automatically sorted by highest point value.</li>
          </ol>
          <h3>Popular 7-Letter Bingo Examples</h3>
          <ul>
            <li><strong>AEINRST</strong> → RETAINS, NASTIER, STAINER, RETINAS</li>
            <li><strong>AILERON</strong> → AILERON</li>
            <li><strong>EIPRSST</strong> → PERSIST, PRIESTS</li>
          </ul>
        </section>

        <section className="home-seo-section">
          <h2>Find Every 7-Letter Word With These Letters</h2>
          <p>Scrabble players, Words With Friends enthusiasts, and word puzzle solvers all face the same challenge: you have a set of letters in front of you and need to find valid anagrams instantly. This tool does the heavy lifting — enter your tiles above to discover every 7-letter word using these letters in seconds.</p>

          <h3>Why Focus on 7-Letter Words?</h3>
          <p>In Scrabble and Words With Friends, playing all seven tiles from your rack in a single turn triggers a <strong>Bingo</strong> (or Bonus), awarding you an extra <strong>50-point bonus</strong>. That single move can swing an entire game. Knowing which combinations form valid 7-letter words using these letters is one of the most effective strategies to consistently outscore your opponents.</p>

          <h3>Which Dictionary Should You Choose?</h3>
          <ul>
            <li><strong>NWL (North American Word List):</strong> The official dictionary for US and Canadian Scrabble tournaments, featuring 25,473 valid 7-letter words. Select this if you play competitively in North America.</li>
            <li><strong>Collins (CSW):</strong> The official word list for international tournaments, containing 34,254 valid 7-letter words — the most extensive set available.</li>
            <li><strong>Words With Friends (WWF):</strong> Optimized for the mobile game dictionary, containing 23,133 valid 7-letter words.</li>
          </ul>

          <h3>Pro Tips for Finding 7-Letter Words</h3>
          <ul>
            <li><strong>Spot Common Prefixes:</strong> Look for starting combinations like <strong>RE-</strong>, <strong>UN-</strong>, <strong>IN-</strong>, and <strong>OUT-</strong>.</li>
            <li><strong>Find Standard Suffixes:</strong> Scan for word endings like <strong>-ING</strong>, <strong>-ED</strong>, <strong>-TION</strong>, <strong>-ABLE</strong>, and <strong>-NESS</strong>.</li>
            <li><strong>Memorize High-Frequency Stems:</strong> Master letter sets like <strong>AEINRST</strong> (the &ldquo;magnificent seven&rdquo;), which yield over 1,000 distinct 7-letter Bingo words.</li>
            <li><strong>Use Wildcards:</strong> Insert <strong>?</strong> or a space to act as a blank tile when you are one letter short.</li>
          </ul>
        </section>

        <section className="home-seo-section">
          <h2>Frequently Asked Questions</h2>
          <p><strong>How do I find every 7 letter word using these letters in my rack?</strong><br />Simply enter your seven tiles into the search box above. Our solver checks all valid anagram combinations and displays every 7-letter word made with these letters, automatically ranked by highest point value so you can score a 50-point Bingo.</p>
          <p><strong>Can I search for 7 letter words using blank tiles (wildcards)?</strong><br />Yes! Type <strong>?</strong> or a space in the search box to represent a blank tile. The tool will calculate all valid 7-letter words using your known letters plus the wildcard to unlock hidden anagrams.</p>
          <p><strong>Which dictionary should I use for Scrabble vs. Words With Friends?</strong><br />Select <strong>NWL2020</strong> for North American Scrabble tournaments, <strong>Collins (CSW21)</strong> for UK and international play, or <strong>WWF</strong> for Words With Friends to ensure 100% dictionary accuracy for your specific game.</p>
          <p><strong>Is my search private?</strong><br />Yes. This solver processes your queries locally within your browser — none of the letters or word combinations you enter are transmitted to or stored on our servers. Feel free to review our <a href="/privacy/">Privacy Policy ↗</a> for more details.</p>
        </section>

        {/* Footer nav */}
        <footer className="home-footer">
          <p>
            Also try:{" "}
            {otherPages.map((c, i) => (
              <span key={c.n}>
                {i > 0 && " · "}
                <Link href={`/${c.slug}/`}>{c.n} Letters</Link>
              </span>
            ))}
          </p>
          <p>7 Letter Words With These Letters &copy; 2026</p>
        </footer>
      </div>
    </div>
  );
}

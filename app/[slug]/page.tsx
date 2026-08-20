import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WordFinderPage from "@/components/WordFinderPage";
import { PAGE_CONFIGS, getConfig } from "@/lib/config";
import "../wfp.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PAGE_CONFIGS.filter((c) => c.n !== 7).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = PAGE_CONFIGS.find((c) => c.slug === slug);
  if (!config) return {};
  const url = `https://7letterwordswiththeseletters.com/${slug}/`;
  return {
    title: `${config.n} Letter Words With These Letters - Find Words Instantly`,
    description: config.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${config.n} Letter Words With These Letters - Find Words Instantly`,
      description: config.description,
      images: [{ url: "https://7letterwordswiththeseletters.com/og-image.png", width: 1200, height: 630 }],
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const config = PAGE_CONFIGS.find((c) => c.slug === slug);
  if (!config) notFound();

  const { n, wordCount, slug: s } = config;

  return (
    <WordFinderPage config={config}>
      <div className="info-section">
        <h2>How to Find {n} Letter Words With These Letters</h2>
        <p>
          Enter up to {n} letters and instantly find every valid {n}-letter word you can make.
          Our tool checks all {wordCount.toLocaleString()} {n}-letter words from the Collins
          Scrabble Words list and shows every match in under a second.
        </p>
        <ul>
          <li><strong>Type your letters</strong> — any order, up to {n} characters</li>
          <li><strong>Use ? as a wildcard</strong> — one ? replaces one unknown letter</li>
          <li><strong>Get instant results</strong> — all matching {n}-letter words appear immediately</li>
          <li><strong>Check definitions</strong> — hover the ? button on any word for its meaning</li>
        </ul>
        <p>
          Perfect for <strong>Scrabble</strong>, <strong>Words With Friends</strong>,
          crossword puzzles, and anagram solving.
        </p>
      </div>

      <section className="info-section">
        <h2>Our Word List: Collins Scrabble Words (SOWPODS)</h2>
        <p>
          This tool uses <strong>Collins Scrabble Words (SOWPODS)</strong>, covering{" "}
          <strong>{wordCount.toLocaleString()} valid {n}-letter words</strong> accepted in
          international and UK Scrabble competition. Every result is a legitimate play — no
          ghost words, no informal slang.
        </p>
        <p>
          The list includes standard inflections: plurals, past tenses, and comparatives.
          Proper nouns and abbreviations are excluded. The tool runs entirely in your
          browser — no letters are sent to any server. See our{" "}
          <a href="/privacy/">privacy policy</a> for details.
        </p>
      </section>
    </WordFinderPage>
  );
}

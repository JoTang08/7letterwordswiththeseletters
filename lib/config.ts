export interface PageConfig {
  n: number;
  slug: string;
  wordCount: number;
  ordinal: string;
  description: string;
  presets: { letters: string; desc: string }[];
}

export const PAGE_CONFIGS: PageConfig[] = [
  {
    n: 3,
    slug: "3-letter-words-with-these-letters",
    wordCount: 2130,
    ordinal: "three",
    description: "Find 3 letter words with these letters instantly. Free word finder for Scrabble and word puzzles.",
    presets: [
      { letters: "ATE", desc: "Common word" },
      { letters: "THE", desc: "Most common" },
      { letters: "ARE", desc: "Frequent" },
      { letters: "OAT", desc: "Classic" },
      { letters: "AB?", desc: "With wildcard" },
      { letters: "ZAP", desc: "High scorer" },
    ],
  },
  {
    n: 4,
    slug: "4-letter-words-with-these-letters",
    wordCount: 7185,
    ordinal: "four",
    description: "Find 4 letter words with these letters instantly. Free word finder for Scrabble and word puzzles.",
    presets: [
      { letters: "RATE", desc: "Common stem" },
      { letters: "BEAT", desc: "Frequent" },
      { letters: "STAR", desc: "Classic" },
      { letters: "ZONE", desc: "High scorer" },
      { letters: "ABC?", desc: "With wildcard" },
      { letters: "QUIZ", desc: "Top scorer" },
    ],
  },
  {
    n: 5,
    slug: "5-letter-words-with-these-letters",
    wordCount: 15918,
    ordinal: "five",
    description: "Find five letter words with these letters instantly. Free word solver for Wordle, Scrabble, and crossword puzzles.",
    presets: [
      { letters: "STARE", desc: "Wordle opener" },
      { letters: "CRANE", desc: "Popular guess" },
      { letters: "TREND", desc: "Common" },
      { letters: "GROAN", desc: "Classic" },
      { letters: "ABCD?", desc: "With wildcard" },
      { letters: "TWINS", desc: "High scorer" },
    ],
  },
  {
    n: 6,
    slug: "6-letter-words-with-these-letters",
    wordCount: 29874,
    ordinal: "six",
    description: "Find 6 letter words with these letters instantly. Free word finder for Scrabble and word puzzles.",
    presets: [
      { letters: "SATIRE", desc: "Bingo stem" },
      { letters: "RETINA", desc: "Common" },
      { letters: "STRAIN", desc: "Classic" },
      { letters: "GRAINS", desc: "Frequent" },
      { letters: "ABCDE?", desc: "With wildcard" },
      { letters: "ZOSTER", desc: "High scorer" },
    ],
  },
  {
    n: 7,
    slug: "",
    wordCount: 32909,
    ordinal: "seven",
    description: "Find 7 letter words with these letters instantly. Get all possible 7-letter words in seconds. Powered by Collins Scrabble word list. Free, no sign-up.",
    presets: [
      { letters: "AEIRNST", desc: "The Magnificent 7" },
      { letters: "SATINER", desc: "Bingo stem" },
      { letters: "AILERON", desc: "Classic bingo" },
      { letters: "PAINTER", desc: "Common stem" },
      { letters: "ABCDEF?", desc: "With wildcard" },
      { letters: "STRANGE", desc: "High scorer" },
    ],
  },
  {
    n: 8,
    slug: "8-letter-words-with-these-letters",
    wordCount: 51626,
    ordinal: "eight",
    description: "Find 8 letter words with these letters instantly. Free word finder for Scrabble and word puzzles.",
    presets: [
      { letters: "CANISTER", desc: "Bingo stem" },
      { letters: "CLARINET", desc: "Classic" },
      { letters: "STRAINED", desc: "Common" },
      { letters: "PAINTERS", desc: "Frequent" },
      { letters: "ABCDEFG?", desc: "With wildcard" },
      { letters: "RESTRAIN", desc: "High scorer" },
    ],
  },
  {
    n: 9,
    slug: "9-letter-words-with-these-letters",
    wordCount: 53402,
    ordinal: "nine",
    description: "Find 9 letter words with these letters instantly. Free word finder for Scrabble and word puzzles.",
    presets: [
      { letters: "CONTAINER", desc: "Classic" },
      { letters: "RETAINING", desc: "Common" },
      { letters: "STRAINING", desc: "Frequent" },
      { letters: "CELESTIAL", desc: "Elegant" },
      { letters: "ABCDEFGH?", desc: "With wildcard" },
      { letters: "RESTRAINT", desc: "High scorer" },
    ],
  },
  {
    n: 10,
    slug: "10-letter-words-with-these-letters",
    wordCount: 45872,
    ordinal: "ten",
    description: "Find 10 letter words with these letters instantly. Free word finder for Scrabble and word puzzles.",
    presets: [
      { letters: "CONTAINERS", desc: "Classic" },
      { letters: "RESTRAINTS", desc: "Common" },
      { letters: "INTESTINAL", desc: "Frequent" },
      { letters: "CENTRALISE", desc: "Elegant" },
      { letters: "ABCDEFGHI?", desc: "With wildcard" },
      { letters: "REINSTALLS", desc: "High scorer" },
    ],
  },
  {
    n: 11,
    slug: "11-letter-words-with-these-letters",
    wordCount: 37538,
    ordinal: "eleven",
    description: "Find 11 letter words with these letters instantly. Free word finder for Scrabble and word puzzles.",
    presets: [
      { letters: "CENTRALISED", desc: "Classic" },
      { letters: "NEWSLETTERS", desc: "Common" },
      { letters: "STREAMLINED", desc: "Frequent" },
      { letters: "CONTAINTERS".slice(0, 11), desc: "Variant" },
      { letters: "ABCDEFGHIJ?", desc: "With wildcard" },
      { letters: "REINSTALLED".slice(0, 11), desc: "High scorer" },
    ],
  },
];

export const ALL_CONFIGS = PAGE_CONFIGS;

export function getConfig(n: number): PageConfig {
  return PAGE_CONFIGS.find((c) => c.n === n)!;
}

export const ORDINAL_LABELS = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th"];

export const SCRABBLE_VALUES: Record<string, number> = {
  a:1,e:1,i:1,o:1,u:1,l:1,n:1,s:1,t:1,r:1,
  d:2,g:2,b:3,c:3,m:3,p:3,f:4,h:4,v:4,w:4,y:4,
  k:5,j:8,x:8,q:10,z:10,
};

export function scrabbleScore(word: string): number {
  return word.toLowerCase().split("").reduce((s, c) => s + (SCRABBLE_VALUES[c] || 0), 0);
}

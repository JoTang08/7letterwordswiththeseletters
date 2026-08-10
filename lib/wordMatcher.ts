export type WordMap = Record<string, string[]>;

export function buildWordMap(words: string[]): WordMap {
  const map: WordMap = {};
  for (const word of words) {
    const sorted = word.split("").sort().join("");
    if (!map[sorted]) map[sorted] = [];
    map[sorted].push(word);
  }
  return map;
}

export function matchWords(input: string, n: number, wordMap: WordMap): string[] {
  const clean = input.toLowerCase().replace(/[^a-z?]/g, "");
  if (clean.length !== n) return [];

  const wildcards = (clean.match(/\?/g) || []).length;
  const known = clean.replace(/\?/g, "").split("").sort().join("");
  const matches = new Set<string>();

  for (const [sorted, words] of Object.entries(wordMap)) {
    if (wildcards === 0) {
      if (sorted === known) words.forEach((w) => matches.add(w));
    } else {
      let ki = 0, si = 0;
      while (ki < known.length && si < sorted.length) {
        if (sorted[si] === known[ki]) { ki++; si++; }
        else if (sorted[si] > known[ki]) break;
        else si++;
      }
      if (ki === known.length && sorted.length - known.length <= wildcards) {
        words.forEach((w) => matches.add(w));
      }
    }
  }
  return [...matches].sort();
}

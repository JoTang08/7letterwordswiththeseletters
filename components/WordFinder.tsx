"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { type PageConfig, ORDINAL_LABELS, scrabbleScore } from "@/lib/config";
import { buildWordMap, matchWords, type WordMap } from "@/lib/wordMatcher";

/* ── Frequency helpers ── */
const freqCache: Record<string, string> = {};

function freqClass(word: string) { return freqCache[word.toLowerCase()] || "rare"; }
function freqLabel(word: string) {
  const c = freqClass(word);
  return c === "common" ? "Common" : c === "uncommon" ? "Uncommon" : "Rare";
}

async function fetchFrequencies(words: string[]) {
  const unknown = words.filter((w) => freqCache[w] === undefined);
  if (!unknown.length) return;
  const chunks: string[][] = [];
  for (let i = 0; i < unknown.length; i += 20) chunks.push(unknown.slice(i, i + 20));
  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        const res = await fetch(
          `https://api.datamuse.com/words?sp=${chunk.join("|")}&md=f&max=${chunk.length}`
        );
        if (!res.ok) return;
        const data: { word: string; tags?: string[] }[] = await res.json();
        const found = new Set<string>();
        data.forEach((item) => {
          const w = item.word.toLowerCase();
          found.add(w);
          const ftag = (item.tags || []).find((t) => t.startsWith("f:"));
          const score = ftag ? parseFloat(ftag.slice(2)) : 0;
          freqCache[w] = score >= 5 ? "common" : score >= 0.8 ? "uncommon" : "rare";
        });
        chunk.forEach((w) => { if (!found.has(w)) freqCache[w] = "rare"; });
      } catch {
        chunk.forEach((w) => { freqCache[w] = "rare"; });
      }
    })
  );
}

/* ── Definition helpers ── */
const defCache: Record<string, string | null> = {};

async function fetchDefinition(word: string): Promise<string | null> {
  if (defCache[word] !== undefined) return defCache[word];

  const withTimeout = <T,>(p: Promise<T>, ms: number) =>
    Promise.race([p, new Promise<never>((_, r) => setTimeout(() => r("timeout"), ms))]);

  const queryDatamuse = async (w: string): Promise<string | null> => {
    const res = await fetch(`https://api.datamuse.com/words?sp=${w}&md=d&max=1`);
    if (!res.ok) return null;
    const data: { word: string; defs?: string[] }[] = await res.json();
    if (!data.length || data[0].word.toLowerCase() !== w.toLowerCase()) return null;
    const defs = data[0].defs || [];
    if (!defs.length) return null;
    return defs.slice(0, 2).map((d) => {
      const tab = d.indexOf("\t");
      const pos = tab > -1 ? d.slice(0, tab) : "";
      const def = tab > -1 ? d.slice(tab + 1) : d;
      return pos ? `<strong>${pos}</strong> ${def}` : def;
    }).join("<br>");
  };

  const stems = (w: string): string[] => {
    const s: string[] = [];
    if (w.endsWith("ies")) s.push(w.slice(0, -3) + "y");
    if (w.endsWith("ves")) s.push(w.slice(0, -3) + "f", w.slice(0, -3) + "fe");
    if (w.endsWith("ing")) s.push(w.slice(0, -3), w.slice(0, -3) + "e");
    if (w.endsWith("ed"))  s.push(w.slice(0, -2), w.slice(0, -2) + "e", w.slice(0, -1));
    if (w.endsWith("es"))  s.push(w.slice(0, -2), w.slice(0, -1));
    if (w.endsWith("s"))   s.push(w.slice(0, -1));
    return [...new Set(s)].filter((x) => x.length > 1);
  };

  const fromDatamuse = async (): Promise<string | null> => {
    let result = await queryDatamuse(word);
    if (result) return result;
    for (const stem of stems(word.toLowerCase())) {
      result = await queryDatamuse(stem);
      if (result) return `<em style="color:var(--muted);font-size:0.8em">(${word} → ${stem})</em><br>${result}`;
    }
    return null;
  };

  const fromWikt = async (): Promise<string | null> => {
    const res = await withTimeout(
      fetch(`https://en.wiktionary.org/api/rest_v1/page/summary/${word}`),
      2500
    );
    if (!(res as Response).ok) return null;
    const data = await (res as Response).json();
    const extract: string | undefined = data.extract?.trim();
    return extract && !extract.startsWith("==") ? extract : null;
  };

  const [daRes, wkRes] = await Promise.allSettled([fromDatamuse(), fromWikt()]);
  const result =
    (daRes.status === "fulfilled" && daRes.value) ||
    (wkRes.status === "fulfilled" && wkRes.value) ||
    null;
  defCache[word] = result;
  return result;
}

/* ── Main component ── */
interface WordFinderProps {
  config: PageConfig;
}

export default function WordFinder({ config }: WordFinderProps) {
  const { n, slug, wordCount, presets } = config;

  const [values, setValues] = useState<string[]>(Array(n).fill(""));
  const [results, setResults] = useState<string[]>([]);
  const [freqVersion, setFreqVersion] = useState(0);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Popup
  const [popup, setPopup] = useState<{ content: string; x: number; y: number } | null>(null);
  const activeDefWord = useRef<string | null>(null);

  const wordMapRef = useRef<WordMap>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const jsonFile = n === 7 ? "/words7.json?v=2" : `/${slug?.replace("-words-with-these-letters", "").replace(/\d+-letter-words-with-these-letters/, `words${n}`)}/words${n}.json?v=1`;

  // Simpler: just compute the path directly
  const wordsUrl = `/words${n}.json?v=2`;

  useEffect(() => {
    fetch(wordsUrl)
      .then((r) => r.json())
      .then((words: string[]) => {
        wordMapRef.current = buildWordMap(words);
        setLoading(false);
        const q = new URLSearchParams(location.search).get("q");
        if (q) applyPreset(q);
      })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsUrl]);

  // Hide popup on scroll/click-outside
  useEffect(() => {
    const hide = () => { setPopup(null); activeDefWord.current = null; };
    window.addEventListener("scroll", hide, { passive: true });
    return () => window.removeEventListener("scroll", hide);
  }, []);

  const updateValue = (idx: number, char: string) => {
    const clean = char.replace(/[^a-zA-Z?]/g, "").toUpperCase().slice(-1);
    setValues((prev) => {
      const next = [...prev];
      next[idx] = clean;
      return next;
    });
    if (clean && idx < n - 1) {
      setTimeout(() => inputRefs.current[idx + 1]?.focus(), 0);
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (values[idx]) {
        setValues((prev) => { const next = [...prev]; next[idx] = ""; return next; });
      } else if (idx > 0) {
        setValues((prev) => { const next = [...prev]; next[idx - 1] = ""; return next; });
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < n - 1) {
      inputRefs.current[idx + 1]?.focus();
    } else if (e.key === "Enter") {
      doSearch();
    } else if (e.key === "?") {
      e.preventDefault();
      updateValue(idx, "?");
    } else if (/^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      updateValue(idx, e.key);
    }
  };

  const doSearch = useCallback(() => {
    const input = values.join("");
    if (!input.trim() || loading) return;
    const clean = input.replace(/[^A-Za-z?]/g, "");
    if (clean.length !== n) { setSearched(true); setResults([]); return; }
    const found = matchWords(clean, n, wordMapRef.current);
    setResults(found);
    setSearched(true);
    setFreqVersion((v) => v + 1);
    if (found.length > 0) {
      const up = clean.toUpperCase();
      setRecentSearches((prev) => {
        const filtered = prev.filter((x) => x !== up);
        return [up, ...filtered].slice(0, 6);
      });
      history.replaceState(null, "", "?q=" + encodeURIComponent(up));
      fetchFrequencies(found).then(() => setFreqVersion((v) => v + 1));
    }
  }, [values, loading, n]);

  const doClear = () => {
    setValues(Array(n).fill(""));
    setResults([]);
    setSearched(false);
    history.replaceState(null, "", location.pathname);
    setTimeout(() => inputRefs.current[0]?.focus(), 0);
  };

  const applyPreset = (letters: string) => {
    const chars = letters.toUpperCase().slice(0, n).split("");
    const next = Array(n).fill("").map((_, i) => chars[i] || "");
    setValues(next);
    setSearched(false);
    setTimeout(() => {
      inputRefs.current[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
      const clean = letters.replace(/[^A-Za-z?]/g, "");
      const found = matchWords(clean, n, wordMapRef.current);
      setResults(found);
      setSearched(true);
      if (found.length > 0) {
        fetchFrequencies(found).then(() => setFreqVersion((v) => v + 1));
        const up = clean.toUpperCase();
        setRecentSearches((prev) => [up, ...prev.filter((x) => x !== up)].slice(0, 6));
        history.replaceState(null, "", "?q=" + encodeURIComponent(up));
      }
    }, 0);
  };

  const showDef = async (word: string, btn: HTMLButtonElement) => {
    if (activeDefWord.current === word && popup) { setPopup(null); activeDefWord.current = null; return; }
    activeDefWord.current = word;
    const rect = btn.getBoundingClientRect();
    setPopup({ content: "loading", x: rect.left, y: rect.bottom + 6 });
    const def = await fetchDefinition(word);
    if (activeDefWord.current !== word) return;
    setPopup({ content: def ? `<strong class="def-popup-word">${word.toUpperCase()}</strong>${def}` : `<strong class="def-popup-word">${word.toUpperCase()}</strong><span style="color:var(--muted);font-size:0.85em">No definition found.</span><br><a href="https://www.collinsdictionary.com/dictionary/english/${word}" target="_blank" rel="noopener" style="color:var(--gold);font-size:0.85em;">Look up on Collins ↗</a>`, x: rect.left, y: rect.bottom + 6 });
  };

  const hasFilled = values.some((v) => v);
  const allFilled = values.every((v) => v);

  return (
    <>
      {/* Tiles */}
      <div className="tiles-row">
        {values.map((val, i) => {
          const isFilled = val !== "" && val !== "?";
          const isWild = val === "?";
          const isFocused = focusIdx === i;
          let outerClass = "tile-outer";
          if (isFocused) outerClass += " focused";
          if (isFilled) outerClass += " filled";
          if (isWild) outerClass += " wildcard";
          return (
            <div key={i} className="tile-wrap">
              <div className={outerClass}>
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  className={`tile-input${isFilled ? " filled" : ""}${isWild ? " wildcard" : ""}`}
                  maxLength={1}
                  autoComplete="off"
                  spellCheck={false}
                  inputMode="text"
                  autoFocus={i === 0}
                  value={val}
                  onChange={(e) => updateValue(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={() => setFocusIdx(i)}
                  onBlur={() => setFocusIdx(null)}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <div className="tile-bg" />
              </div>
              <span className="tile-label">{ORDINAL_LABELS[i]}</span>
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="btn-row">
        <button
          className="btn-find"
          disabled={loading || !hasFilled}
          onClick={doSearch}
        >
          {loading ? "Loading…" : "Find Words"}
        </button>
        {hasFilled && (
          <button className="btn-clear" onClick={doClear}>Clear</button>
        )}
      </div>

      {/* Hint */}
      <p className="hint">
        Use <kbd>?</kbd> as a wildcard for blank tiles · click a tile to edit
      </p>

      {/* Results */}
      <div id="results">
        {!searched && (
          <p className="empty">Enter some letters above to get started</p>
        )}
        {searched && results.length === 0 && (
          <>
            <div className="results-header">
              <span className="results-count">{n}-Letter Words</span>
            </div>
            <p className="empty">
              {values.filter(Boolean).length !== n
                ? `Please enter exactly ${n} letters (use ? as a wildcard).`
                : "No words found. Try different letters or use ? as a wildcard."}
            </p>
          </>
        )}
        {results.length > 0 && (
          <>
            <div className="results-header">
              <span className="results-count">{results.length} words found</span>
              <span className="results-meta">{n} letters · Collins SOWPODS</span>
            </div>
            <div className="word-grid" key={freqVersion}>
              {results.map((w) => {
                const score = scrabbleScore(w);
                return (
                  <div key={w} className="word-card" data-word={w}>
                    <div className="word-card-top">
                      <span className="word-text">{w}</span>
                      <span className="word-score" title="Scrabble points">{score}pt</span>
                    </div>
                    <div className="word-card-mid">
                      <span className={`word-freq ${freqClass(w)}`}>{freqLabel(w)}</span>
                      <div className="word-actions">
                        <button
                          className="word-btn"
                          title="Copy"
                          onClick={async (e) => {
                            const btn = e.currentTarget;
                            try { await navigator.clipboard.writeText(w); } catch { return; }
                            btn.classList.add("copied");
                            btn.textContent = "✓";
                            setTimeout(() => { btn.classList.remove("copied"); btn.textContent = "⧉"; }, 1500);
                          }}
                        >⧉</button>
                        <button
                          className="def-btn"
                          title="Definition"
                          onClick={(e) => showDef(w, e.currentTarget)}
                        >?</button>
                      </div>
                    </div>
                    <div className="word-letters">
                      {w.split("").map((c, ci) => (
                        <span key={ci} className="word-letter">{c}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Presets */}
      <div className="presets">
        <p className="presets-label">Popular letter sets</p>
        <div className="presets-row">
          {presets.map(({ letters, desc }) => (
            <button key={letters} className="preset-btn" onClick={() => applyPreset(letters)}>
              <span className="preset-letters">{letters}</span>
              {desc}
            </button>
          ))}
        </div>
      </div>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <p className="presets-label">Recent searches</p>
          <div className="presets-row">
            {recentSearches.map((letters) => (
              <button key={letters} className="preset-btn" onClick={() => applyPreset(letters)}>
                {letters}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Definition popup */}
      {popup && (
        <div
          className="def-popup"
          style={{ top: popup.y, left: popup.x, position: "fixed" }}
          onClick={(e) => e.stopPropagation()}
        >
          {popup.content === "loading" ? (
            <span className="def-loading">Loading…</span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: popup.content }} />
          )}
        </div>
      )}
    </>
  );
}

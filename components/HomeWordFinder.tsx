"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { buildWordMap, matchWords, type WordMap } from "@/lib/wordMatcher";

/* ── Types ── */
type Dictionary = "nwl" | "csw" | "wwf";
type SortMode = "score" | "az";

interface Filters {
  pattern: string[];
  contains: string;
  startsWith: string;
  endsWith: string;
  exclude: string;
}

/* ── Tile scores ── */
const TILE_VALUES: Record<string, number> = {
  a:1,e:1,i:1,o:1,u:1,l:1,n:1,s:1,t:1,r:1,
  d:2,g:2,b:3,c:3,m:3,p:3,f:4,h:4,v:4,w:4,y:4,
  k:5,j:8,x:8,q:10,z:10,
};
function wordScore(w: string) {
  return w.toLowerCase().split("").reduce((s, c) => s + (TILE_VALUES[c] || 0), 0);
}

/* ── Filter ── */
function applyFilters(words: string[], f: Filters): string[] {
  return words.filter((w) => {
    const lw = w.toLowerCase();
    if (f.pattern.some((p) => p)) {
      for (let i = 0; i < f.pattern.length; i++) {
        const p = f.pattern[i].toLowerCase();
        if (p && lw[i] !== p) return false;
      }
    }
    if (f.contains   && !lw.includes(f.contains.toLowerCase()))    return false;
    if (f.startsWith && !lw.startsWith(f.startsWith.toLowerCase())) return false;
    if (f.endsWith   && !lw.endsWith(f.endsWith.toLowerCase()))     return false;
    if (f.exclude) {
      for (const c of f.exclude.toLowerCase()) if (c && lw.includes(c)) return false;
    }
    return true;
  });
}

/* ── Frequency ── */
const freqCache: Record<string, string> = {};
async function fetchFrequencies(words: string[]) {
  const unknown = words.filter((w) => freqCache[w] === undefined);
  if (!unknown.length) return;
  const chunks: string[][] = [];
  for (let i = 0; i < unknown.length; i += 20) chunks.push(unknown.slice(i, i + 20));
  await Promise.all(chunks.map(async (chunk) => {
    try {
      const res = await fetch(`https://api.datamuse.com/words?sp=${chunk.join("|")}&md=f&max=${chunk.length}`);
      if (!res.ok) return;
      const data: { word: string; tags?: string[] }[] = await res.json();
      const found = new Set<string>();
      data.forEach((item) => {
        const w = item.word.toLowerCase(); found.add(w);
        const ftag = (item.tags || []).find((t) => t.startsWith("f:"));
        const sc = ftag ? parseFloat(ftag.slice(2)) : 0;
        freqCache[w] = sc >= 5 ? "common" : sc >= 0.8 ? "uncommon" : "rare";
      });
      chunk.forEach((w) => { if (!found.has(w)) freqCache[w] = "rare"; });
    } catch { chunk.forEach((w) => { freqCache[w] = "rare"; }); }
  }));
}

const POPULAR_SETS = ["AEINRST","SATINER","PAINTER","AILERON","RETAINS","CRAPTIS"];

const DICT_META: Record<Dictionary, { label: string; short: string; count: string; url: string }> = {
  nwl: { label: "US Scrabble (NWL)", short: "NWL",     count: "25,473 words", url: "/words7_nwl.json" },
  csw: { label: "Collins (CSW)",      short: "Collins", count: "34,254 words", url: "/words7_csw.json" },
  wwf: { label: "Words With Friends", short: "WWF",     count: "23,133 words", url: "/words7_wwf.json" },
};

const EMPTY_FILTERS: Filters = { pattern: Array(7).fill(""), contains: "", startsWith: "", endsWith: "", exclude: "" };

/* ── Board Extensions (6 tiles + 1 board letter) ── */
function findBoardExtensions(sixLetters: string, wordMap: WordMap): { letter: string; words: string[] }[] {
  const result: { letter: string; words: string[] }[] = [];
  for (let i = 0; i < 26; i++) {
    const boardLetter = String.fromCharCode(97 + i); // a-z
    const input = sixLetters.toLowerCase() + boardLetter;
    const clean = input.replace(/[^a-z]/g, "");
    if (clean.length !== 7) continue;
    // use matchWords logic inline: sort input, find in wordMap
    const sorted = clean.split("").sort().join("");
    const words = wordMap[sorted] || [];
    if (words.length > 0) {
      result.push({
        letter: boardLetter.toUpperCase(),
        words: [...words].sort((a, b) => wordScore(b) - wordScore(a)),
      });
    }
  }
  return result;
}

export default function HomeWordFinder() {
  const [values,      setValues]      = useState<string[]>(Array(7).fill(""));
  const [dict,        setDict]        = useState<Dictionary>("nwl");
  const [showDict,    setShowDict]    = useState(false);
  const [rawResults,  setRawResults]  = useState<string[]>([]);
  const [boardExt,    setBoardExt]    = useState<{ letter: string; words: string[] }[]>([]);
  const [sortMode,    setSortMode]    = useState<SortMode>("score");
  const [filters,     setFilters]     = useState<Filters>(EMPTY_FILTERS);
  const [searched,    setSearched]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [focusIdx,    setFocusIdx]    = useState<number | null>(null);
  const [freqVer,     setFreqVer]     = useState(0);
  const [activePreset,setActivePreset]= useState<string | null>(null);

  const wordMapRef  = useRef<WordMap>({});
  const inputRefs   = useRef<(HTMLInputElement | null)[]>([]);
  const patternRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dictRef     = useRef<HTMLDivElement>(null);

  /* load dict */
  const loadDict = useCallback(async (d: Dictionary) => {
    setLoading(true);
    try {
      const words: string[] = await fetch(DICT_META[d].url).then((r) => r.json());
      wordMapRef.current = buildWordMap(words);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadDict(dict); }, [dict, loadDict]);

  /* close dict on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dictRef.current && !dictRef.current.contains(e.target as Node)) setShowDict(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* URL ?q= */
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q");
    if (q) applyPreset(q);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateValue = (idx: number, char: string) => {
    const c = char.replace(/[^a-zA-Z?]/g, "").toUpperCase().slice(-1);
    setValues((prev) => { const n = [...prev]; n[idx] = c; return n; });
    if (c && idx < 6) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (values[idx]) { setValues((p) => { const n=[...p]; n[idx]=""; return n; }); }
      else if (idx > 0) { setValues((p) => { const n=[...p]; n[idx-1]=""; return n; }); inputRefs.current[idx-1]?.focus(); }
    } else if (e.key==="ArrowLeft"  && idx>0) { inputRefs.current[idx-1]?.focus(); }
      else if (e.key==="ArrowRight" && idx<6) { inputRefs.current[idx+1]?.focus(); }
      else if (e.key==="Enter") { doSearch(); }
      else if (/^[a-zA-Z?]$/.test(e.key)) { e.preventDefault(); updateValue(idx, e.key); }
  };

  const doSearch = useCallback(() => {
    if (!values.some((v) => v) || loading) return;
    const clean = values.map((v) => v || "?").join("");
    const found = matchWords(clean, 7, wordMapRef.current);
    setRawResults(found); setSearched(true); setFreqVer((v) => v+1);
    const nonWild = values.filter((v) => v && v !== "?");
    if (nonWild.length === 6) {
      const sixLetters = nonWild.join("");
      setBoardExt(findBoardExtensions(sixLetters, wordMapRef.current));
    } else {
      setBoardExt([]);
    }
    if (found.length > 0) {
      history.replaceState(null, "", "?q=" + encodeURIComponent(clean.toUpperCase()));
      fetchFrequencies(found).then(() => setFreqVer((v) => v+1));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, loading]);

  const doClear = () => {
    setValues(Array(7).fill("")); setRawResults([]); setBoardExt([]); setSearched(false); setActivePreset(null);
    history.replaceState(null, "", location.pathname);
    setTimeout(() => inputRefs.current[0]?.focus(), 0);
  };

  const applyPreset = (letters: string) => {
    const chars = letters.toUpperCase().slice(0, 7).split("");
    const newValues = Array(7).fill("").map((_, i) => chars[i] || "");
    setValues(newValues);
    setActivePreset(letters.toUpperCase().slice(0, 7));
    setSearched(false);
    setTimeout(() => {
      const clean = letters.replace(/[^A-Za-z?]/g, "");
      const found = matchWords(clean, 7, wordMapRef.current);
      setRawResults(found); setSearched(true);
      const nonWild = newValues.filter((v) => v && v !== "?");
      if (nonWild.length === 6) {
        setBoardExt(findBoardExtensions(nonWild.join(""), wordMapRef.current));
      } else {
        setBoardExt([]);
      }
      if (found.length > 0) {
        fetchFrequencies(found).then(() => setFreqVer((v) => v+1));
        history.replaceState(null, "", "?q=" + encodeURIComponent(clean.toUpperCase()));
      }
    }, 0);
  };

  const displayResults = (() => {
    let words = applyFilters(rawResults, filters);
    return sortMode === "score"
      ? [...words].sort((a, b) => wordScore(b) - wordScore(a))
      : [...words].sort((a, b) => a.localeCompare(b));
  })();

  const isBingo   = rawResults.length > 0 && values.every((v) => v !== "");
  const hasFilled = values.some((v) => v);
  const hasFilter = filters.pattern.some((p) => p) || filters.contains || filters.startsWith || filters.endsWith || filters.exclude;

  return (
    <div className="hf-wrap">

      {/* ═══ HEADER ═══ */}
      <header className="hf-header">
        <h1 className="hf-h1">7 Letter Words With These Letters</h1>
        <p className="hf-sub">Find every possible 7-letter word from your tiles with point values and Bingo bonus breakdown.</p>
      </header>

      {/* ═══ INPUT CARD ═══ */}
      <div className="hf-card">
        <div className="hf-card-label-row">
          <p className="hf-card-label">FIND EVERY 7-LETTER WORD</p>
          {hasFilled && (
            <button className="hf-btn-clear" onClick={doClear}>Clear</button>
          )}
        </div>

        {/* tiles */}
        <div className="hf-tiles-wrap">
        <div className="hf-tiles">
          {values.map((val, i) => {
            const filled  = val !== "" && val !== "?";
            const wild    = val === "?";
            const focused = focusIdx === i;
            return (
              <div key={i} className={`hf-tile${filled?" filled":""}${wild?" wild":""}${focused?" focused":""}`}>
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  className="hf-tile-input"
                  maxLength={1} autoComplete="off" spellCheck={false} inputMode="text"
                  autoFocus={i === 0} value={val}
                  onChange={(e) => updateValue(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={() => setFocusIdx(i)}
                  onBlur={() => setFocusIdx(null)}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
              </div>
            );
          })}
        </div>
        </div>

        {/* generate */}
        <button className="hf-btn-gen" disabled={loading || !hasFilled} onClick={doSearch}>
          {loading ? "Loading dictionary…" : "[ Generate 7-Letter Anagrams ]"}
        </button>

        {/* dict row */}
        <div className="hf-card-footer">
          <div className="hf-dict" ref={dictRef}>

            <button className="hf-dict-btn" onClick={() => setShowDict((v) => !v)}>
              🌐 {DICT_META[dict].label} <span className="hf-dict-chevron">{showDict ? "▲" : "▼"}</span>
            </button>
            {showDict && (
              <div className="hf-dict-menu">
                {(Object.entries(DICT_META) as [Dictionary, typeof DICT_META[Dictionary]][]).map(([key, m]) => (
                  <button
                    key={key}
                    className={`hf-dict-item${dict === key ? " active" : ""}`}
                    onClick={() => { setDict(key); setShowDict(false); setSearched(false); setRawResults([]); }}
                  >
                    <span className="hf-dict-name">{dict === key ? "◉" : "○"} {m.label}</span>
                    <span className="hf-dict-count">{m.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ RESULTS ═══ */}
      {searched && (
        <div className="hf-results">

          {/* ── left: word list ── */}
          <div className="hf-results-main">
            {/* 7-letter section */}
            <div className="hf-results-bar">
              <strong className="hf-count">
                {displayResults.length} ANAGRAM{displayResults.length !== 1 ? "S" : ""} FOUND
              </strong>
              <span className="hf-sort">
                Sort by |&nbsp;
                <button className={`hf-sort-btn${sortMode==="score"?" on":""}`} onClick={() => setSortMode("score")}>Best Score</button>
                &nbsp;|&nbsp;
                <button className={`hf-sort-btn${sortMode==="az"?" on":""}`}    onClick={() => setSortMode("az")}>A–Z</button>
              </span>
            </div>

            {displayResults.length === 0 ? (
              <p className="hf-empty">No 7-letter words found. Try different letters or use ? as a wildcard.</p>
            ) : (
              <ul className="hf-word-cards" key={freqVer}>
                {displayResults.map((w) => {
                  const sc = wordScore(w);
                  return (
                    <li key={w} className="hf-wcard">
                      <span className="hf-wcard-word">{w.toUpperCase()}</span>
                      <span className="hf-wcard-badges">
                        {isBingo && <span className="hf-badge-bingo">+50 Bingo</span>}
                        <span className="hf-badge-pts">{sc} pts</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* 6+1 board extensions */}
            {boardExt.length > 0 && (
              <div className="hf-sub-section">
                <p className="hf-sub-hd">
                  🔲 6 TILES + 1 BOARD LETTER
                  <span className="hf-sub-meta">Add one letter from the board to make a 7-letter Bingo</span>
                </p>
                <div className="hf-board-ext-grid">
                  {boardExt.map(({ letter, words }) => (
                    <div key={letter} className="hf-board-ext-item">
                      <span className="hf-board-ext-letter">+ {letter}</span>
                      <span className="hf-board-ext-words">
                        {words.slice(0, 3).map((w, i) => (
                          <span key={w}>
                            {i > 0 && ", "}
                            <span className="hf-board-ext-word">{w.toUpperCase()}</span>
                            <span className="hf-board-ext-pts"> {wordScore(w)}pts</span>
                          </span>
                        ))}
                        {words.length > 3 && <span className="hf-board-ext-more"> +{words.length - 3}</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── right: sidebar ── */}
          <aside className="hf-sidebar">

            {/* filters — always at top to align with results bar */}
            <div className="hf-filters">
              <p className="hf-filters-hd">ADVANCED FILTERS</p>
              <div className="hf-filters-body">

              {/* bingo badge — inside filters panel */}
              {isBingo && (
                <div className="hf-bingo">
                  <span className="hf-bingo-icon">🎯</span>
                  <div>
                    <p className="hf-bingo-title">SCRABBLE BINGO <span className="hf-bingo-check">✓</span></p>
                    <p className="hf-bingo-desc">All anagrams use 7 tiles, earning a 50-pt bonus.</p>
                  </div>
                </div>
              )}

              <div className="hf-fg">
                <label className="hf-fl">Pattern</label>
                <div className="hf-pattern">
                  {filters.pattern.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => { patternRefs.current[i] = el; }}
                      className="hf-pcell"
                      maxLength={1} autoComplete="off" spellCheck={false}
                      value={val} placeholder="_"
                      onChange={(e) => {
                        const c = e.target.value.replace(/[^a-zA-Z]/g,"").toUpperCase().slice(-1);
                        setFilters((f) => { const p=[...f.pattern]; p[i]=c; return {...f,pattern:p}; });
                        if (c && i < 6) patternRefs.current[i+1]?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key==="Backspace" && !val && i>0) {
                          setFilters((f) => { const p=[...f.pattern]; p[i-1]=""; return {...f,pattern:p}; });
                          patternRefs.current[i-1]?.focus();
                        } else if (e.key==="ArrowLeft"  && i>0) patternRefs.current[i-1]?.focus();
                          else if (e.key==="ArrowRight" && i<6) patternRefs.current[i+1]?.focus();
                      }}
                    />
                  ))}
                </div>
              </div>

              {(["contains","startsWith","endsWith","exclude"] as const).map((key) => (
                <div key={key} className="hf-fg">
                  <label className="hf-fl">
                    {key === "contains"   ? "Contains"    :
                     key === "startsWith" ? "Starts with" :
                     key === "endsWith"   ? "Ends with"   : "Exclude"}
                  </label>
                  <input
                    className="hf-input"
                    value={filters[key]}
                    onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}

              {hasFilter && (
                <button className="hf-filter-clear" onClick={() => setFilters(EMPTY_FILTERS)}>
                  Clear filters
                </button>
              )}
              </div>{/* end hf-filters-body */}
            </div>
          </aside>
        </div>
      )}

      {/* ═══ POPULAR SETS ═══ */}
      <section className="hf-popular">
        <p className="hf-popular-hd">POPULAR LETTER SETS</p>
        <div className="hf-popular-row">
          {POPULAR_SETS.map((letters) => (
            <button
              key={letters}
              className={`hf-popular-btn${activePreset === letters ? " active" : ""}`}
              onClick={() => applyPreset(letters)}
            >
              {letters}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
}

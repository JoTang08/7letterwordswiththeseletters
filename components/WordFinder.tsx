"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { type PageConfig, scrabbleScore } from "@/lib/config";
import { buildWordMap, matchWords, type WordMap } from "@/lib/wordMatcher";

/* ── Tile scores ── */
const TILE_VALUES: Record<string, number> = {
  a:1,e:1,i:1,o:1,u:1,l:1,n:1,s:1,t:1,r:1,
  d:2,g:2,b:3,c:3,m:3,p:3,f:4,h:4,v:4,w:4,y:4,
  k:5,j:8,x:8,q:10,z:10,
};
function wordScore(w: string) {
  return w.toLowerCase().split("").reduce((s, c) => s + (TILE_VALUES[c] || 0), 0);
}

type SortMode = "score" | "az";

interface Filters {
  startsWith: string;
  endsWith: string;
  contains: string;
  exclude: string;
}

const EMPTY_FILTERS: Filters = { startsWith: "", endsWith: "", contains: "", exclude: "" };

function applyFilters(words: string[], f: Filters): string[] {
  return words.filter((w) => {
    const lw = w.toLowerCase();
    if (f.startsWith && !lw.startsWith(f.startsWith.toLowerCase())) return false;
    if (f.endsWith   && !lw.endsWith(f.endsWith.toLowerCase()))     return false;
    if (f.contains   && !lw.includes(f.contains.toLowerCase()))     return false;
    if (f.exclude) {
      for (const c of f.exclude.toLowerCase()) if (c && lw.includes(c)) return false;
    }
    return true;
  });
}

export default function WordFinder({ config }: { config: PageConfig }) {
  const { n, presets } = config;

  const [values,      setValues]      = useState<string[]>(Array(n).fill(""));
  const [rawResults,  setRawResults]  = useState<string[]>([]);
  const [sortMode,    setSortMode]    = useState<SortMode>("score");
  const [filters,     setFilters]     = useState<Filters>(EMPTY_FILTERS);
  const [searched,    setSearched]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [focusIdx,    setFocusIdx]    = useState<number | null>(null);
  const [activePreset,setActivePreset]= useState<string | null>(null);

  const wordMapRef = useRef<WordMap>({});
  const inputRefs  = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetch(`/words${n}.json`)
      .then((r) => r.json())
      .then((words: string[]) => { wordMapRef.current = buildWordMap(words); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [n]);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q");
    if (q) applyPreset(q);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateValue = (idx: number, char: string) => {
    const c = char.replace(/[^a-zA-Z?]/g, "").toUpperCase().slice(-1);
    setValues((prev) => { const next = [...prev]; next[idx] = c; return next; });
    if (c && idx < n - 1) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (values[idx]) { setValues((p) => { const next=[...p]; next[idx]=""; return next; }); }
      else if (idx > 0) { setValues((p) => { const next=[...p]; next[idx-1]=""; return next; }); inputRefs.current[idx-1]?.focus(); }
    } else if (e.key==="ArrowLeft"  && idx>0)   { inputRefs.current[idx-1]?.focus(); }
      else if (e.key==="ArrowRight" && idx<n-1) { inputRefs.current[idx+1]?.focus(); }
      else if (e.key==="Enter") { doSearch(); }
      else if (/^[a-zA-Z?]$/.test(e.key)) { e.preventDefault(); updateValue(idx, e.key); }
  };

  const doSearch = useCallback(() => {
    if (!values.some((v) => v) || loading) return;
    const clean = values.map((v) => v || "?").join("");
    const found = matchWords(clean, n, wordMapRef.current);
    setRawResults(found); setSearched(true);
    if (found.length > 0) history.replaceState(null, "", "?q=" + encodeURIComponent(clean.toUpperCase()));
  }, [values, loading, n]);

  const doClear = () => {
    setValues(Array(n).fill("")); setRawResults([]); setSearched(false);
    setActivePreset(null); setFilters(EMPTY_FILTERS);
    history.replaceState(null, "", location.pathname);
    setTimeout(() => inputRefs.current[0]?.focus(), 0);
  };

  const applyPreset = (letters: string) => {
    const chars = letters.toUpperCase().slice(0, n).split("");
    setValues(Array(n).fill("").map((_, i) => chars[i] || ""));
    setActivePreset(letters.toUpperCase().slice(0, n));
    setSearched(false);
    setTimeout(() => {
      const clean = letters.replace(/[^A-Za-z?]/g, "");
      const found = matchWords(clean, n, wordMapRef.current);
      setRawResults(found); setSearched(true);
      if (found.length > 0) history.replaceState(null, "", "?q=" + encodeURIComponent(clean.toUpperCase()));
    }, 0);
  };

  const displayResults = (() => {
    let words = applyFilters(rawResults, filters);
    return sortMode === "score"
      ? [...words].sort((a, b) => wordScore(b) - wordScore(a))
      : [...words].sort((a, b) => a.localeCompare(b));
  })();

  const hasFilled = values.some((v) => v);
  const hasFilter = filters.startsWith || filters.endsWith || filters.contains || filters.exclude;

  /* ── tile sizing: shrink for large n ── */
  const tileSize = n <= 7 ? "wf-tile--lg" : n <= 9 ? "wf-tile--md" : "wf-tile--sm";

  return (
    <div className="wf-wrap">

      {/* ── Input card ── */}
      <div className="wf-card">
        <div className="wf-card-label-row">
          <p className="wf-card-label">FIND EVERY {n}-LETTER WORD</p>
          {hasFilled && (
            <button className="wf-btn-clear" onClick={doClear}>Clear</button>
          )}
        </div>

        {/* Tiles */}
        <div className="wf-tiles">
          {values.map((val, i) => {
            const filled  = val !== "" && val !== "?";
            const wild    = val === "?";
            const focused = focusIdx === i;
            return (
              <div key={i} className={`wf-tile ${tileSize}${filled?" filled":""}${wild?" wild":""}${focused?" focused":""}`}>
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  className="wf-tile-input"
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

        {/* Generate */}
        <button className="wf-btn-gen" disabled={loading || !hasFilled} onClick={doSearch}>
          {loading ? "Loading dictionary…" : `[ Find ${n}-Letter Words ]`}
        </button>

        {/* Dict note */}
        <p className="wf-dict-note">Collins Scrabble Words (SOWPODS) · {config.wordCount.toLocaleString()} words</p>
      </div>

      {/* ── Results ── */}
      {searched && (
        <div className="wf-results-layout">

          {/* Left: word list */}
          <div className="wf-results-main">
            <div className="wf-results-bar">
              <strong className="wf-count">
                {displayResults.length} WORD{displayResults.length !== 1 ? "S" : ""} FOUND
              </strong>
              <span className="wf-sort">
                Sort by |&nbsp;
                <button className={`wf-sort-btn${sortMode==="score"?" on":""}`} onClick={() => setSortMode("score")}>Best Score</button>
                &nbsp;|&nbsp;
                <button className={`wf-sort-btn${sortMode==="az"?" on":""}`} onClick={() => setSortMode("az")}>A–Z</button>
              </span>
            </div>

            {displayResults.length === 0 ? (
              <p className="wf-empty">No words match. Try different letters or use ? as a wildcard.</p>
            ) : (
              <ul className="wf-word-cards">
                {displayResults.map((w) => {
                  const sc = wordScore(w);
                  return (
                    <li key={w} className="wf-wcard">
                      <span className="wf-wcard-word">{w.toUpperCase()}</span>
                      <span className="wf-badge-pts">{sc} pts</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Right: filters sidebar */}
          <aside className="wf-sidebar">
            <div className="wf-filters">
              <p className="wf-filters-hd">ADVANCED FILTERS</p>
              <div className="wf-filters-body">
                {(["startsWith","endsWith","contains","exclude"] as const).map((key) => (
                  <div key={key} className="wf-fg">
                    <label className="wf-fl">
                      {key==="startsWith"?"Starts with":key==="endsWith"?"Ends with":key==="contains"?"Contains":"Exclude"}
                    </label>
                    <input
                      className="wf-input"
                      value={filters[key]}
                      onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ))}
                {hasFilter && (
                  <button className="wf-filter-clear" onClick={() => setFilters(EMPTY_FILTERS)}>
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ── Presets ── */}
      <div className="wf-popular">
        <p className="wf-popular-hd">POPULAR LETTER SETS</p>
        <div className="wf-popular-row">
          {presets.map(({ letters }) => (
            <button
              key={letters}
              className={`wf-popular-btn${activePreset === letters.toUpperCase() ? " active" : ""}`}
              onClick={() => applyPreset(letters)}
            >
              {letters}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

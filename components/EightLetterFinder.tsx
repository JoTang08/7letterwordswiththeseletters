"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildWordMap, type WordMap } from "@/lib/wordMatcher";

/* ── Tile scores ── */
const TILE: Record<string, number> = {
  a:1,e:1,i:1,o:1,u:1,l:1,n:1,s:1,t:1,r:1,
  d:2,g:2,b:3,c:3,m:3,p:3,f:4,h:4,v:4,w:4,y:4,
  k:5,j:8,x:8,q:10,z:10,
};
function pts(w: string) {
  return w.toLowerCase().split("").reduce((s, c) => s + (TILE[c] || 0), 0);
}

/* ── Board extension ── */
interface BoardGroup {
  letter: string;
  words: { word: string; score: number }[];
}

function calcBoardGroups(rack: string, wordMap: WordMap): BoardGroup[] {
  const groups: BoardGroup[] = [];
  const letters = rack.toLowerCase().replace(/[^a-z]/g, "");
  for (let i = 0; i < 26; i++) {
    const board = String.fromCharCode(97 + i);
    const combo = (letters + board).split("").sort().join("");
    if (combo.length !== 8) continue;
    const words = wordMap[combo] || [];
    if (words.length > 0) {
      groups.push({
        letter: board.toUpperCase(),
        words: [...words]
          .sort((a, b) => pts(b) - pts(a))
          .map((w) => ({ word: w.toUpperCase(), score: pts(w) })),
      });
    }
  }
  return groups;
}

const PRESETS = ["PAINTER", "AEINRST", "CLARINET", "STRAINED", "PAINTERS".slice(0,7), "AILERON"];

export default function EightLetterFinder() {
  const [input,     setInput]     = useState("");
  const [groups,    setGroups]    = useState<BoardGroup[]>([]);
  const [searched,  setSearched]  = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const wordMapRef = useRef<WordMap>({});
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/words8.json")
      .then((r) => r.json())
      .then((words: string[]) => { wordMapRef.current = buildWordMap(words); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const doSearch = useCallback((letters: string) => {
    const clean = letters.replace(/[^a-zA-Z?]/g, "");
    if (!clean) return;
    if (clean.replace(/\?/g, "").length < 5) {
      setError("Please enter at least 5 letters for meaningful results.");
      setGroups([]); setSearched(true); return;
    }
    if (clean.length > 7) {
      setError("Enter up to 7 rack letters only.");
      setGroups([]); setSearched(true); return;
    }
    setError("");
    const result = calcBoardGroups(clean, wordMapRef.current);
    result.sort((a, b) => b.words[0].score - a.words[0].score);
    setGroups(result);
    setSearched(true);
    if (clean.length === 7) {
      history.replaceState(null, "", "?q=" + encodeURIComponent(clean.toUpperCase()));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(input);
  };

  const applyPreset = (p: string) => {
    setInput(p);
    doSearch(p);
  };

  const clear = () => {
    setInput(""); setGroups([]); setSearched(false); setError("");
    history.replaceState(null, "", location.pathname);
    inputRef.current?.focus();
  };

  const totalWords = groups.reduce((s, g) => s + g.words.length, 0);

  return (
    <div className="elf-wrap">

      {/* ── Input card ── */}
      <div className="elf-card">
        <p className="elf-eyebrow">7 RACK TILES + 1 BOARD LETTER = 8-LETTER BINGO</p>

        <form className="elf-form" onSubmit={handleSubmit}>
          <div className="elf-input-wrap">
            <input
              ref={inputRef}
              className="elf-input"
              value={input}
              maxLength={7}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              placeholder="Enter your 7 rack letters (e.g. PAINTER or PAINTE?)"
              onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z?]/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as unknown as React.FormEvent)}
            />
            {input && (
              <button type="button" className="elf-clear" onClick={clear} title="Clear">✕</button>
            )}
          </div>
          <button className="elf-btn" type="submit" disabled={loading || !input.trim()}>
            {loading ? "Loading dictionary…" : "Find 8-Letter Bingos →"}
          </button>
        </form>

        <p className="elf-tip">Enter 7 letters to find all 8-letter words you can form by hooking onto 1 letter already on the board.</p>

        {/* Presets */}
        <div className="elf-presets">
          {PRESETS.map((p) => (
            <button key={p} className={`elf-preset${input === p ? " active" : ""}`} onClick={() => applyPreset(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      {searched && (
        <div className="elf-results">
          {error ? (
            <div className="elf-error">{error}</div>
          ) : groups.length === 0 ? (
            <div className="elf-empty">
              <p>No 8-letter Bingos found for <strong>{input}</strong>.</p>
              <p>Try adding a wildcard <strong>?</strong> or check your letters.</p>
            </div>
          ) : (
            <>
              <div className="elf-summary">
                <span className="elf-summary-count">{totalWords} BINGO WORD{totalWords !== 1 ? "S" : ""} FOUND</span>
                <span className="elf-summary-meta">across {groups.length} board letter{groups.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="elf-groups">
                {groups.map((g) => (
                  <div key={g.letter} className="elf-group">
                    <div className="elf-group-hd">
                      <span className="elf-group-pin">📌</span>
                      <span className="elf-group-label">
                        IF THE BOARD HAS <span className="elf-group-letter">&ldquo;{g.letter}&rdquo;</span>:
                      </span>
                    </div>
                    <ul className="elf-word-list">
                      {g.words.map(({ word, score }) => (
                        <li key={word} className="elf-word-row">
                          <span className="elf-word">{word}</span>
                          <span className="elf-badges">
                            <span className="elf-badge-bingo">+50 Bingo</span>
                            <span className="elf-badge-pts">{score} pts</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

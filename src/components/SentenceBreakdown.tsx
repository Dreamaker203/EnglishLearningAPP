"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Sentence } from "@/lib/types";
import { speakText } from "@/lib/tts";

interface SentenceBreakdownProps {
  sentence: Sentence;
  onComplete: (correct: boolean, time: number) => void;
  onNext?: () => void;
}

function isPunct(w: string): boolean {
  return /^[.!?,;:'"]+$/.test(w.trim());
}

export default function SentenceBreakdown({
  sentence,
  onComplete,
  onNext,
}: SentenceBreakdownProps) {
  const [phase, setPhase] = useState<"preview" | "playing" | "checking" | "done">("preview");
  const [inputs, setInputs] = useState<string[]>([]);
  const [correctSet, setCorrectSet] = useState<Set<number>>(new Set());
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());
  const [wrongCounts, setWrongCounts] = useState<Map<number, number>>(new Map());
  const [focusIndex, setFocusIndex] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const words = sentence.words;
  const inputIndices = words.map((w, i) => (!isPunct(w) ? i : -1)).filter((i) => i >= 0);

  const normalize = (w: string) => w.toLowerCase().replace(/[.!?,;:'"]/g, "").trim();

  useEffect(() => {
    setPhase("preview");
    setInputs([]);
    setCorrectSet(new Set());
    setRevealedSet(new Set());
    setWrongCounts(new Map());
    setFocusIndex(0);
    setTotalErrors(0);
    setStartTime(0);
  }, [sentence.id]);

  const startGame = useCallback(() => {
    setInputs(words.map(() => ""));
    setCorrectSet(new Set());
    setRevealedSet(new Set());
    setWrongCounts(new Map());
    setFocusIndex(inputIndices[0] ?? 0);
    setTotalErrors(0);
    setStartTime(Date.now());
    setPhase("playing");

    setTimeout(() => speakText(sentence.english, "en-US", 0.85), 300);
    setTimeout(() => inputRefs.current[inputIndices[0] ?? 0]?.focus(), 500);
  }, [sentence, words, inputIndices]);

  const checkWordAt = useCallback(
    (index: number, currentInputs: string[]) => {
      const expected = normalize(words[index]);
      const actual = normalize(currentInputs[index] || "");
      return actual === expected;
    },
    [words]
  );

  const findNextWrong = useCallback(
    (afterIndex: number, curCorrect: Set<number>, curRevealed: Set<number>) => {
      const after = inputIndices.find(
        (i) => i > afterIndex && !curCorrect.has(i) && !curRevealed.has(i)
      );
      const wrap = inputIndices.find(
        (i) => !curCorrect.has(i) && !curRevealed.has(i)
      );
      return after ?? wrap;
    },
    [inputIndices]
  );

  const isAllDone = useCallback(
    (curCorrect: Set<number>, curRevealed: Set<number>) => {
      return inputIndices.every((i) => curCorrect.has(i) || curRevealed.has(i));
    },
    [inputIndices]
  );

  // Enter to submit during playing
  const handleSubmit = useCallback(
    (currentInputs: string[]) => {
      const filled = inputIndices.every(
        (i) => (currentInputs[i] || "").trim().length > 0
      );
      if (!filled) return;

      const newCorrect = new Set(correctSet);
      for (const i of inputIndices) {
        if (checkWordAt(i, currentInputs)) {
          newCorrect.add(i);
        }
      }
      setCorrectSet(newCorrect);

      if (isAllDone(newCorrect, revealedSet)) {
        const elapsed = (Date.now() - startTime) / 1000;
        setPhase("done");
        const allCorrect = inputIndices.every((i) => newCorrect.has(i));
        onComplete(allCorrect, elapsed);
      } else {
        setPhase("checking");
        const firstWrong = findNextWrong(-1, newCorrect, revealedSet);
        if (firstWrong !== undefined) {
          speakText(words[firstWrong], "en-US", 0.7);
          setFocusIndex(firstWrong);
          setTimeout(() => inputRefs.current[firstWrong]?.focus(), 200);
        }
      }
    },
    [inputIndices, correctSet, revealedSet, startTime, words, checkWordAt, isAllDone, findNextWrong, onComplete]
  );

  const handleRetry = useCallback(
    (index: number) => {
      const val = (inputs[index] || "").trim();
      if (!val) return;
      if (correctSet.has(index) || revealedSet.has(index)) return;

      if (checkWordAt(index, inputs)) {
        const newCorrect = new Set(correctSet);
        newCorrect.add(index);
        setCorrectSet(newCorrect);

        if (isAllDone(newCorrect, revealedSet)) {
          const elapsed = (Date.now() - startTime) / 1000;
          setPhase("done");
          onComplete(totalErrors === 0, elapsed);
        } else {
          const next = findNextWrong(index, newCorrect, revealedSet);
          if (next !== undefined) {
            speakText(words[next], "en-US", 0.7);
            setFocusIndex(next);
            setTimeout(() => inputRefs.current[next]?.focus(), 100);
          }
        }
      } else {
        const count = (wrongCounts.get(index) || 0) + 1;
        const newCounts = new Map(wrongCounts);
        newCounts.set(index, count);
        setWrongCounts(newCounts);
        setTotalErrors((e) => e + 1);

        if (count >= 3) {
          const newRevealed = new Set(revealedSet);
          newRevealed.add(index);
          setRevealedSet(newRevealed);

          const newInputs = [...inputs];
          newInputs[index] = words[index];
          setInputs(newInputs);

          speakText(words[index], "en-US", 0.7);

          if (isAllDone(correctSet, newRevealed)) {
            const elapsed = (Date.now() - startTime) / 1000;
            setPhase("done");
            onComplete(false, elapsed);
          } else {
            const next = findNextWrong(index, correctSet, newRevealed);
            if (next !== undefined) {
              speakText(words[next], "en-US", 0.7);
              setFocusIndex(next);
              setTimeout(() => inputRefs.current[next]?.focus(), 200);
            }
          }
        } else {
          speakText(words[index], "en-US", 0.7);
        }
      }
    },
    [inputs, correctSet, revealedSet, wrongCounts, totalErrors, startTime, words, checkWordAt, isAllDone, findNextWrong, onComplete]
  );

  const jumpToNextWrong = useCallback(
    (fromIndex: number) => {
      const next = findNextWrong(fromIndex, correctSet, revealedSet);
      if (next !== undefined) {
        speakText(words[next], "en-US", 0.7);
        setFocusIndex(next);
        setTimeout(() => inputRefs.current[next]?.focus(), 100);
      }
    },
    [findNextWrong, correctSet, revealedSet, words]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (phase === "playing") {
          handleSubmit(inputs);
        } else if (phase === "checking") {
          if (correctSet.has(index) || revealedSet.has(index)) {
            jumpToNextWrong(index);
          } else {
            handleRetry(index);
          }
        }
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        if (phase === "checking") {
          jumpToNextWrong(index);
        } else {
          const pos = inputIndices.indexOf(index);
          if (pos < inputIndices.length - 1) {
            const next = inputIndices[pos + 1];
            setFocusIndex(next);
            inputRefs.current[next]?.focus();
          }
        }
      }
      if (e.key === "Backspace" && !inputs[index]) {
        const pos = inputIndices.indexOf(index);
        if (pos > 0) {
          const prev = inputIndices[pos - 1];
          setFocusIndex(prev);
          inputRefs.current[prev]?.focus();
        }
      }
    },
    [phase, handleRetry, inputs, inputIndices, correctSet, revealedSet, jumpToNextWrong]
  );

  // Global Enter key for preview and done phases
  useEffect(() => {
    if (phase !== "done" && phase !== "preview") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (phase === "preview") {
          startGame();
        } else if (phase === "done" && onNext) {
          onNext();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, onNext, startGame]);

  const isWordEditable = useCallback(
    (i: number) => {
      if (correctSet.has(i) || revealedSet.has(i)) return false;
      if (phase === "playing") return true;
      if (phase === "checking") return true;
      return false;
    },
    [phase, correctSet, revealedSet]
  );

  if (phase === "preview") {
    return (
      <div className="flex flex-col items-center gap-8 py-12">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800">{sentence.english}</p>
          {sentence.chinese && (
            <p className="mt-3 text-base text-gray-400">{sentence.chinese}</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => speakText(sentence.english, "en-US", 0.85)}
            className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-500 hover:bg-gray-100"
          >
            🔊 朗读
          </button>
          <button
            onClick={startGame}
            className="rounded-full bg-gray-900 px-6 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            开始练习
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-5xl">{totalErrors === 0 ? "✨" : "💪"}</div>
        <p className="text-xl font-medium text-gray-800">
          {totalErrors === 0 ? "完美通关！" : "继续加油！"}
        </p>
        <p className="text-sm text-gray-400">
          答错 {totalErrors} 次 · 用时{" "}
          {((Date.now() - startTime) / 1000).toFixed(1)} 秒
        </p>
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xl font-semibold">
          {words.map((word, i) => (
            <span
              key={i}
              className={
                correctSet.has(i)
                  ? "text-gray-800"
                  : revealedSet.has(i)
                  ? "text-red-500 line-through"
                  : "text-gray-400"
              }
            >
              {word}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => speakText(sentence.english, "en-US", 0.85)}
            className="rounded-full border border-gray-200 px-5 py-2 text-sm text-gray-500 hover:bg-gray-100"
          >
            🔊 再听一遍
          </button>
          <button
            onClick={startGame}
            className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            重新练习
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {sentence.chinese && (
        <p className="text-sm text-gray-400">{sentence.chinese}</p>
      )}

      <button
        onClick={() => speakText(sentence.english, "en-US", 0.85)}
        className="rounded-full border border-gray-200 px-4 py-1.5 text-xs text-gray-400 hover:bg-gray-100"
      >
        🔊 重听整句
      </button>

      <div className="flex flex-wrap items-end justify-center gap-x-4 gap-y-6">
        {words.map((word, i) => {
          if (isPunct(word)) {
            return (
              <span key={i} className="self-end pb-1.5 text-2xl font-bold text-gray-300">
                {word}
              </span>
            );
          }

          const isCurrent = i === focusIndex;
          const isCorrect = correctSet.has(i);
          const isRevealed = revealedSet.has(i);
          const isWrong = !isCorrect && !isRevealed && (inputs[i] || "").trim().length > 0;
          const editable = isWordEditable(i);
          const cleanLen = word.replace(/[.!?,;:'"]/g, "").length;

          return (
            <div key={i} className="flex flex-col items-center">
              {isRevealed ? (
                <span className="text-2xl font-bold text-red-500">
                  {word.replace(/[.!?,;:'"]/g, "")}
                </span>
              ) : (
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  value={inputs[i]}
                  onChange={(e) => {
                    if (!editable) return;
                    const newInputs = [...inputs];
                    newInputs[i] = e.target.value;
                    setInputs(newInputs);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onFocus={() => setFocusIndex(i)}
                  onBlur={() => {
                    if (phase === "checking" && !isCorrect && !isRevealed && (inputs[i] || "").trim()) {
                      handleRetry(i);
                    }
                  }}
                  readOnly={!editable}
                  className={`bg-transparent text-center text-2xl font-bold outline-none transition-all placeholder:text-gray-200 ${
                    isCorrect
                      ? "text-green-600"
                      : isWrong
                      ? "text-red-500"
                      : "text-gray-800"
                  }`}
                  style={{
                    width: `${Math.max(cleanLen * 20, 50)}px`,
                    borderBottom: `2.5px solid ${
                      isCorrect ? "#22c55e" : isWrong ? "#ef4444" : isCurrent ? "#3b82f6" : "#e5e7eb"
                    }`,
                    borderLeft: "none",
                    borderRight: "none",
                    borderTop: "none",
                    borderRadius: 0,
                    padding: "4px 2px",
                  }}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={isCurrent && editable ? "..." : ""}
                />
              )}
              {!isCorrect && !isRevealed && (wrongCounts.get(i) || 0) > 0 && (
                <span className="mt-1 text-[11px] text-red-400">
                  {wrongCounts.get(i)}/3
                </span>
              )}
              {isRevealed && (
                <span className="mt-1 text-[11px] text-gray-400">已揭晓</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-300">
        {phase === "playing"
          ? "填写完所有单词后自动批改"
          : "修改错误单词后按 Enter · 自动跳转下一个错误"}
      </p>
    </div>
  );
}

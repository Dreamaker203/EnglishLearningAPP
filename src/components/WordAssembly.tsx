"use client";

import { useState, useCallback } from "react";
import { Sentence } from "@/lib/types";
import { shuffleArray } from "@/lib/sentence";
import { speakText } from "@/lib/tts";

interface WordAssemblyProps {
  sentence: Sentence;
  onComplete: (correct: boolean, time: number) => void;
}

export default function WordAssembly({
  sentence,
  onComplete,
}: WordAssemblyProps) {
  const [phase, setPhase] = useState<"preview" | "playing" | "done">("preview");
  const [shuffledWords, setShuffledWords] = useState<{ word: string; id: number }[]>([]);
  const [selectedWords, setSelectedWords] = useState<{ word: string; id: number }[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [errors, setErrors] = useState(0);

  const startGame = useCallback(() => {
    const words = sentence.words.map((w, i) => ({ word: w, id: i }));
    setShuffledWords(shuffleArray(words));
    setSelectedWords([]);
    setErrors(0);
    setStartTime(Date.now());
    setPhase("playing");
    speakText(sentence.english, "en-US", 0.9);
  }, [sentence]);

  const handleWordClick = useCallback(
    (item: { word: string; id: number }, fromPool: boolean) => {
      if (phase !== "playing") return;

      if (fromPool) {
        const expectedId = sentence.words.length - shuffledWords.length;
        const expected = sentence.words[expectedId];

        if (item.word === expected) {
          const newSelected = [...selectedWords, item];
          setSelectedWords(newSelected);
          setShuffledWords((prev) => prev.filter((w) => w.id !== item.id));

          if (newSelected.length === sentence.words.length) {
            const elapsed = (Date.now() - startTime) / 1000;
            setPhase("done");
            onComplete(errors === 0, elapsed);
          }
        } else {
          setErrors((e) => e + 1);
        }
      } else {
        setSelectedWords((prev) => prev.filter((w) => w.id !== item.id));
        setShuffledWords((prev) => [...prev, item]);
      }
    },
    [phase, selectedWords, shuffledWords, sentence, errors, startTime, onComplete]
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
        <div className="text-5xl">{errors === 0 ? "✨" : "💪"}</div>
        <p className="text-xl font-medium text-gray-800">
          {errors === 0 ? "完美通关！" : "继续加油！"}
        </p>
        <p className="text-sm text-gray-400">
          答错 {errors} 次 · 用时 {((Date.now() - startTime) / 1000).toFixed(1)} 秒
        </p>
        <p className="text-lg text-gray-700">{sentence.english}</p>
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
    <div className="flex flex-col gap-6 py-4">
      {sentence.chinese && (
        <p className="text-center text-sm text-gray-400">{sentence.chinese}</p>
      )}

      <div className="min-h-[52px] rounded-lg border border-gray-100 bg-white p-3">
        <div className="flex flex-wrap items-center gap-2">
          {selectedWords.length === 0 && (
            <span className="text-sm text-gray-300">点击下方单词组成句子</span>
          )}
          {selectedWords.map((item) => (
            <button
              key={item.id}
              onClick={() => handleWordClick(item, false)}
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              {item.word}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {shuffledWords.map((item) => (
          <button
            key={item.id}
            onClick={() => handleWordClick(item, true)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
          >
            {item.word}
          </button>
        ))}
      </div>
    </div>
  );
}

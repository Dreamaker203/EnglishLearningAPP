"use client";

import { useState } from "react";
import { Sentence } from "@/lib/types";
import { speakText, speakWordByWord } from "@/lib/tts";

interface WordReaderProps {
  sentence: Sentence;
}

export default function WordReader({ sentence }: WordReaderProps) {
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeakAll = async () => {
    setIsPlaying(true);
    await speakText(sentence.english, "en-US", 0.85);
    setIsPlaying(false);
  };

  const handleWordByWord = async () => {
    setIsPlaying(true);
    await speakWordByWord(sentence.words, setHighlightIndex, "en-US", 0.7);
    setHighlightIndex(-1);
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-100 bg-white p-6">
      <p className="text-lg leading-relaxed">
        {sentence.words.map((word, i) => (
          <span
            key={i}
            className={`inline-block transition-all duration-150 ${
              highlightIndex === i
                ? "scale-105 rounded bg-yellow-100 px-1 font-semibold text-yellow-800"
                : "text-gray-700"
            }`}
          >
            {word}{" "}
          </span>
        ))}
      </p>

      {sentence.chinese && (
        <p className="text-sm text-gray-400">{sentence.chinese}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSpeakAll}
          disabled={isPlaying}
          className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40"
        >
          🔊 朗读整句
        </button>
        <button
          onClick={handleWordByWord}
          disabled={isPlaying}
          className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-40"
        >
          📖 逐词跟读
        </button>
      </div>
    </div>
  );
}

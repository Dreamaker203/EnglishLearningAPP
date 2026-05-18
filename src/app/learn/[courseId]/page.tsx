"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { courses } from "@/data/courses";
import {
  getCustomCourses,
  updateSentenceProgress,
  updateStats,
  getProgress,
} from "@/lib/storage";
import { Course, PracticeMode, UserProgress } from "@/lib/types";
import SentenceBreakdown from "@/components/SentenceBreakdown";
import WordAssembly from "@/components/WordAssembly";
import WordReader from "@/components/WordReader";
import ProgressBar from "@/components/ProgressBar";

export default function LearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [mounted, setMounted] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [mode, setMode] = useState<PracticeMode>("breakdown");
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [showReader, setShowReader] = useState(false);

  useEffect(() => {
    const allCourses = [...courses, ...getCustomCourses()];
    const found = allCourses.find((c) => c.id === courseId);
    if (found) setCourse(found);
    setProgress(getProgress());
    setMounted(true);
  }, [courseId]);

  const handleComplete = useCallback(
    (correct: boolean, time: number) => {
      if (!course) return;
      const lesson = course.lessons[lessonIndex];
      const sentence = lesson.sentences[sentenceIndex];
      updateSentenceProgress(course.id, lesson.id, sentence.id, correct, time);
      updateStats(time);
      setProgress(getProgress());
    },
    [course, lessonIndex, sentenceIndex]
  );

  const goNext = useCallback(() => {
    if (!course) return;
    const lesson = course.lessons[lessonIndex];
    if (sentenceIndex < lesson.sentences.length - 1) {
      setSentenceIndex((i) => i + 1);
    } else if (lessonIndex < course.lessons.length - 1) {
      setLessonIndex((i) => i + 1);
      setSentenceIndex(0);
    }
  }, [course, lessonIndex, sentenceIndex]);

  const goPrev = useCallback(() => {
    if (sentenceIndex > 0) {
      setSentenceIndex((i) => i - 1);
    } else if (lessonIndex > 0) {
      setLessonIndex((i) => i - 1);
      if (course) {
        setSentenceIndex(course.lessons[lessonIndex - 1].sentences.length - 1);
      }
    }
  }, [course, lessonIndex, sentenceIndex]);

  if (!course) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">加载中...</p>
      </div>
    );
  }

  const lesson = course.lessons[lessonIndex];
  const sentence = lesson.sentences[sentenceIndex];
  const globalIndex =
    course.lessons.slice(0, lessonIndex).reduce((s, l) => s + l.sentences.length, 0) +
    sentenceIndex;
  const totalSentences = course.lessons.reduce((s, l) => s + l.sentences.length, 0);

  const isCompleted = progress.some(
    (p) =>
      p.courseId === course.id &&
      p.lessonId === lesson.id &&
      p.sentenceId === sentence.id &&
      p.completed
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← 返回
        </button>
        <span className="text-sm text-gray-400">
          {course.title}
        </span>
      </div>

      <ProgressBar
        current={globalIndex + 1}
        total={totalSentences}
        label={lesson.title}
      />

      <div className="mt-6 mb-4 flex items-center justify-center gap-3">
        <div className="flex gap-1.5">
          {(["breakdown", "assembly"] as PracticeMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                mode === m
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {m === "breakdown" ? "听音填词" : "连词成句"}
            </button>
          ))}
        </div>
        <span className="text-gray-200">|</span>
        <button
          onClick={() => setShowReader(!showReader)}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            showReader
              ? "bg-blue-100 text-blue-700"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          朗读
        </button>
      </div>

      {isCompleted && (
        <div className="mb-4 text-center text-sm text-green-600">
          ✓ 已完成
        </div>
      )}

      <div className="rounded-xl border border-gray-100 bg-white p-6">
        {mode === "breakdown" ? (
          <SentenceBreakdown sentence={sentence} onComplete={handleComplete} onNext={goNext} />
        ) : (
          <WordAssembly sentence={sentence} onComplete={handleComplete} />
        )}
      </div>

      {showReader && (
        <div className="mt-4">
          <WordReader sentence={sentence} />
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={lessonIndex === 0 && sentenceIndex === 0}
          className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-30"
        >
          ← 上一句
        </button>
        <span className="text-xs text-gray-300">
          {sentenceIndex + 1} / {lesson.sentences.length}
        </span>
        <button
          onClick={goNext}
          disabled={
            lessonIndex === course.lessons.length - 1 &&
            sentenceIndex === lesson.sentences.length - 1
          }
          className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-30"
        >
          下一句 →
        </button>
      </div>
    </div>
  );
}

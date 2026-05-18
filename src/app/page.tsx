"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import ScoreBoard from "@/components/ScoreBoard";
import { courses } from "@/data/courses";
import { getCustomCourses, getProgress } from "@/lib/storage";
import { Course, UserProgress } from "@/lib/types";
import Link from "next/link";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [customCourses, setCustomCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    setCustomCourses(getCustomCourses());
    setProgress(getProgress());
    setMounted(true);
  }, []);

  const getCompletedCount = (courseId: string) => {
    return progress.filter((p) => p.courseId === courseId && p.completed).length;
  };

  const allCourses = [...courses, ...customCourses];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          用<span className="text-blue-600">句子</span>学英语
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          每天 10 分钟，在真实语境中掌握英语表达
        </p>
      </section>

      <section className="mb-10">
        <ScoreBoard />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">课程包</h2>
          <Link
            href="/upload"
            className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-500 transition-colors hover:bg-gray-100"
          >
            + 自定义句子
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              completedCount={getCompletedCount(course.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

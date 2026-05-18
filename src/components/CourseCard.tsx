"use client";

import Link from "next/link";
import { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
  completedCount?: number;
}

export default function CourseCard({ course, completedCount = 0 }: CourseCardProps) {
  const totalSentences = course.lessons.reduce(
    (sum, l) => sum + l.sentences.length,
    0
  );

  const difficultyLabel = {
    beginner: "初级",
    intermediate: "中级",
    advanced: "高级",
  };

  const difficultyColor = {
    beginner: "bg-green-100 text-green-700",
    intermediate: "bg-amber-100 text-amber-700",
    advanced: "bg-purple-100 text-purple-700",
  };

  return (
    <Link href={`/learn/${course.id}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        <div
          className={`h-32 bg-gradient-to-br ${course.coverColor} flex items-center justify-center`}
        >
          <span className="text-4xl font-bold text-white/90 drop-shadow">
            {course.title.slice(0, 2)}
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {course.title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {course.description}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
              {course.tag}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${difficultyColor[course.difficulty]}`}
            >
              {difficultyLabel[course.difficulty]}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>{course.lessons.length} 课时</span>
            <span>{totalSentences} 句子</span>
          </div>

          {completedCount > 0 && (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{
                    width: `${Math.min(
                      (completedCount / totalSentences) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                已完成 {completedCount}/{totalSentences}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

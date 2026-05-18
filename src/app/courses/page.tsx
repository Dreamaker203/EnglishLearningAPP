"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { courses } from "@/data/courses";
import { getCustomCourses, getProgress, deleteCustomCourse } from "@/lib/storage";
import { Course, UserProgress } from "@/lib/types";

export default function CoursesPage() {
  const [mounted, setMounted] = useState(false);
  const [customCourses, setCustomCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setCustomCourses(getCustomCourses());
    setProgress(getProgress());
    setMounted(true);
  }, []);

  const getCompletedCount = (courseId: string) => {
    return progress.filter((p) => p.courseId === courseId && p.completed).length;
  };

  const handleDelete = (courseId: string) => {
    if (confirm("确定要删除这个自定义课程吗？")) {
      deleteCustomCourse(courseId);
      setCustomCourses(getCustomCourses());
    }
  };

  const allCourses = [...courses, ...customCourses];
  const tags = ["all", ...new Set(allCourses.map((c) => c.tag))];
  const filtered =
    filter === "all" ? allCourses : allCourses.filter((c) => c.tag === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
        全部课程
      </h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              filter === tag
                ? "bg-gray-900 text-white"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tag === "all" ? "全部" : tag}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <div key={course.id} className="relative">
            <CourseCard
              course={course}
              completedCount={getCompletedCount(course.id)}
            />
            {course.isCustom && (
              <button
                onClick={() => handleDelete(course.id)}
                className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow transition-colors hover:bg-red-600"
                title="删除课程"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

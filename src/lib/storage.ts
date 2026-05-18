import { UserProgress, UserStats, Course } from "./types";

const PROGRESS_KEY = "english-learning-progress";
const STATS_KEY = "english-learning-stats";
const CUSTOM_COURSES_KEY = "english-learning-custom-courses";

export function getProgress(): UserProgress[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveProgress(progress: UserProgress[]) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function updateSentenceProgress(
  courseId: string,
  lessonId: string,
  sentenceId: string,
  correct: boolean,
  time?: number
) {
  const all = getProgress();
  const existing = all.find(
    (p) =>
      p.courseId === courseId &&
      p.lessonId === lessonId &&
      p.sentenceId === sentenceId
  );

  if (existing) {
    existing.attempts += 1;
    if (correct) existing.correctAttempts += 1;
    if (time && (!existing.bestTime || time < existing.bestTime)) {
      existing.bestTime = time;
    }
    if (correct) existing.completed = true;
  } else {
    all.push({
      courseId,
      lessonId,
      sentenceId,
      completed: correct,
      bestTime: correct ? time : undefined,
      attempts: 1,
      correctAttempts: correct ? 1 : 0,
    });
  }

  saveProgress(all);
}

export function getStats(): UserStats {
  if (typeof window === "undefined") {
    return { totalSentences: 0, totalTime: 0, streak: 0, lastPracticeDate: "" };
  }
  const data = localStorage.getItem(STATS_KEY);
  return data
    ? JSON.parse(data)
    : { totalSentences: 0, totalTime: 0, streak: 0, lastPracticeDate: "" };
}

export function updateStats(time: number) {
  const stats = getStats();
  stats.totalSentences += 1;
  stats.totalTime += time;

  const today = new Date().toISOString().split("T")[0];
  if (stats.lastPracticeDate !== today) {
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    stats.streak =
      stats.lastPracticeDate === yesterday ? stats.streak + 1 : 1;
    stats.lastPracticeDate = today;
  }

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getCustomCourses(): Course[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CUSTOM_COURSES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCustomCourse(course: Course) {
  const courses = getCustomCourses();
  const existing = courses.findIndex((c) => c.id === course.id);
  if (existing >= 0) {
    courses[existing] = course;
  } else {
    courses.push(course);
  }
  localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(courses));
}

export function deleteCustomCourse(courseId: string) {
  const courses = getCustomCourses().filter((c) => c.id !== courseId);
  localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(courses));
}

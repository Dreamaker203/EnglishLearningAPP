export interface Sentence {
  id: string;
  english: string;
  chinese: string;
  words: string[];
  chunks?: string[][];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  sentences: Sentence[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  coverColor: string;
  tag: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  lessons: Lesson[];
  isCustom?: boolean;
}

export interface UserProgress {
  courseId: string;
  lessonId: string;
  sentenceId: string;
  completed: boolean;
  bestTime?: number;
  attempts: number;
  correctAttempts: number;
}

export interface UserStats {
  totalSentences: number;
  totalTime: number;
  streak: number;
  lastPracticeDate: string;
}

export type PracticeMode = "breakdown" | "assembly";

export interface PracticeState {
  currentSentenceIndex: number;
  mode: PracticeMode;
  isStarted: boolean;
  isComplete: boolean;
  startTime: number;
  errors: number;
  selectedChunks: string[];
  availableChunks: string[][];
}

export interface Word {
  id: number;
  hebrew: string;
  arabic: string;
  transliteration: string;
  category: string;
}

export interface QuizResult {
  date: string;
  score: number;
  total: number;
}

export interface Progress {
  learnedWords: number[];
  quizScores: QuizResult[];
  lastStudied: string;
}

export type ViewMode = 'flashcards' | 'quiz' | 'progress';

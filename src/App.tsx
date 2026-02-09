import { useState } from 'react';
import type { ViewMode, Progress, QuizResult } from './types';
import { vocabulary } from './data/vocabulary';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navigation } from './components/Navigation';
import { FlashcardList } from './components/FlashcardList';
import { Quiz } from './components/Quiz';
import { ProgressTracker } from './components/ProgressTracker';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('flashcards');
  const [progress, setProgress] = useLocalStorage<Progress>('arabicLearningProgress', {
    learnedWords: [],
    quizScores: [],
    lastStudied: '',
  });

  const handleMarkAsLearned = (wordId: number) => {
    setProgress({
      ...progress,
      learnedWords: progress.learnedWords.includes(wordId)
        ? progress.learnedWords.filter((id) => id !== wordId)
        : [...progress.learnedWords, wordId],
      lastStudied: new Date().toISOString(),
    });
  };

  const handleQuizComplete = (result: QuizResult) => {
    setProgress({
      ...progress,
      quizScores: [...progress.quizScores, result],
      lastStudied: new Date().toISOString(),
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>לימוד ערבית</h1>
        <p className="subtitle">למד מילים בסיסיות בערבית</p>
      </header>

      <Navigation currentView={currentView} onViewChange={setCurrentView} />

      <main className="app-main">
        {currentView === 'flashcards' && (
          <FlashcardList
            words={vocabulary}
            learnedWords={progress.learnedWords}
            onMarkAsLearned={handleMarkAsLearned}
          />
        )}
        {currentView === 'quiz' && (
          <Quiz words={vocabulary} onQuizComplete={handleQuizComplete} />
        )}
        {currentView === 'progress' && (
          <ProgressTracker progress={progress} totalWords={vocabulary.length} />
        )}
      </main>
    </div>
  );
}

export default App;

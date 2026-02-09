import type { ViewMode } from '../types';

interface NavigationProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="navigation">
      <button
        className={currentView === 'flashcards' ? 'active' : ''}
        onClick={() => onViewChange('flashcards')}
      >
        כרטיסיות
      </button>
      <button
        className={currentView === 'quiz' ? 'active' : ''}
        onClick={() => onViewChange('quiz')}
      >
        חידון
      </button>
      <button
        className={currentView === 'progress' ? 'active' : ''}
        onClick={() => onViewChange('progress')}
      >
        התקדמות
      </button>
    </nav>
  );
}

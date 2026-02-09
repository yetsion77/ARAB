import { useState, useMemo } from 'react';
import type { Word } from '../types';
import { Flashcard } from './Flashcard';

interface FlashcardListProps {
  words: Word[];
  learnedWords: number[];
  onMarkAsLearned: (wordId: number) => void;
}

export function FlashcardList({ words, learnedWords, onMarkAsLearned }: FlashcardListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories from words
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(words.map(word => word.category)));
    return uniqueCategories.sort();
  }, [words]);

  // Filter words by selected category
  const filteredWords = useMemo(() => {
    if (!selectedCategory) return words;
    return words.filter(word => word.category === selectedCategory);
  }, [words, selectedCategory]);

  // Reset index when category changes
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  const currentWord = filteredWords[currentIndex];
  const isLearned = learnedWords.includes(currentWord.id);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const toggleLearned = () => {
    onMarkAsLearned(currentWord.id);
  };

  return (
    <div className="flashcard-list">
      <div className="category-filter">
        <button
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => handleCategoryChange(null)}
        >
          הכל ({words.length})
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category} ({words.filter(w => w.category === category).length})
          </button>
        ))}
      </div>

      <div className="counter">
        כרטיסייה {currentIndex + 1} מתוך {filteredWords.length}
        {selectedCategory && ` (${selectedCategory})`}
      </div>

      <Flashcard word={currentWord} />

      <div className="controls">
        <button onClick={goToPrevious} disabled={filteredWords.length <= 1}>
          ← קודם
        </button>
        <button
          className={`learned-btn ${isLearned ? 'learned' : ''}`}
          onClick={toggleLearned}
        >
          {isLearned ? '✓ נלמד' : 'סמן כנלמד'}
        </button>
        <button onClick={goToNext} disabled={filteredWords.length <= 1}>
          הבא →
        </button>
      </div>
    </div>
  );
}

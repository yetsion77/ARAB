import { useState } from 'react';
import type { Word } from '../types';
import { useSpeech } from '../hooks/useSpeech';

interface FlashcardProps {
  word: Word;
}

export function Flashcard({ word }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { speak, isSpeaking, isSupported } = useSpeech();

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    speak(word.arabic, 'ar-SA');
  };

  return (
    <div className="flashcard" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
        <div className="flashcard-front">
          <div className="word">{word.hebrew}</div>
          <div className="category">{word.category}</div>
          <div className="hint">לחץ להפוך</div>
        </div>
        <div className="flashcard-back">
          {isSupported && (
            <button
              className={`audio-btn ${isSpeaking ? 'speaking' : ''}`}
              onClick={handleSpeak}
              aria-label="הקרא את המילה"
            >
              🔊
            </button>
          )}
          <div className="word arabic">{word.arabic}</div>
          <div className="transliteration">{word.transliteration}</div>
        </div>
      </div>
    </div>
  );
}

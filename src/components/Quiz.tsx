import { useState, useEffect } from 'react';
import type { Word, QuizResult } from '../types';

interface QuizProps {
  words: Word[];
  onQuizComplete: (result: QuizResult) => void;
}

interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

export function Quiz({ words, onQuizComplete }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    const quizWords = shuffled.slice(0, Math.min(10, words.length));

    const quizQuestions: QuizQuestion[] = quizWords.map((word) => {
      const wrongOptions = words
        .filter((w) => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.arabic);

      const options = [word.arabic, ...wrongOptions].sort(() => Math.random() - 0.5);

      return {
        word,
        options,
        correctAnswer: word.arabic,
      };
    });

    setQuestions(quizQuestions);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      const result: QuizResult = {
        date: new Date().toISOString(),
        score: score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0),
        total: questions.length,
      };
      onQuizComplete(result);
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowFeedback(false);
    setQuizFinished(false);
    generateQuiz();
  };

  if (questions.length === 0) {
    return <div className="quiz loading">טוען חידון...</div>;
  }

  if (quizFinished) {
    const finalScore = score + (selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);

    return (
      <div className="quiz finished">
        <h2>סיימת את החידון!</h2>
        <div className="score-display">
          <div className="score-big">{percentage}%</div>
          <div className="score-text">
            ענית נכון על {finalScore} מתוך {questions.length} שאלות
          </div>
        </div>
        <button onClick={restartQuiz} className="restart-btn">
          התחל חידון חדש
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="question-counter">
          שאלה {currentQuestionIndex + 1} מתוך {questions.length}
        </div>
        <div className="score">ניקוד: {score}</div>
      </div>

      <div className="question">
        <h2>מה התרגום לערבית של:</h2>
        <div className="question-word">{currentQuestion.word.hebrew}</div>
      </div>

      <div className="options">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === currentQuestion.correctAnswer;
          const showCorrect = showFeedback && isCorrectOption;
          const showWrong = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={index}
              className={`option ${showCorrect ? 'correct' : ''} ${showWrong ? 'wrong' : ''} ${
                isSelected ? 'selected' : ''
              }`}
              onClick={() => handleAnswerSelect(option)}
              disabled={showFeedback}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? '✓ נכון!' : `✗ לא נכון. התשובה הנכונה היא: ${currentQuestion.correctAnswer}`}
        </div>
      )}

      {showFeedback && (
        <button onClick={handleNext} className="next-btn">
          {currentQuestionIndex < questions.length - 1 ? 'שאלה הבאה' : 'סיים חידון'}
        </button>
      )}
    </div>
  );
}

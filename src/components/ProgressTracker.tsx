import type { Progress } from '../types';

interface ProgressTrackerProps {
  progress: Progress;
  totalWords: number;
}

export function ProgressTracker({ progress, totalWords }: ProgressTrackerProps) {
  const learnedCount = progress.learnedWords.length;
  const percentage = Math.round((learnedCount / totalWords) * 100);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'אף פעם';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  const averageScore =
    progress.quizScores.length > 0
      ? Math.round(
          progress.quizScores.reduce((sum, result) => sum + (result.score / result.total) * 100, 0) /
            progress.quizScores.length
        )
      : 0;

  return (
    <div className="progress-tracker">
      <h2>ההתקדמות שלך</h2>

      <div className="stat-card">
        <h3>מילים שנלמדו</h3>
        <div className="stat-value">
          {learnedCount} / {totalWords}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="progress-percentage">{percentage}%</div>
      </div>

      <div className="stat-card">
        <h3>למידה אחרונה</h3>
        <div className="stat-value">{formatDate(progress.lastStudied)}</div>
      </div>

      <div className="stat-card">
        <h3>חידונים</h3>
        <div className="stat-value">
          {progress.quizScores.length} חידונים בוצעו
          {progress.quizScores.length > 0 && (
            <div className="average-score">ממוצע: {averageScore}%</div>
          )}
        </div>
      </div>

      {progress.quizScores.length > 0 && (
        <div className="quiz-history">
          <h3>היסטוריית חידונים</h3>
          <div className="quiz-list">
            {progress.quizScores.slice(-5).reverse().map((result, index) => (
              <div key={index} className="quiz-item">
                <span className="quiz-date">{formatDate(result.date)}</span>
                <span className="quiz-score">
                  {result.score}/{result.total} ({Math.round((result.score / result.total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

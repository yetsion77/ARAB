# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hebrew-to-Arabic vocabulary learning application built with React, TypeScript, and Vite. The app helps users learn basic Arabic words through flashcards, quizzes, and progress tracking.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### No Testing Setup
This project does not currently have tests configured. If adding tests, consider using Vitest (already compatible with Vite).

## Architecture

### State Management Pattern
The app uses a simple, localStorage-backed state management approach:
- **Progress state** is stored in localStorage via `useLocalStorage` hook
- All user data (learned words, quiz scores) persists across sessions
- State updates trigger automatic localStorage saves
- No external state management library (Redux, Zustand) is used

### View-Based Architecture
The application follows a view-switching pattern managed in [App.tsx](src/App.tsx):
- Three main views: `flashcards`, `quiz`, `progress`
- View state is managed with React `useState` (ViewMode type)
- Navigation component switches between views
- Each view is self-contained with its own component and logic

### Data Flow
1. **Vocabulary data** ([src/data/vocabulary.ts](src/data/vocabulary.ts)) is static and immutable
2. **User progress** flows through App.tsx to child components as props
3. **Callback pattern** for state updates: child components call parent handlers
4. **No prop drilling issues** due to shallow component hierarchy (max 2 levels)

## Key Components

### Core Components
- **App.tsx** - Root component, manages view state and progress
- **Navigation** - Tab-based view switcher
- **FlashcardList** - Manages flashcard navigation and "learned" status
- **Flashcard** - Individual card with flip animation
- **Quiz** - Quiz logic with random questions and scoring
- **ProgressTracker** - Statistics display

### Custom Hooks
- **useLocalStorage** ([src/hooks/useLocalStorage.ts](src/hooks/useLocalStorage.ts)) - Syncs state with localStorage, handles JSON serialization

### Type System
All types are defined in [src/types/index.ts](src/types/index.ts):
- `Word` - Vocabulary entry (id, hebrew, arabic, transliteration, category)
- `Progress` - User learning data (learnedWords, quizScores, lastStudied)
- `QuizResult` - Individual quiz score (date, score, total)
- `ViewMode` - Union type for view switching

## Adding New Vocabulary

To add new words, edit [src/data/vocabulary.ts](src/data/vocabulary.ts):
1. Add Word objects to the `vocabulary` array
2. Ensure unique `id` values
3. Include all required fields: hebrew, arabic, transliteration, category
4. Categories are user-facing strings (displayed in UI)

## Styling Approach

- **CSS-only** - No CSS-in-JS or Tailwind
- **Global styles** in [src/index.css](src/index.css) (resets, body, buttons)
- **Component styles** in [src/App.css](src/App.css) (all component-specific styles)
- **RTL support** - `direction: rtl` set in body
- **Gradient theme** - Purple/blue gradient used throughout (defined in CSS custom properties would improve maintainability)

## Key Implementation Details

### Flashcard Flip Animation
The flashcard flip uses CSS 3D transforms:
- Container has `perspective: 1000px`
- Inner element uses `transform-style: preserve-3d`
- Flip triggered by adding `.flipped` class (rotateY(180deg))
- Back face has `backface-visibility: hidden` and is rotated 180deg initially

### Quiz Question Generation
Quiz logic in [src/components/Quiz.tsx](src/components/Quiz.tsx):
- Selects 10 random words on mount
- For each question, generates 3 wrong answers from other vocabulary words
- Randomizes option order to prevent pattern detection
- Tracks score across questions before final submission

### LocalStorage Schema
```json
{
  "arabicLearningProgress": {
    "learnedWords": [1, 5, 12],
    "quizScores": [
      { "date": "2024-01-01T10:00:00.000Z", "score": 8, "total": 10 }
    ],
    "lastStudied": "2024-01-01T10:00:00.000Z"
  }
}
```

## Common Modifications

### Adding a New View
1. Add view name to `ViewMode` type in [src/types/index.ts](src/types/index.ts)
2. Create component in [src/components/](src/components/)
3. Add navigation button in [Navigation.tsx](src/components/Navigation.tsx)
4. Add view rendering in [App.tsx](src/App.tsx) main content section
5. Add component styles to [App.css](src/App.css)

### Modifying Progress Tracking
The Progress interface and all tracking logic centers around [App.tsx](src/App.tsx):
- To track new metrics, extend `Progress` type
- Update `useLocalStorage` initial value in App.tsx
- Modify ProgressTracker component to display new metrics

### Changing Quiz Configuration
Quiz parameters are hardcoded in [Quiz.tsx](src/components/Quiz.tsx):
- Number of questions: `Math.min(10, words.length)`
- Number of options per question: 4 (1 correct + 3 wrong)
- To make configurable, lift to App.tsx as props or create config file

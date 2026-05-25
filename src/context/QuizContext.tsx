// ===== QuizContext: Global State Management =====
import { createContext, useContext, useReducer, type Dispatch } from 'react';
import type { Answers, ScoreResult, Question } from '../data/types';
import { calcScores, isComplete } from '../engine/scoring';

// ── State ──
interface QuizState {
  answers: Answers;
  result: ScoreResult | null;
  submitted: boolean;
}

const InitialState: QuizState = {
  answers: {},
  result: null,
  submitted: false,
};

// ── Actions ──
type QuizAction =
  | { type: 'SELECT'; questionId: number; optionIndex: number }
  | { type: 'RESET' }
  | { type: 'SUBMIT'; result: ScoreResult };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SELECT': {
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.optionIndex },
      };
    }
    case 'RESET':
      return { ...InitialState };
    case 'SUBMIT':
      return {
        ...state,
        result: action.result,
        submitted: true,
      };
    default:
      return state;
  }
}

// ── Context ──
interface QuizContextValue {
  state: QuizState;
  dispatch: Dispatch<QuizAction>;
  selectAnswer: (questionId: number, optionIndex: number) => void;
  submit: () => ScoreResult | null;
  reset: () => void;
  getProgress: () => { answered: number; total: number; pct: number };
  isComplete: () => boolean;
  questions: Question[];
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children, questions }: { children: React.ReactNode; questions: Question[] }) {
  const [state, dispatch] = useReducer(quizReducer, InitialState);

  const selectAnswer = (questionId: number, optionIndex: number) => {
    dispatch({ type: 'SELECT', questionId, optionIndex });
  };

  const submit = (): ScoreResult | null => {
    if (state.submitted) return state.result;
    const result = calcScores(state.answers, questions);
    dispatch({ type: 'SUBMIT', result });
    return result;
  };

  const reset = () => dispatch({ type: 'RESET' });

  const getProgress = () => {
    const answered = Object.keys(state.answers).length;
    const total = questions.length;
    return { answered, total, pct: Math.round((answered / total) * 100) };
  };
  const isCompleteFn = () => isComplete(state.answers, questions);

  const value: QuizContextValue = {
    state,
    dispatch,
    selectAnswer,
    submit,
    reset,
    getProgress,
    isComplete: isCompleteFn,
    questions,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within <QuizProvider>');
  return ctx;
}

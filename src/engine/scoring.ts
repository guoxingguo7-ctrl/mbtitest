// ===== MBTI Scoring Engine =====
import type { Answers, ScoreResult, DimPair, DimKey } from '../data/types';
import { QUESTIONS } from '../data/questions';

const DIM_PAIRS: Array<{ dim: DimPair; p1: DimKey; p2: DimKey }> = [
  { dim: 'ei', p1: 'E', p2: 'I' },
  { dim: 'sn', p1: 'S', p2: 'N' },
  { dim: 'tf', p1: 'T', p2: 'F' },
  { dim: 'jp', p1: 'J', p2: 'P' },
];

/**
 * Calculate MBTI scores from user answers.
 * @param answers - Map of question ID to selected option index (0-3)
 * @returns ScoreResult with type code, raw sums, and dimension details
 */
export function calcScores(answers: Answers): ScoreResult {
  const sums: Record<DimKey, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const q of QUESTIONS) {
    const idx = answers[q.id];
    if (idx === undefined) continue;
    const scores = q.options[idx].scores;
    for (const [dim, val] of Object.entries(scores)) {
      sums[dim as DimKey] = (sums[dim as DimKey] || 0) + (val as number);
    }
  }

  const dims = {} as Record<DimPair, ScoreResult['dims'][DimPair]>;
  let typeCode = '';

  for (const pair of DIM_PAIRS) {
    const s1 = sums[pair.p1] || 0;
    const s2 = sums[pair.p2] || 0;
    const total = s1 + s2;
    const pct = total > 0 ? Math.round((s1 / total) * 100) : 50;

    dims[pair.dim] = {
      raw: { [pair.p1]: s1, [pair.p2]: s2 } as Record<DimKey, number>,
      pole: pct >= 50 ? pair.p1 : pair.p2,
      pct,
      strength: Math.abs(pct - 50),
    };

    typeCode += pct >= 50 ? pair.p1 : pair.p2;
  }

  return { type: typeCode as ScoreResult['type'], sums, dims };
}

/**
 * Get completion percentage and answered count.
 */
export function getProgress(answers: Answers): { answered: number; total: number; pct: number } {
  const answered = Object.keys(answers).length;
  return { answered, total: QUESTIONS.length, pct: Math.round((answered / QUESTIONS.length) * 100) };
}

/**
 * Check if all questions are answered.
 */
export function isComplete(answers: Answers): boolean {
  return Object.keys(answers).length >= QUESTIONS.length;
}

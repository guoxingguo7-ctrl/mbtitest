// ===== MBTI Scoring Engine =====
import type { Answers, ScoreResult, DimPair, DimKey, Question } from '../data/types';

const DIM_PAIRS: Array<{ dim: DimPair; p1: DimKey; p2: DimKey }> = [
  { dim: 'ei', p1: 'E', p2: 'I' },
  { dim: 'sn', p1: 'S', p2: 'N' },
  { dim: 'tf', p1: 'T', p2: 'F' },
  { dim: 'jp', p1: 'J', p2: 'P' },
];

/**
 * Calculate MBTI scores from user answers.
 * @param answers - Map of question ID to selected option index (0-3)
 * @param questions - Question bank to score against
 * @returns ScoreResult with type code, raw sums, and dimension details
 */
export function calcScores(answers: Answers, questions: Question[]): ScoreResult {
  const idSet = new Set(questions.map(q => q.id));
  const sums: Record<DimKey, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  for (const q of questions) {
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
export function getProgress(answers: Answers, questions: Question[]): { answered: number; total: number; pct: number } {
  const answered = Object.keys(answers).length;
  const total = questions.length;
  return { answered, total: questions.length, pct: total > 0 ? Math.round((answered / total) * 100) : 0 };
}

/**
 * Check if all questions are answered.
 */
export function isComplete(answers: Answers, questions: Question[]): boolean {
  return Object.keys(answers).length >= questions.length;
}

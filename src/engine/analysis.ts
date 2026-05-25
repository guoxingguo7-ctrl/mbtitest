// ===== MBTI Analysis Engine =====
import type { TypeCode, DimPair } from '../data/types';
import { TYPE_GROUPS } from '../data/types';

export interface AnalysisSegment {
  dim: DimPair;
  dimName: string;
  lean: string;
  pct: number;
  segment: number;
  text: string;
}

// Imported from the data layer
let ANALYSIS_DATA: Record<string, Record<string, Record<string, Record<number, string>>>> = {};
let analysisLoaded = false;

async function ensureAnalysisLoaded(): Promise<void> {
  if (analysisLoaded) return;
  const mod = await import('../data/analysis');
  ANALYSIS_DATA = mod.ANALYSIS_DATA;
  analysisLoaded = true;
}

function getSegment(pct: number): number {
  // pct is first-pole percentage (>=50 means first pole, <50 means second pole)
  const score = pct >= 50 ? pct : 100 - pct;
  if (score < 60) return 0;
  if (score < 67) return 1;
  if (score < 73) return 2;
  if (score < 80) return 3;
  if (score < 87) return 4;
  return 5;
}

export async function getAnalysis(
  type: TypeCode,
  dim: DimPair,
  pct: number
): Promise<string> {
  await ensureAnalysisLoaded();

  const group = TYPE_GROUPS[type] || 'NT';

  // Determine lean: for dim pairs, first pole is the "left" one
  const leftPoles: Record<DimPair, [string, string]> = {
    ei: ['I', 'E'],
    sn: ['S', 'N'],
    tf: ['T', 'F'],
    jp: ['J', 'P'],
  };
  const [leftPole, rightPole] = leftPoles[dim];
  const lean = pct >= 50 ? leftPole : rightPole;

  const seg = getSegment(pct);

  const data = ANALYSIS_DATA[group];
  if (!data) return getDefault(type, dim, lean, seg);
  const dimData = data[dim];
  if (!dimData) return getDefault(type, dim, lean, seg);
  const leanData = dimData[lean];
  if (!leanData) return getDefault(type, dim, lean, seg);

  return leanData[seg] || leanData[2] || getDefault(type, dim, lean, seg);
}

function getDefault(type: TypeCode, dim: DimPair, lean: string, seg: number): string {
  const dimNames: Record<DimPair, string> = {
    ei: 'E/I 能量取向',
    sn: 'S/N 感知方式',
    tf: 'T/F 决策风格',
    jp: 'J/P 生活秩序',
  };
  const segLabels = ['弱', '偏弱', '中等', '偏强', '较强', '极强'];
  return `你的${dimNames[dim]}中，${lean}倾向${segLabels[seg] || '中等'}。作为${type}类型，这个维度的表现反映了你在日常生活中处理相关信息时的自然偏好。`;
}

/** Synchronous fallback for when async is not available */
export function getAnalysisSync(
  _type: TypeCode,
  dim: DimPair,
  pct: number
): string {
  const segLabels = ['弱', '偏弱', '中等', '偏强', '较强', '极强'];
  const dimNames: Record<DimPair, string> = {
    ei: 'E/I 能量取向',
    sn: 'S/N 感知方式',
    tf: 'T/F 决策风格',
    jp: 'J/P 生活秩序',
  };
  const seg = getSegment(pct);
  return `你的${dimNames[dim]}倾向${segLabels[seg] || '中等'}。完成全部题目后获得完整深度解读。`;
}

// ===== MBTI 相似人格分析引擎 =====
import type { TypeCode, DimPair, DimResult } from '../data/types';
import { TYPE_GROUPS, TYPE_DATA } from '../data/types';

export interface SimilarType {
  type: TypeCode;
  score: number;
  reason: string;
}

const GROUP_NAMES: Record<string, string> = {
  NT: '分析型',
  NF: '理想型',
  SJ: '守护型',
  SP: '探索型',
};

const DIM_LABELS: Record<DimPair, string> = {
  ei: 'E/I',
  sn: 'S/N',
  tf: 'T/F',
  jp: 'J/P',
};

/**
 * 计算与目标类型相似的其他人格类型
 * 基于：1)相同字母数量 2)同组别 3)影子类型关系
 */
export function getSimilarTypes(
  type: TypeCode,
  _dims: Record<DimPair, DimResult>
): SimilarType[] {
  const allTypes = Object.keys(TYPE_DATA) as TypeCode[];
  const results: SimilarType[] = [];

  for (const otherType of allTypes) {
    if (otherType === type) continue;

    let score = 0;
    const reasons: string[] = [];

    // 1. 相同字母数量（权重最高）
    let matchingLetters = 0;
    const dimKeys: DimPair[] = ['ei', 'sn', 'tf', 'jp'];
    for (let i = 0; i < 4; i++) {
      if (type[i] === otherType[i]) {
        matchingLetters++;
        const dim = dimKeys[i];
        reasons.push(`同样在${DIM_LABELS[dim]}偏好${type[i]}`);
      }
    }

    // 相同字母的评分
    if (matchingLetters === 3) score += 70;
    else if (matchingLetters === 2) score += 45;
    else if (matchingLetters === 1) score += 20;

    // 2. 同组别加分
    if (TYPE_GROUPS[type] === TYPE_GROUPS[otherType]) {
      score += 15;
      reasons.push(`同属${GROUP_NAMES[TYPE_GROUPS[type]]}群组`);
    }

    // 3. 影子类型加分（认知功能理论：四个字母全部取反）
    const shadowChar0 = type[0] === 'I' ? 'E' : 'I';
    const shadowChar1 = type[1] === 'S' ? 'N' : 'S';
    const shadowChar2 = type[2] === 'T' ? 'F' : 'T';
    const shadowChar3 = type[3] === 'J' ? 'P' : 'J';
    const shadowType = `${shadowChar0}${shadowChar1}${shadowChar2}${shadowChar3}` as TypeCode;

    if (otherType === shadowType) {
      score += 10;
      reasons.push('互为"影子类型"，有深层的互补性吸引');
    }

    results.push({
      type: otherType,
      score,
      reason: reasons.join('；'),
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .filter(s => s.score >= 20)
    .slice(0, 5);
}

/**
 * 获取相似类型的简要描述
 */
export function getSimilarityDescription(type: TypeCode, similarType: TypeCode): string {
  const typeMeta = TYPE_DATA[type];
  const similarMeta = TYPE_DATA[similarType];

  let sameCount = 0;
  for (let i = 0; i < 4; i++) {
    if (type[i] === similarType[i]) sameCount++;
  }

  const strengthMap: Record<number, string> = {
    3: '非常相似',
    2: '中等相似',
    1: '略有相似',
  };

  return `${similarMeta.name}（${similarType}）与你的${typeMeta.name}（${type}）${strengthMap[sameCount] || '存在某种联系'}。${similarMeta.desc}`;
}

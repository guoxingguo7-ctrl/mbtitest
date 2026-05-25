// ===== MBTI Type Definitions =====

export type DimKey = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
export type DimPair = 'ei' | 'sn' | 'tf' | 'jp';
export type TypeCode = `${'E'|'I'}${'S'|'N'}${'T'|'F'}${'J'|'P'}`;
export type TypeGroup = 'NT' | 'NF' | 'SJ' | 'SP';

export interface QuestionOption {
  text: string;
  scores: Partial<Record<DimKey, number>>;
}

export interface Question {
  id: number;
  scenario: string;
  options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
}

export interface Answers {
  [questionId: number]: number; // option index 0-3
}

export interface DimResult {
  raw: { [key in DimKey]?: number };
  pole: string;
  pct: number; // first pole's percentage (E vs I → E%, S vs N → S%, etc.)
  strength: number; // abs(pct - 50)
}

export interface ScoreResult {
  type: TypeCode;
  sums: Record<DimKey, number>;
  dims: Record<DimPair, DimResult>;
}

export interface TypeMeta {
  name: string;
  desc: string;
  traits: string[];
}

export const TYPE_GROUPS: Record<TypeCode, TypeGroup> = {
  'INTJ': 'NT', 'INTP': 'NT', 'ENTJ': 'NT', 'ENTP': 'NT',
  'INFJ': 'NF', 'INFP': 'NF', 'ENFJ': 'NF', 'ENFP': 'NF',
  'ISTJ': 'SJ', 'ISFJ': 'SJ', 'ESTJ': 'SJ', 'ESFJ': 'SJ',
  'ISTP': 'SP', 'ISFP': 'SP', 'ESTP': 'SP', 'ESFP': 'SP',
};

export const TYPE_DATA: Record<TypeCode, TypeMeta> = {
  'INTJ': { name: '建筑师', desc: '独立、战略性思维，拥有改善世界的强烈动力。在混乱中能看见秩序，在可能中能看见路径。沉默是蓄力，独处是燃料。', traits: ['战略眼光', '理性独立', '完美主义', '内敛高效', '直言不讳', '长期规划'] },
  'INTP': { name: '逻辑学家', desc: '对理论和抽象思维充满热情，喜欢用逻辑解构一切，包括自己。睡前可能在推导数学定理，也可能在质疑宇宙存在。', traits: ['逻辑分析', '好奇求知', '创新思维', '独立思考', '不拘一格', '专注深研'] },
  'ENTJ': { name: '指挥官', desc: '天生的领导者，对低效和混乱过敏。你总是先想到5步以后的事，而别人还在讨论要不要走第一步。', traits: ['决断果敢', '战略领导', '高效执行', '目标驱动', '逻辑严密', '直接坦率'] },
  'ENTP': { name: '辩论家', desc: '喜欢挑战，讨厌停滞。智识上的格斗是你的娱乐。规则在你眼里都是"现在暂时运作的假设"。', traits: ['思维活跃', '语言犀利', '挑战权威', '创意无限', '灵活变通', '享受辩论'] },
  'INFJ': { name: '提倡者', desc: '稀有的理想主义者。你能看穿表象，抵达人心深处。有时候独自坐着，却能感受到整个人类的悲喜。', traits: ['深刻洞察', '理想主义', '同理心强', '独立思考', '坚守原则', '神秘内敛'] },
  'INFP': { name: '调停者', desc: '内心住着一个宏大的故事世界。你把情感体验得比任何人都深，却很少全部说出口。创造力是你的本能，共情是你的超能力。', traits: ['创意丰富', '感情细腻', '价值驱动', '理想主义', '共情强烈', '自我探索'] },
  'ENFJ': { name: '主人公', desc: '天然的磁场，让人感到被看见。你在乎每一个人的成长，有时候照顾别人比照顾自己更自然。', traits: ['感召力强', '关怀他人', '组织协调', '价值导向', '沟通出色', '影响力大'] },
  'ENFP': { name: '竞选者', desc: '人生是一场充满可能性的冒险。你会为陌生人感动，会为一个想法熬夜，对世界永远保持孩子气的好奇。', traits: ['热情活力', '创意迸发', '善于共情', '乐观开放', '自由随性', '连接他人'] },
  'ISTJ': { name: '物流师', desc: '可靠到像一座桥。你不说废话，但做到一切。历史和经验是你的导航系统，责任感是你最稳固的驱动力。', traits: ['严格自律', '注重细节', '责任可靠', '尊重传统', '系统思维', '沉稳低调'] },
  'ISFJ': { name: '守卫者', desc: '安静地撑起周围人的世界。你记得每一个朋友的喜好，在需要的时候默默出现。温柔是你的力量，不是软弱。', traits: ['体贴入微', '忠诚可靠', '务实低调', '记忆力强', '乐于助人', '责任感强'] },
  'ESTJ': { name: '总经理', desc: '秩序和标准的守护者。在混乱的世界里，你能迅速建立规则并让其运转。效率是美德，计划是安全感。', traits: ['组织能力强', '果断执行', '注重规范', '直接高效', '责任担当', '实际务实'] },
  'ESFJ': { name: '执政官', desc: '团队的黏合剂。你天然关注每个人是否舒适，喜欢让事情有条不紊地运转，让所有人都感受到被照顾。', traits: ['人际和谐', '周到体贴', '守护传统', '组织协调', '情感敏锐', '积极热心'] },
  'ISTP': { name: '鉴赏家', desc: '低调的实用主义者。你喜欢拆解东西——机器、系统、人类行为。保持选项开放是你的哲学，行动本身就是答案。', traits: ['实践能力强', '冷静观察', '独立自主', '灵活变通', '技术导向', '逻辑务实'] },
  'ISFP': { name: '探险家', desc: '安静地活在感官里。美丽、音乐、自然、味道——你对这一切都有细腻的雷达。不爱争，但有自己坚守的柔软。', traits: ['艺术感性', '温和善良', '活在当下', '自由精神', '真实纯粹', '审美独到'] },
  'ESTP': { name: '企业家', desc: '行动派，先做再说。你在混乱中如鱼得水，应激反应出奇地好。不喜欢理论，喜欢把手放进去感受到实物。', traits: ['行动迅速', '魅力十足', '观察力强', '适应性强', '直接实际', '享受挑战'] },
  'ESFP': { name: '表演者', desc: '生活对你来说是个舞台，而你从来不会浪费它。笑声、美食、朋友——你把当下发挥到极致。快乐是你的使命感。', traits: ['热情开朗', '享受当下', '社交达人', '乐观感染', '自发随性', '充满活力'] },
};

export const DIM_NAMES: Record<DimPair, string> = {
  ei: 'E/I 能量取向',
  sn: 'S/N 感知方式',
  tf: 'T/F 决策风格',
  jp: 'J/P 生活秩序',
};

export const DIM_COLORS: Record<DimPair, string> = {
  ei: '#38bdf8',
  sn: '#a78bfa',
  tf: '#2dd4bf',
  jp: '#f59e0b',
};

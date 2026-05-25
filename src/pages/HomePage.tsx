import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

/** Generate CSS-only starfield */
function useStarfield() {
  return useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => ({
      id: i,
      left: `${(i * 3.7) % 100}%`,
      top: `${(i * 5.3) % 100}%`,
      size: i % 3 === 0 ? 3 : i % 5 === 0 ? 2 : 1,
      opacity: 0.2 + (i % 5) * 0.16,
      delay: `${(i * 0.37) % 5}s`,
      duration: `${2 + (i % 4)}s`,
    }));
  }, []);
}

const TYPE_LETTERS = [
  ['I','N','T','J'], ['I','N','T','P'], ['E','N','T','J'], ['E','N','T','P'],
  ['I','N','F','J'], ['I','N','F','P'], ['E','N','F','J'], ['E','N','F','P'],
  ['I','S','T','J'], ['I','S','F','J'], ['E','S','T','J'], ['E','S','F','J'],
  ['I','S','T','P'], ['I','S','F','P'], ['E','S','T','P'], ['E','S','F','P'],
];

const FEATURES = [
  { icon: '◆', title: '场景化题目', desc: '120道真实生活场景，选项自然映射多维度' },
  { icon: '◇', title: '交叉计分系统', desc: '每道题的选项同时在多个维度上计分，更真实' },
  { icon: '●', title: '深度分析报告', desc: '16型独立分析模板，960段个性化解读' },
  { icon: '○', title: '内在宇宙隐喻', desc: '你的性格不是标签，而是一个独立运行的宇宙' },
];

const SLOT_COLORS = [
  'var(--pop-cyan)', 'var(--pop-cyan)', 'var(--pop-cyan)', 'var(--pop-cyan)',
  'var(--pop-magenta)', 'var(--pop-magenta)', 'var(--pop-magenta)', 'var(--pop-magenta)',
  'var(--pop-teal)', 'var(--pop-teal)', 'var(--pop-teal)', 'var(--pop-teal)',
  'var(--pop-yellow)', 'var(--pop-yellow)', 'var(--pop-yellow)', 'var(--pop-yellow)',
];

export default function HomePage() {
  const navigate = useNavigate();
  const stars = useStarfield();

  const handleStart = useCallback(() => navigate('/test'), [navigate]);
  const handleShortStart = useCallback(() => navigate('/test-short'), [navigate]);

  return (
    <div className={styles.home}>
      {/* CSS Starfield */}
      <div className={styles.starfield} aria-hidden="true">
        {stars.map(s => (
          <span
            key={s.id}
            className={styles.star}
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              '--dur': s.duration,
              '--delay': s.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Game Grid Layout */}
      <div className={styles.gridContainer}>

        {/* Hero Block (full width) */}
        <div className={styles.heroBlock}>
          <h1 className={styles.heroTitle}>
            发现你的
            <span className={styles.heroTitleAccent}>人格原型</span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className={styles.heroSubtitle}>
          ◆ MBTI · 后现代人格测试 ◆
        </div>

        {/* 16-Type Grid: 4×4 */}
        {TYPE_LETTERS.map((letters, i) => (
          <div
            key={i}
            className={styles.typeSlot}
            style={{
              '--slot-color': SLOT_COLORS[i],
            } as React.CSSProperties}
            title={`${letters.join('')} 类型`}
          >
            <span
              className={styles.typeDot}
              style={{ background: SLOT_COLORS[i] }}
            />
            <span className={styles.typeCode}>{letters.join('')}</span>
          </div>
        ))}

        {/* CTA Block */}
        <div className={styles.ctaBlock}>
          <button
            className={styles.startBtn}
            onClick={handleStart}
            aria-label="开始120题测试"
          >
            ▲ 开始测试
          </button>
          <p className={styles.startHint}>120题 · 沉浸场景 · 深度计分</p>
        </div>

        {/* Feature Blocks: 2×2 */}
        {FEATURES.map(f => (
          <div key={f.title} className={styles.featBlock}>
            <div className={styles.featIcon}>{f.icon}</div>
            <div className={styles.featTitle}>{f.title}</div>
            <div className={styles.featDesc}>{f.desc}</div>
          </div>
        ))}

        {/* Short Test */}
        <div className={styles.shortBlock}>
          <button
            className={styles.shortBtn}
            onClick={handleShortStart}
            aria-label="40题快速版"
          >
            ⚡ 40题快速版
          </button>
        </div>

        {/* Footer */}
        <div className={styles.footerBlock}>
          <div className={styles.footerText}>
            数据仅存储于本地浏览器 · 无追踪 · 无上传
          </div>
        </div>

      </div>
    </div>
  );
}

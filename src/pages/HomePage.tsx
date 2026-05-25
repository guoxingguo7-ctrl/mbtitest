import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

/** Generate CSS-only starfield */
function useStarfield() {
  return useMemo(() => {
    return Array.from({ length: 160 }, (_, i) => ({
      id: i,
      left: `${(i * 3.7) % 100}%`,
      top: `${(i * 5.3) % 100}%`,
      size: i % 3 === 0 ? 2 : i % 5 === 0 ? 1.5 : 1,
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

      {/* Content */}
      <div className={styles.content}>
        {/* Subtitle */}
        <div className={styles.heroSubtitle}>
          <span>✦</span>
          <span>MBTI · 内在宇宙探索</span>
          <span>✦</span>
        </div>

        {/* Hero Title */}
        <h1 className={styles.heroTitle}>
          发现你内在的
          <br />
          <span className={styles.heroTitleGradient}>宇宙</span>
        </h1>

        <p className={styles.heroDesc}>
          120道沉浸式场景题，四个维度交叉计分，深度解读你的性格星系
        </p>

        {/* Type Constellation */}
        <div className={styles.constellation}>
          {TYPE_LETTERS.map((letters, i) => {
            const color = i < 4
              ? 'var(--color-ei)'
              : i < 8
              ? 'var(--color-sn)'
              : i < 12
              ? 'var(--color-tf)'
              : 'var(--color-jp)';
            return (
              <div
                key={i}
                className={styles.typeNode}
                style={{ '--color': color } as React.CSSProperties}
                title={`${letters.join('')} 类型`}
              >
                <span className={styles.typeDot} />
                <span className={styles.typeCode}>{letters.join('')}</span>
              </div>
            );
          })}
        </div>

        {/* Start Ring CTA */}
        <div className={styles.startRing}>
          <div className={styles.startRingOuter} aria-hidden="true" />
          <div className={styles.startRingInner} aria-hidden="true" />
          <button
            className={styles.startBtn}
            onClick={handleStart}
            aria-label="开始测试"
          >
            ▲
          </button>
        </div>

        <p className={styles.startHint}>点击圆环，开启你的宇宙之旅</p>

        {/* Short Test Quick Entry */}
        <button
          onClick={handleShortStart}
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '8px 24px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-jp)',
            background: 'var(--color-jp-dim)',
            color: 'var(--color-jp)',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s var(--ease-out)',
            letterSpacing: '0.03em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--color-jp)';
            e.currentTarget.style.boxShadow = 'var(--glow-jp)';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'none';
          }}
        >
          ⚡ 40题快速版
        </button>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          maxWidth: 680,
          margin: '3rem auto 0',
          width: '100%',
        }}>
          {[
            { icon: '◇', title: '场景化题目', desc: '120道真实生活场景，选项自然映射多维度' },
            { icon: '◆', title: '交叉计分系统', desc: '每道题的选项同时在多个维度上计分，更真实' },
            { icon: '○', title: '深度分析报告', desc: '16型独立分析模板，960段个性化解读' },
            { icon: '◎', title: '内在宇宙隐喻', desc: '你的性格不是标签，而是一个独立运行的宇宙' },
          ].map(f => (
            <div
              key={f.title}
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)',
                textAlign: 'left',
                cursor: 'default',
                transition: 'all 0.3s var(--ease-out)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--glass-border-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--color-ei)' }}>{f.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{f.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerText}>
            数据仅存储于本地浏览器 · 无追踪 · 无上传
          </div>
        </div>
      </div>
    </div>
  );
}

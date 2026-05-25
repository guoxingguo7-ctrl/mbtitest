import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizProvider, useQuiz } from '../context/QuizContext';
import ThreeScene from '../components/test/ThreeScene';
import QuestionCard from '../components/test/QuestionCard';
import ProgressHeader from '../components/test/ProgressHeader';
import SubmitBar from '../components/test/SubmitBar';
import ResultHero from '../components/result/ResultHero';
import DimBars from '../components/result/DimBars';
import TraitsCloud from '../components/result/TraitsCloud';
import SharePanel from '../components/result/SharePanel';
import SimilarTypes from '../components/result/SimilarTypes';
import { getAnalysis } from '../engine/analysis';
import { getAnalysisSync } from '../engine/analysis';
import { QUESTIONS as FULL_QUESTIONS } from '../data/questions';
import type { DimPair } from '../data/types';
import styles from './TestPage.module.css';

const BLOCK_SIZE = 30;

function TestPageInner() {
  const { state, selectAnswer, submit, reset, questions } = useQuiz();
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);
  const [analyses, setAnalyses] = useState<Record<string, string>>({});
  const [shareOpen, setShareOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const PARTS = [
    { key: 'ei', label: 'E / I', color: 'var(--color-ei)', dim: 'ei' as DimPair },
    { key: 'sn', label: 'S / N', color: 'var(--color-sn)', dim: 'sn' as DimPair },
    { key: 'tf', label: 'T / F', color: 'var(--color-tf)', dim: 'tf' as DimPair },
    { key: 'jp', label: 'J / P', color: 'var(--color-jp)', dim: 'jp' as DimPair },
  ];

  const handleSubmit = useCallback(async () => {
    const result = submit();
    if (!result) return;
    setShowResult(true);

    const newAnalyses: Record<string, string> = {};
    for (const dim of ['ei', 'sn', 'tf', 'jp'] as DimPair[]) {
      try {
        newAnalyses[dim] = await getAnalysis(result.type, dim, result.dims[dim].pct);
      } catch {
        newAnalyses[dim] = getAnalysisSync(result.type, dim, result.dims[dim].pct);
      }
    }
    setAnalyses(newAnalyses);

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [submit]);

  const handleReset = useCallback(() => {
    reset();
    setShowResult(false);
    setAnalyses({});
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reset]);

  const handleShare = useCallback(() => setShareOpen(true), []);
  const handleCloseShare = useCallback(() => setShareOpen(false), []);

  // Auto-scroll to next question after selection
  const handleSelect = useCallback((qId: number, _oIdx: number) => {
    selectAnswer(qId, _oIdx);
    // Scroll to next question after a brief delay
    setTimeout(() => {
      const next = document.getElementById(`q-card-${qId + 1}`);
      if (next) {
        next.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }, [selectAnswer]);

  useEffect(() => {
    const onScroll = () => {
      const bt = document.getElementById('back-top');
      if (!bt) return;
      if (window.scrollY > 400) {
        bt.classList.add(styles.visible);
      } else {
        bt.classList.remove(styles.visible);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // scroll to top on result show
  useEffect(() => {
    if (showResult && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [showResult]);

  const { answers, result: scoreResult } = state;
  const progress = state.answers ? Object.keys(state.answers).length : 0;
  const total = questions.length;

  return (
    <div className={styles.testPage}>
      {/* Three.js Background */}
      <div className={styles.canvasWrap}>
        <ThreeScene />
      </div>

      {/* Content */}
      <div className={styles.contentLayer} ref={contentRef}>
        {/* Back Button */}
        <button
          className={styles.backBtn}
          onClick={() => navigate('/')}
          aria-label="返回首页"
          title="返回首页"
        >
          <span className={styles.backArrow}>←</span>
          返回
        </button>

        {!showResult ? (
          <>
            {/* Part Navigation */}
            <nav className={styles.partNav} aria-label="题目分区导航">
              {PARTS.map((p, i) => {
                const isActive = progress >= i * BLOCK_SIZE;
                const isDone = progress >= (i + 1) * BLOCK_SIZE;
                return (
                  <div
                    key={p.key}
                    className={`${styles.partNode} ${isActive ? styles.active : ''}`}
                    style={{ '--part-color': p.color } as React.CSSProperties}
                    title={p.label}
                  >
                    <div
                      className={styles.partDot}
                      style={{
                        background: isDone ? p.color : 'transparent',
                        borderColor: isActive ? p.color : 'var(--glass-border)',
                      } as React.CSSProperties}
                    />
                    <span className={styles.partLabel}>{p.label}</span>
                  </div>
                );
              })}
            </nav>

            {/* Header + Progress */}
            <ProgressHeader progress={progress} total={total} />

            {/* Questions */}
            {['第一部分：社交与能量 (E/I)', '第二部分：信息处理 (S/N)',
              '第三部分：决策风格 (T/F)', '第四部分：生活秩序 (J/P)'].map((title, si) => {
              const start = si * BLOCK_SIZE + 1;
              const end = (si + 1) * BLOCK_SIZE;
              return (
                <section key={si}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>{title}</h2>
                    <div className={styles.sectionDivider} />
                  </div>
                  {questions.filter(q => q.id >= start && q.id <= end).map(q => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      selectedIndex={answers[q.id]}
                      onSelect={(oIdx) => handleSelect(q.id, oIdx)}
                    />
                  ))}
                </section>
              );
            })}

            {/* Submit Bar */}
            <SubmitBar
              progress={progress}
              total={total}
              onSubmit={handleSubmit}
            />
          </>
        ) : (
          <>
            {/* Result Page */}
            <div ref={resultRef}>
              {scoreResult && (
                <ResultHero result={scoreResult} />
              )}
            </div>

            {/* Score Table */}
            {scoreResult && (
              <div className={styles.resultPage}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>原始分数</h2>
                <table className={styles.scoreTable}>
                  <thead>
                    <tr>
                      <th>维度</th>
                      <th>倾向 A</th>
                      <th>倾向 B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'E / I', a: 'E 外向', b: 'I 内向', sA: scoreResult.sums.E, sB: scoreResult.sums.I },
                      { label: 'S / N', a: 'S 实感', b: 'N 直觉', sA: scoreResult.sums.S, sB: scoreResult.sums.N },
                      { label: 'T / F', a: 'T 思考', b: 'F 情感', sA: scoreResult.sums.T, sB: scoreResult.sums.F },
                      { label: 'J / P', a: 'J 判断', b: 'P 感知', sA: scoreResult.sums.J, sB: scoreResult.sums.P },
                    ].map(row => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td className={row.sA >= row.sB ? styles.winner : ''}>{row.a}: {row.sA}</td>
                        <td className={row.sB > row.sA ? styles.winner : ''}>{row.b}: {row.sB}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Dim Bars */}
            {scoreResult && <DimBars dims={scoreResult.dims} />}

            {/* Traits */}
            {scoreResult && <TraitsCloud type={scoreResult.type} />}

            {/* Similar Types */}
            {scoreResult && <SimilarTypes result={scoreResult} />}

            {/* Analysis */}
            <div className={styles.analysisPanel}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>深度分析</h2>
              {['ei', 'sn', 'tf', 'jp'].map(dim => (
                <div key={dim} className={styles.analysisItem}>
                  <div
                    className={styles.analysisHeader}
                    onClick={e => {
                      const item = (e.currentTarget as HTMLElement).closest('.' + styles.analysisItem);
                      item?.classList.toggle(styles.open);
                    }}
                  >
                    <span className={styles.analysisTitle}>
                      {dim === 'ei' ? 'E/I 能量取向' : dim === 'sn' ? 'S/N 感知方式' : dim === 'tf' ? 'T/F 决策风格' : 'J/P 生活秩序'}
                    </span>
                    <span className={styles.analysisArrow}>▼</span>
                  </div>
                  <div className={styles.analysisBody}>
                    <p>{analyses[dim] || '分析中...'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Row */}
            <div className={styles.actionRow}>
              <button className={styles.actionBtn} onClick={handleReset}>重新测试</button>
              <button className={styles.actionBtn} onClick={handleShare}>分享结果</button>
            </div>

            {/* Share Modal */}
            {shareOpen && scoreResult && (
              <SharePanel
                result={scoreResult}
                onClose={handleCloseShare}
              />
            )}
          </>
        )}
      </div>

      {/* Back to Top */}
      <button
        id="back-top"
        className={styles.backTop}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="回到顶部"
      >↑</button>
    </div>
  );
}

export default function TestPage() {
  return (
    <QuizProvider questions={FULL_QUESTIONS}>
      <TestPageInner />
    </QuizProvider>
  );
}

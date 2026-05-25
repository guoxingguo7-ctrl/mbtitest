import { useCallback, useRef } from 'react';
import type { Question, QuestionOption } from '../../data/types';
import styles from './QuestionCard.module.css';

interface Props {
  question: Question;
  selectedIndex?: number;
  onSelect: (optionIndex: number) => void;
}

export default function QuestionCard({ question, selectedIndex, onSelect }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  /** 创建波纹效果 */
  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = styles.ripple;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }, [styles.ripple]);

  const labels = ['A', 'B', 'C', 'D'] as const;

  return (
    <div className={styles.card} id={`q-card-${question.id}`} ref={cardRef}>
      {/* 序号 */}
      <span className={styles.num}>Q{question.id}</span>

      {/* 问题文本 */}
      <p className={styles.scenario}>{question.scenario}</p>

      {/* 选项列表 */}
      <div className={styles.options}>
        {question.options.map((opt: QuestionOption, idx: number) => (
          <button
            key={idx}
            className={`${styles.optionBtn} ${selectedIndex === idx ? styles.selected : ''}`}
            onClick={(e) => {
              createRipple(e);
              onSelect(idx);
            }}
          >
            <span className={styles.optLabel}>{labels[idx]}</span>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

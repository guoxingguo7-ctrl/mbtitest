import styles from './ProgressHeader.module.css';

interface Props {
  progress: number;
  total: number;
}

export default function ProgressHeader({ progress, total }: Props) {
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <div className={styles.header}>
      <div className={styles.stats}>
        <span>
          进度 <span className={styles.counter}>{progress}</span> / {total} 题
          （<span className={styles.counter}>{pct}</span>%）
        </span>
        <span className={styles.hint}>
          {progress < total ? '请回答所有题目后提交' : '✓ 所有题目已回答'}
        </span>
      </div>
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

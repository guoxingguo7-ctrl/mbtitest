import styles from './SubmitBar.module.css';

interface Props {
  progress: number;
  total: number;
  onSubmit: () => void;
}

export default function SubmitBar({ progress, total, onSubmit }: Props) {
  const allAnswered = progress >= total;

  return (
    <div className={styles.bar}>
      <button
        className={styles.submitBtn}
        disabled={!allAnswered}
        onClick={onSubmit}
      >
        {allAnswered ? '✨ 查看结果' : '请先完成所有题目'}
      </button>
      {!allAnswered && (
        <span className={styles.remaining}>
          还剩 {total - progress} 题未答
        </span>
      )}
    </div>
  );
}

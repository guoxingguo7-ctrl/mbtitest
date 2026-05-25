import { useMemo } from 'react';
import type { DimPair, DimResult } from '../../data/types';
import { DIM_COLORS } from '../../data/types';
import styles from './DimBars.module.css';

interface Props {
  dims: Record<DimPair, DimResult>;
}

const DIM_ORDER: DimPair[] = ['ei', 'sn', 'tf', 'jp'];

const DIM_LABELS: Record<DimPair, { left: string; right: string }> = {
  ei: { left: 'E 外向', right: 'I 内向' },
  sn: { left: 'S 实感', right: 'N 直觉' },
  tf: { left: 'T 思考', right: 'F 情感' },
  jp: { left: 'J 判断', right: 'P 感知' },
};

export default function DimBars({ dims }: Props) {
  const rows = useMemo(() => {
    return DIM_ORDER.map(dim => {
      const r = dims[dim];
      const pct = r.pct; // first pole percentage
      return { dim, pct };
    });
  }, [dims]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>维度得分</h2>
      <div className={styles.barList}>
        {rows.map(({ dim, pct }) => {
          const color = DIM_COLORS[dim];
          const labels = DIM_LABELS[dim];
          const leftPct = pct;
          const rightPct = 100 - pct;

          return (
            <div key={dim} className={styles.row}>
              <div className={styles.labels}>
                <span className={styles.pctLeft} style={{ color }}>{labels.left} {leftPct}%</span>
                <span className={styles.pctRight}>{labels.right} {rightPct}%</span>
              </div>
              <div className={styles.track}>
                <div className={styles.midDot} />
                <div
                  className={styles.fillLeft}
                  style={{
                    width: `${leftPct}%`,
                    background: color,
                    opacity: 0.85,
                  } as React.CSSProperties}
                />
                <div
                  className={styles.fillRight}
                  style={{
                    width: `${rightPct}%`,
                    background: color,
                    opacity: 0.3,
                  } as React.CSSProperties}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

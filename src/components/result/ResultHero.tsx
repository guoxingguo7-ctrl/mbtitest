import { useMemo } from 'react';
import type { ScoreResult } from '../../data/types';
import { TYPE_DATA, DIM_COLORS } from '../../data/types';
import type { DimPair } from '../../data/types';
import styles from './ResultHero.module.css';

const DIM_LABELS: Record<DimPair, string> = {
  ei: 'E/I',
  sn: 'S/N',
  tf: 'T/F',
  jp: 'J/P',
};

export default function ResultHero({ result }: { result: ScoreResult }) {
  const meta = TYPE_DATA[result.type];

  const dimTags = useMemo(() => {
    return (['ei', 'sn', 'tf', 'jp'] as DimPair[]).map(dim => {
      const dimResult = result.dims[dim];
      const label = DIM_LABELS[dim];
      const win = dimResult.pole.toUpperCase() as string;
      return { dim, label, win };
    });
  }, [result.dims]);

  return (
    <div className={styles.hero}>
      {/* 发光环 */}
      <div className={styles.glowRing} />

      {/* 类型代码 */}
      <div className={styles.typeCode}>{result.type}</div>

      {/* 类型名称 */}
      <div className={styles.typeName}>{meta.name}</div>

      {/* 描述 */}
      <p className={styles.description}>{meta.desc}</p>

      {/* 维度标签 */}
      <div className={styles.dimTags}>
        {dimTags.map(({ dim, label, win }) => (
          <span
            key={dim}
            className={styles.dimTag}
            style={{
              borderColor: DIM_COLORS[dim],
              color: DIM_COLORS[dim],
            } as React.CSSProperties}
          >
            {label} · {win}
          </span>
        ))}
      </div>
    </div>
  );
}

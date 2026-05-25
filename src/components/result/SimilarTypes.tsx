import { useMemo } from 'react';
import type { ScoreResult } from '../../data/types';
import { TYPE_DATA, TYPE_GROUPS } from '../../data/types';
import { getSimilarTypes } from '../../engine/similarTypes';
import styles from './SimilarTypes.module.css';

interface Props {
  result: ScoreResult;
}

export default function SimilarTypes({ result }: Props) {
  const similar = useMemo(() => {
    return getSimilarTypes(result.type, result.dims);
  }, [result.type, result.dims]);

  if (similar.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>与你相似的人格类型</h2>
      <p className={styles.subtitle}>
        基于你的类型代码（{result.type}）和维度偏好，以下类型与你存在不同程度的相似性
      </p>

      <div className={styles.list}>
        {similar.map((item, idx) => {
          const meta = TYPE_DATA[item.type];
          const isSameGroup = TYPE_GROUPS[result.type] === TYPE_GROUPS[item.type];

          return (
            <div
              key={item.type}
              className={styles.card}
              style={{
                borderLeftColor: idx === 0 ? 'var(--color-ei)' : 'transparent',
              } as React.CSSProperties}
            >
              {/* 排名标识 */}
              <div className={styles.rank}>{idx + 1}</div>

              {/* 类型代码与名称 */}
              <div className={styles.header}>
                <span className={styles.typeCode}>{item.type}</span>
                <span className={styles.typeName}>{meta.name}</span>
                {isSameGroup && <span className={styles.groupBadge}>同群组</span>}
              </div>

              {/* 相似度分数 */}
              <div className={styles.scoreBar}>
                <div
                  className={styles.scoreFill}
                  style={{ width: `${Math.min(item.score, 100)}%` }}
                />
                <span className={styles.scoreText}>相似度 {item.score}分</span>
              </div>

              {/* 相似原因 */}
              <p className={styles.reason}>{item.reason}</p>

              {/* 类型简介 */}
              <p className={styles.desc}>{meta.desc}</p>
            </div>
          );
        })}
      </div>

      <p className={styles.footerNote}>
        * 相似度基于类型代码共享字母数量、同群组关系等综合计算，仅供参考。
      </p>
    </div>
  );
}

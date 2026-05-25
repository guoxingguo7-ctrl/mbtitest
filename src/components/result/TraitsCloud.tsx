import type { TypeCode } from '../../data/types';
import { TYPE_DATA } from '../../data/types';
import styles from './TraitsCloud.module.css';

interface Props {
  type: TypeCode;
}

export default function TraitsCloud({ type }: Props) {
  const meta = TYPE_DATA[type];
  const traits = meta?.traits ?? [];

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>你的特质</h2>
      <div className={styles.cloud}>
        {traits.map((t, i) => (
          <span key={i} className={styles.tag}>{t}</span>
        ))}
      </div>
    </div>
  );
}

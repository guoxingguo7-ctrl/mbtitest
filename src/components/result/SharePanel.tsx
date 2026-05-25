import { useCallback, useState, useEffect } from 'react';
import type { ScoreResult } from '../../data/types';
import { TYPE_DATA } from '../../data/types';
import styles from './SharePanel.module.css';

interface Props {
  result: ScoreResult;
  onClose: () => void;
}

export default function SharePanel({ result, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const meta = TYPE_DATA[result.type];

  // 复制到剪贴板
  const handleCopy = useCallback(async () => {
    const text = `🧠 MBTI 人格类型测试\n我的类型：${result.type} — ${meta.name}\n\n${meta.desc}\n\n你的类型是什么？来测测看！`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback 使用旧 API
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, meta]);

  // 点击 overlay 关闭
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  // ESC 键关闭
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // 防止背景滚动
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.panel}>
        {/* 关闭按钮 */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="关闭">
          ✕
        </button>

        {/* 类型 */}
        <div className={styles.typeCodeSmall}>{result.type}</div>
        <div className={styles.typeNameSmall}>{meta.name}</div>
        <p className={styles.descSmall}>{meta.desc}</p>

        {/* 动作 */}
        <div className={styles.actions}>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✓ 已复制' : '📋 复制结果'}
          </button>

          <div className={styles.secondaryActions}>
            <button
              className={styles.secondaryBtn}
              onClick={handleCopy}
            >
              复制链接
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => {
                handleCopy();
                onClose();
              }}
            >
              分享给好友
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

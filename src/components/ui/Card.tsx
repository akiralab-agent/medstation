import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  leftBorderColor?: string;
  padding?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  variant = 'elevated',
  leftBorderColor,
  padding = 'medium',
  className = '',
  onClick,
}: CardProps) {
  const classNames = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    onClick ? styles.clickable : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      onClick={onClick}
      style={leftBorderColor ? { borderLeftColor: leftBorderColor } : undefined}
    >
      {leftBorderColor && <div className={styles.leftBorder} style={{ backgroundColor: leftBorderColor }} />}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

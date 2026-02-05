import styles from './Badge.module.css';

interface BadgeProps {
  count: number;
  color?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export function Badge({ count, color = 'var(--color-primary-700)', position = 'top-right', className = '' }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={`${styles.badge} ${styles[position]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

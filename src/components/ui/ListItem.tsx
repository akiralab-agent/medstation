import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './ListItem.module.css';

interface ListItemProps {
  leftIcon?: ReactNode;
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  onClick?: () => void;
  divider?: boolean;
  rightContent?: ReactNode;
}

export function ListItem({
  leftIcon,
  title,
  subtitle,
  showChevron = true,
  onClick,
  divider = true,
  rightContent,
}: ListItemProps) {
  return (
    <div
      className={`${styles.listItem} ${onClick ? styles.clickable : ''} ${divider ? styles.divider : ''}`}
      onClick={onClick}
    >
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      {rightContent && <span className={styles.rightContent}>{rightContent}</span>}
      {showChevron && <ChevronRight size={20} className={styles.chevron} />}
    </div>
  );
}

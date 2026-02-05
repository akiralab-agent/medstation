import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, SlidersHorizontal } from 'lucide-react';
import styles from './Header.module.css';

type HeaderAction = 'search' | 'add' | 'filter';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightActions?: HeaderAction[];
  onActionClick?: (action: HeaderAction) => void;
  variant?: 'default' | 'primary' | 'transparent';
  children?: ReactNode;
}

const actionIcons = {
  search: Search,
  add: Plus,
  filter: SlidersHorizontal,
};

export function Header({
  title,
  showBackButton = false,
  rightActions = [],
  onActionClick,
  variant = 'default',
  children,
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={`${styles.header} ${styles[variant]}`}>
      <div className={styles.left}>
        {showBackButton && (
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
        )}
      </div>

      <h1 className={styles.title}>{title}</h1>

      <div className={styles.right}>
        {rightActions.map((action) => {
          const Icon = actionIcons[action];
          return (
            <button
              key={action}
              className={styles.actionButton}
              onClick={() => onActionClick?.(action)}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>

      {children}
    </header>
  );
}

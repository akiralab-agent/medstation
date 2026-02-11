import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './Header.module.css';

type HeaderAction = 'search' | 'add' | 'filter' | 'book';

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
  book: Plus,
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
  const { t } = useTranslation();
  const [animatingAction, setAnimatingAction] = useState<string | null>(null);
  const actionLabels: Partial<Record<HeaderAction, string>> = {
    book: t('appointments.bookAppointment'),
  };

  const handleActionClick = (action: HeaderAction) => {
    setAnimatingAction(action);
    setTimeout(() => {
      setAnimatingAction(null);
      onActionClick?.(action);
    }, 300);
  };

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
          const label = actionLabels[action];
          const isAnimating = animatingAction === action;
          return (
            <button
              key={action}
              className={`${styles.actionButton} ${label ? styles.actionButtonWithText : ''} ${isAnimating ? styles.pulseAnimation : ''}`}
              onClick={() => handleActionClick(action)}
            >
              <Icon size={20} />
              {label && <span className={styles.actionLabel}>{label}</span>}
            </button>
          );
        })}
      </div>

      {children}
    </header>
  );
}

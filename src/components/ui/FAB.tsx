import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './FAB.module.css';

interface FABAction {
  icon: ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

interface FABProps {
  actions: FABAction[];
  mainColor?: string;
}

export function FAB({ actions, mainColor = 'var(--color-success)' }: FABProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.fabContainer}>
      {expanded && (
        <div className={styles.actionsContainer}>
          {actions.map((action, index) => (
            <button
              key={index}
              className={styles.actionButton}
              style={{ backgroundColor: action.color }}
              onClick={() => {
                action.onClick();
                setExpanded(false);
              }}
            >
              <span className={styles.actionIcon}>{action.icon}</span>
              <span className={styles.actionLabel}>{action.label}</span>
            </button>
          ))}
        </div>
      )}
      <button
        className={styles.mainButton}
        style={{ backgroundColor: mainColor }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
    </div>
  );
}

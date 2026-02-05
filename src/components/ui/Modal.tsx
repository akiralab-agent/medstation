import type { ReactNode } from 'react';
import { X, Check, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { Button } from './Button';
import styles from './Modal.module.css';

interface ModalAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'text';
}

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  type?: 'success' | 'warning' | 'error' | 'confirm' | 'info';
  title: string;
  message?: string;
  children?: ReactNode;
  primaryAction?: ModalAction;
  secondaryAction?: ModalAction;
  showCloseButton?: boolean;
}

const iconMap = {
  success: Check,
  warning: AlertTriangle,
  error: XCircle,
  confirm: HelpCircle,
  info: HelpCircle,
};

const iconColorMap = {
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-primary-700)',
  confirm: 'var(--color-primary-700)',
  info: 'var(--color-neutral-500)',
};

export function Modal({
  visible,
  onClose,
  type = 'info',
  title,
  message,
  children,
  primaryAction,
  secondaryAction,
  showCloseButton = true,
}: ModalProps) {
  if (!visible) return null;

  const Icon = iconMap[type];
  const iconColor = iconColorMap[type];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {showCloseButton && (
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        )}

        <div className={styles.iconWrapper} style={{ backgroundColor: `${iconColor}20` }}>
          <Icon size={32} color={iconColor} />
        </div>

        <h2 className={styles.title}>{title}</h2>

        {message && <p className={styles.message}>{message}</p>}

        {children && <div className={styles.content}>{children}</div>}

        <div className={styles.actions}>
          {primaryAction && (
            <Button
              variant={primaryAction.variant || 'success'}
              onClick={primaryAction.onClick}
              fullWidth
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'text'}
              onClick={secondaryAction.onClick}
              fullWidth
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

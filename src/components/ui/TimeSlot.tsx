import styles from './TimeSlot.module.css';

interface TimeSlotProps {
  time: string;
  selected?: boolean;
  available?: boolean;
  onClick?: () => void;
}

export function TimeSlot({ time, selected = false, available = true, onClick }: TimeSlotProps) {
  return (
    <button
      className={`${styles.timeSlot} ${selected ? styles.selected : ''} ${!available ? styles.unavailable : ''}`}
      onClick={onClick}
      disabled={!available}
    >
      {time}
    </button>
  );
}

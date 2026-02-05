import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Header, TimeSlot, Modal } from '../../components/ui';
import styles from './Schedule.module.css';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  services: string;
  address: string;
  distance: string;
  timeSlots: string[];
  favorited: boolean;
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    services: 'Consultation, ECG, Stress Test',
    address: '123 Medical Center Dr, Miami Beach, FL',
    distance: '2.5 Km',
    timeSlots: ['11:30 AM', '1:00 PM', '3:30 PM', '4:30 PM'],
    favorited: false,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'General Practice',
    services: 'General Consultation, Check-up',
    address: '456 Health Ave, Miami, FL',
    distance: '4.2 Km',
    timeSlots: ['9:00 AM', '10:30 AM', '2:00 PM'],
    favorited: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Dermatology',
    services: 'Skin Consultation, Procedures',
    address: '789 Wellness Blvd, Coral Gables, FL',
    distance: '6.8 Km',
    timeSlots: [],
    favorited: false,
  },
];

export function ChooseSchedule() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 4));
  const [selectedSlot, setSelectedSlot] = useState<{ doctorId: string; time: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [dateAnimation, setDateAnimation] = useState<'slide-left' | 'slide-right' | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const changeDate = (days: number) => {
    setDateAnimation(days > 0 ? 'slide-left' : 'slide-right');
    setTimeout(() => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + days);
      setCurrentDate(newDate);
      setDateAnimation(null);
    }, 200);
  };

  const toggleFavorite = (doctorId: string) => {
    setDoctors(doctors.map((d) =>
      d.id === doctorId ? { ...d, favorited: !d.favorited } : d
    ));
  };

  const handleTimeSelect = (doctorId: string, time: string) => {
    setSelectedSlot({ doctorId, time });
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    navigate('/schedule/service-type', { state: { slot: selectedSlot } });
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedSlot?.doctorId);

  return (
    <div className={styles.container}>
      <Header title="Choose Your Schedule" showBackButton variant="primary" />

      <div className={styles.dateNav}>
        <button className={styles.dateNavButton} onClick={() => changeDate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <span className={`${styles.dateText} ${dateAnimation ? styles[dateAnimation] : ''}`}>
          {formatDate(currentDate)}
        </span>
        <button className={styles.dateNavButton} onClick={() => changeDate(1)}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className={`${styles.doctorList} ${dateAnimation ? styles.animateList : ''}`}>
        {doctors.map((doctor) => (
          <div key={doctor.id} className={styles.doctorCard}>
            <div className={styles.doctorHeader}>
              <h3 className={styles.doctorName}>{doctor.name}</h3>
              <button
                className={`${styles.favoriteButton} ${doctor.favorited ? styles.favorited : ''}`}
                onClick={() => toggleFavorite(doctor.id)}
              >
                <Heart size={20} fill={doctor.favorited ? 'currentColor' : 'none'} />
              </button>
            </div>
            <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
            <p className={styles.doctorServices}>{doctor.services}</p>
            <p className={styles.doctorAddress}>{doctor.address}</p>
            <p className={styles.doctorDistance}>{doctor.distance}</p>

            {doctor.timeSlots.length > 0 ? (
              <div className={styles.timeSlots}>
                {doctor.timeSlots.map((time) => (
                  <TimeSlot
                    key={time}
                    time={time}
                    onClick={() => handleTimeSelect(doctor.id, time)}
                  />
                ))}
              </div>
            ) : (
              <p className={styles.noSlots}>
                There are no available appointments in the next 7 days.
              </p>
            )}
          </div>
        ))}
      </div>

      <Modal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        type="confirm"
        title="CONFIRM APPOINTMENT"
        message="Review your appointment details and proceed to the next step."
        primaryAction={{ label: 'CONFIRM AND CONTINUE', onClick: handleConfirm }}
        secondaryAction={{ label: 'CANCEL', onClick: () => setShowConfirmModal(false) }}
      >
        <div style={{ textAlign: 'left', marginTop: '16px' }}>
          <p style={{ color: 'var(--color-neutral-600)', fontSize: '14px' }}>
            {selectedDoctor?.address}
          </p>
          <p style={{ color: 'var(--color-neutral-600)', fontSize: '14px' }}>
            Office Hour
          </p>
          <p style={{ color: 'var(--color-neutral-900)', fontSize: '18px', fontWeight: 600 }}>
            {selectedSlot?.time}
          </p>
        </div>
      </Modal>
    </div>
  );
}

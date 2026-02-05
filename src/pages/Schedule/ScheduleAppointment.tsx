import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Plus } from 'lucide-react';
import { Header, Tabs, Button, Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Schedule.module.css';

const tabs = [
  { id: 'inperson', label: 'In-person' },
  { id: 'telemedicine', label: 'Telemedicine' },
];

export function ScheduleAppointment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inperson');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    navigate('/schedule/choose', {
      state: { type: activeTab, specialty, location },
    });
  };

  return (
    <div className={styles.container}>
      <Header title="Schedule Appointment" showBackButton variant="primary" />

      <div className={styles.patientSelector}>
        <div className={styles.patientInfo}>
          <div className={styles.avatar}>
            {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'U'}
          </div>
          <div className={styles.patientDetails}>
            <span className={styles.patientLabel}>Patient</span>
            <span className={styles.patientName}>{user?.name || 'Select patient'}</span>
          </div>
        </div>
        <button className={styles.addButton}>
          <Plus size={20} />
        </button>
      </div>

      <div className={styles.content}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>What are you looking for?</label>
            <div className={styles.selectWrapper}>
              <Search size={20} className={styles.selectIcon} />
              <select
                className={styles.select}
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="">Select a specialty</option>
                <option value="cardiology">Cardiology</option>
                <option value="dermatology">Dermatology</option>
                <option value="general">General Practice</option>
                <option value="neurology">Neurology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <div className={styles.inputWrapper}>
              <MapPin size={20} className={styles.inputIcon} />
              <Input
                placeholder="Near me"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <Button
            variant="success"
            fullWidth
            onClick={handleSearch}
            disabled={!specialty}
          >
            SEARCH SCHEDULES
          </Button>
        </div>
      </div>
    </div>
  );
}

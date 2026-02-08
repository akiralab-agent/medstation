import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Plus } from 'lucide-react';
import { Header, Tabs, Button, Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { fetchLocations, type LocationItem } from '../../services/locations';
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
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLocations = async () => {
      setIsLoadingLocations(true);
      setLocationsError(null);

      try {
        const locationsData = await fetchLocations();
        if (!isMounted) {
          return;
        }
        setLocations(locationsData);
      } catch {
        if (!isMounted) {
          return;
        }
        setLocations([]);
        setLocationsError('Unable to load locations. You can type the location manually.');
      } finally {
        if (isMounted) {
          setIsLoadingLocations(false);
        }
      }
    };

    void loadLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = () => {
    const selectedLocation = activeTab === 'telemedicine' ? '' : location;

    navigate('/schedule/choose', {
      state: { type: activeTab, specialty, location: selectedLocation },
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

          {activeTab !== 'telemedicine' && (
            <div className={styles.field}>
              <label className={styles.label}>Location</label>
              {locations.length > 0 || isLoadingLocations ? (
                <div className={styles.selectWrapper}>
                  <MapPin size={20} className={styles.selectIcon} />
                  <select
                    className={styles.select}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isLoadingLocations}
                  >
                    <option value="">
                      {isLoadingLocations ? 'Loading locations...' : 'Select a location'}
                    </option>
                    {locations.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className={styles.inputWrapper}>
                  <MapPin size={20} className={styles.inputIcon} />
                  <Input
                    placeholder="Type location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              )}
              {locationsError && <span className={styles.helperError}>{locationsError}</span>}
            </div>
          )}

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

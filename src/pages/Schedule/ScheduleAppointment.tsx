import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Plus } from 'lucide-react';
import { Header, Tabs, Button, Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { fetchLocations, type LocationItem } from '../../services/locations';
import styles from './Schedule.module.css';

export function ScheduleAppointment() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const telehealthLocationId = import.meta.env.VITE_TELEHEALTH_LOCATION_ID?.trim() ?? '';
  const normalizedTelehealthLocationId = telehealthLocationId.toLowerCase();
  const showSpecialtySelector = import.meta.env.VITE_SHOW_SPECIALTY_SELECTOR !== 'false';
  const [activeTab, setActiveTab] = useState('inperson');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationsError, setLocationsError] = useState<string | null>(null);
  const tabs = [
    { id: 'inperson', label: t('schedule.inPerson') },
    { id: 'telemedicine', label: t('schedule.telemedicine') },
  ];
  const specialtyOptions = [
    { value: 'cardiology', label: t('schedule.specialtyCardiology') },
    { value: 'dermatology', label: t('schedule.specialtyDermatology') },
    { value: 'general', label: t('schedule.specialtyGeneralPractice') },
    { value: 'neurology', label: t('schedule.specialtyNeurology') },
    { value: 'orthopedics', label: t('schedule.specialtyOrthopedics') },
    { value: 'pediatrics', label: t('schedule.specialtyPediatrics') },
  ];
  const inPersonLocations = locations.filter(
    (item) => item.id.trim().toLowerCase() !== normalizedTelehealthLocationId
  );

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
        setLocationsError(t('schedule.locationsLoadError'));
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
  }, [t]);

  useEffect(() => {
    if (activeTab !== 'inperson') {
      return;
    }

    if (!location) {
      return;
    }

    if (location.trim().toLowerCase() === normalizedTelehealthLocationId) {
      setLocation('');
    }
  }, [activeTab, location, normalizedTelehealthLocationId]);

  const handleSearch = () => {
    const telehealthLocationOption = locations.find(
      (item) => item.id.trim().toLowerCase() === normalizedTelehealthLocationId
    );
    const selectedLocationOption = inPersonLocations.find((item) => item.id === location);
    const selectedLocationId = activeTab === 'telemedicine'
      ? telehealthLocationId
      : (selectedLocationOption?.id ?? '');
    const selectedLocationName = activeTab === 'telemedicine'
      ? (telehealthLocationOption?.name ?? t('schedule.telemedicine'))
      : (selectedLocationOption?.name ?? location);

    navigate('/schedule/choose', {
      state: {
        type: activeTab,
        specialty,
        location: selectedLocationName,
        locationId: selectedLocationId,
      },
    });
  };

  return (
    <div className={styles.container}>
      <Header title={t('schedule.scheduleAppointment')} showBackButton variant="primary" />

      <div className={styles.patientSelector}>
        <div className={styles.patientInfo}>
          <div className={styles.avatar}>
            {user?.name?.split(' ').map((namePart) => namePart[0]).join('').slice(0, 2) || 'U'}
          </div>
          <div className={styles.patientDetails}>
            <span className={styles.patientLabel}>{t('appointments.patient')}</span>
            <span className={styles.patientName}>{user?.name || t('schedule.selectPatient')}</span>
          </div>
        </div>
        <button className={styles.addButton} aria-label={t('common.add')}>
          <Plus size={20} />
        </button>
      </div>

      <div className={styles.content}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <div className={styles.form}>
          {showSpecialtySelector && (
            <div className={styles.field}>
              <label className={styles.label}>{t('schedule.whatAreYouLookingFor')}</label>
              <div className={styles.selectWrapper}>
                <Search size={20} className={styles.selectIcon} />
                <select
                  className={styles.select}
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                >
                  <option value="">{t('schedule.selectSpecialty')}</option>
                  {specialtyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab !== 'telemedicine' && (
            <div className={styles.field}>
              <label className={styles.label}>{t('common.location')}</label>
              {locations.length > 0 || isLoadingLocations ? (
                <div className={styles.selectWrapper}>
                  <MapPin size={20} className={styles.selectIcon} />
                  <select
                    className={styles.select}
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    disabled={isLoadingLocations}
                  >
                    <option value="">
                      {isLoadingLocations ? t('schedule.loadingLocations') : t('schedule.selectLocation')}
                    </option>
                    {inPersonLocations.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className={styles.inputWrapper}>
                  <MapPin size={20} className={styles.inputIcon} />
                  <Input
                    placeholder={t('schedule.typeLocation')}
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
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
            disabled={showSpecialtySelector && !specialty}
          >
            {t('schedule.searchSchedules')}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Input, Button, Modal } from '../../components/ui';
import { CreditCard, Check } from 'lucide-react';
import { medcardApi } from '../../services/medcard';
import styles from './MedCard.module.css';

interface CardData {
  cardNumber: string;
  cardholder: string;
  email: string;
  phone: string;
  address: string;
  cardStatus: string;
  personStatus: string;
  subscription: string;
}

type NavigationState = Record<string, unknown>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const pickString = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return undefined;
};

const buildAddress = (source: Record<string, unknown>) => {
  const directAddress = pickString(source, ['address', 'fullAddress']);
  if (directAddress) {
    return directAddress;
  }

  const parts = [
    pickString(source, ['addressLine1', 'street']),
    pickString(source, ['city']),
    pickString(source, ['state']),
    pickString(source, ['zip', 'postalCode']),
    pickString(source, ['country']),
  ].filter((part): part is string => typeof part === 'string' && part.trim().length > 0);

  if (parts.length === 0) {
    return undefined;
  }

  return parts.join(', ');
};

const normalizeStatus = (value: string | undefined, fallback: string) =>
  value?.trim() ? value.toUpperCase() : fallback;

const mapCardPayload = (payload: unknown, fallbackCardNumber: string, activeLabel: string): CardData => {
  const root = isRecord(payload) ? payload : {};
  const data = isRecord(root.data) ? root.data : root;

  const card = isRecord(data.card) ? data.card : {};
  const person = isRecord(data.person) ? data.person : {};
  const user = isRecord(data.user) ? data.user : {};
  const subscription = isRecord(data.subscription) ? data.subscription : {};
  const status = isRecord(data.status) ? data.status : {};

  const firstName = pickString(person, ['firstName']);
  const lastName = pickString(person, ['lastName']);
  const fallbackName = [firstName, lastName].filter(Boolean).join(' ').trim();

  return {
    cardNumber: pickString(card, ['number', 'cardNumber']) || fallbackCardNumber,
    cardholder:
      pickString(person, ['fullName', 'name', 'personName']) ||
      pickString(user, ['fullName', 'name']) ||
      fallbackName ||
      '-',
    email: pickString(person, ['email']) || pickString(user, ['email']) || '-',
    phone:
      pickString(person, ['phone', 'cellPhone', 'mobile']) ||
      pickString(user, ['phone', 'cellPhone', 'mobile']) ||
      '-',
    address: buildAddress(person) || buildAddress(user) || '-',
    cardStatus: normalizeStatus(
      pickString(status, ['card', 'cardStatus', 'card_status']) ||
        pickString(card, ['status', 'cardStatus']),
      activeLabel
    ),
    personStatus: normalizeStatus(
      pickString(status, ['person', 'personStatus', 'person_status']) ||
        pickString(person, ['status', 'personStatus']),
      activeLabel
    ),
    subscription:
      pickString(subscription, ['name', 'title', 'subscriptionName', 'productName']) || '-',
  };
};

export function MedCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showExternalModal, setShowExternalModal] = useState(false);

  const handleFetch = async () => {
    const normalizedCardNumber = cardNumber.replace(/\D/g, '');
    if (normalizedCardNumber.length !== 16) {
      setErrorMessage(t('medcard.cardNotFoundMessage'));
      setShowError(true);
      return;
    }

    setLoading(true);
    setShowError(false);

    try {
      const response = await medcardApi.getCardDetails(normalizedCardNumber);
      const activeLabel = t('common.active').toUpperCase();
      setCardData(mapCardPayload(response, normalizedCardNumber, activeLabel));
    } catch (error) {
      setCardData(null);
      setErrorMessage(error instanceof Error ? error.message : t('medcard.cardNotFoundMessage'));
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const currentState: NavigationState = isRecord(location.state) ? location.state : {};
    navigate('/schedule/payment', {
      state: {
        ...currentState,
        serviceType: 'medcard',
        medcardPlanName: cardData?.subscription,
      },
    });
  };

  const handleHireMedCard = () => {
    setShowExternalModal(true);
  };

  return (
    <div className={styles.container}>
      <Header title="MedCard" showBackButton variant="primary" />

      <div className={styles.content}>
        {!cardData ? (
          <>
            <div className={styles.inputSection}>
              <label className={styles.label}>{t('medcard.cardNumber').toUpperCase()}</label>
              <Input
                placeholder={t('medcard.enterCardNumber')}
                value={cardNumber}
                onChange={(event) =>
                  setCardNumber(event.target.value.replace(/\D/g, '').slice(0, 16))
                }
                leftIcon={<CreditCard size={20} />}
                inputMode="numeric"
                maxLength={16}
              />
            </div>

            <div className={styles.buttons}>
              <Button
                variant="success"
                fullWidth
                onClick={handleFetch}
                disabled={cardNumber.length !== 16 || loading}
              >
                {loading ? t('common.loading') : t('medcard.fetchCard')}
              </Button>

              <Button variant="secondary" fullWidth onClick={handleHireMedCard}>
                {t('medcard.hireMedcard')}
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.cardFound}>
            <div className={styles.successHeader}>
              <span className={styles.successIcon}>
                <Check size={16} />
              </span>
              <span>{t('medcard.cardFound')}</span>
            </div>

            <div className={styles.cardDetails}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.cardNumber')}</span>
                <span className={styles.fieldValue}>{cardData.cardNumber}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.cardholder')}</span>
                <span className={styles.fieldValue}>{cardData.cardholder}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('common.email')}</span>
                <span className={styles.fieldValue}>{cardData.email}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('common.phone')}</span>
                <span className={styles.fieldValue}>{cardData.phone}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('common.address')}</span>
                <span className={styles.fieldValue}>{cardData.address}</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.cardStatus')}</span>
                <span className={`${styles.fieldValue} ${styles.status}`}>{cardData.cardStatus}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.personStatus')}</span>
                <span className={`${styles.fieldValue} ${styles.status}`}>{cardData.personStatus}</span>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>{t('medcard.subscription')}</span>
                <span className={styles.fieldValue}>{cardData.subscription}</span>
              </div>
            </div>

            <Button
              variant="outline"
              fullWidth
              onClick={handleContinue}
              className={styles.continueButton}
            >
              {t('medcard.continueToPayment')}
            </Button>
          </div>
        )}
      </div>

      <Modal
        visible={showError}
        onClose={() => setShowError(false)}
        type="error"
        title={t('medcard.cardNotFound')}
        message={errorMessage || t('medcard.cardNotFoundMessage')}
        primaryAction={{ label: t('medcard.tryAgain'), onClick: () => setShowError(false) }}
      />

      <Modal
        visible={showExternalModal}
        onClose={() => setShowExternalModal(false)}
        type="warning"
        title={t('common.attention')}
        message={t('medcard.externalSiteMessage')}
        primaryAction={{
          label: t('common.continue'),
          onClick: () => {
            setShowExternalModal(false);
          },
        }}
        secondaryAction={{ label: t('common.cancel'), onClick: () => setShowExternalModal(false) }}
      />
    </div>
  );
}

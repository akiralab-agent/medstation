import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Tabs } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { fetchLabOrdersByPerson, fetchLabResultsByPerson, type LabOrderItem, type LabResultItem } from '../../services/exams';
import styles from './Exams.module.css';

function pickPersonId(authPersonId?: string) {
  return authPersonId?.trim() || import.meta.env.VITE_PERSON_ID?.trim() || '';
}

export function ExamDetail() {
  const { id: orderId } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('report');
  const [results, setResults] = useState<LabResultItem[]>([]);
  const [order, setOrder] = useState<LabOrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'report', label: t('exams.reportTab') },
    { id: 'images', label: t('exams.imagesTab') },
    { id: 'historical', label: t('exams.historicalTab') },
  ];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(i18n.language, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });

  useEffect(() => {
    const personId = pickPersonId(user?.id);
    if (!personId || !orderId) {
      setError(t('exams.errorExamNotFound'));
      setLoading(false);
      return;
    }

    Promise.all([fetchLabResultsByPerson(personId), fetchLabOrdersByPerson(personId)])
      .then(([labResults, labOrders]) => {
        const orderResults = labResults
          .filter((item) => item.orderId === orderId)
          .sort((a, b) => (a.observationDateTime || '').localeCompare(b.observationDateTime || ''));
        const selectedOrder = labOrders.find((item) => item.id === orderId) ?? null;

        setResults(orderResults);
        setOrder(selectedOrder);
      })
      .catch(() => setError(t('exams.errorFailedToLoadExamDetails')))
      .finally(() => setLoading(false));
  }, [orderId, t, user?.id]);

  const reportItems = useMemo(() => {
    return results.map((result, index) => ({
      id: `${result.panelId}-${index}`,
      label: result.resultDescription || result.ngTestDescription || `${t('exams.fallbackResultName')} ${index + 1}`,
      value: result.observationValue ?? '-',
      unit: result.units ? ` ${result.units}` : '',
      reference: result.referenceRange || '-',
      abnormality: result.abnormality && result.abnormality !== 'None' ? result.abnormality : '',
      status: result.observationResultStatus || '-',
      date: result.observationDateTime ? formatDate(result.observationDateTime) : '-',
      time: result.observationDateTime ? formatTime(result.observationDateTime) : '-',
    }));
  }, [results, t]);

  const examName = order?.testDescription || results[0]?.testDescription || t('exams.fallbackLabExam');
  const examDateRaw = results.at(-1)?.observationDateTime || order?.orderDate;
  const examDate = examDateRaw ? formatDate(examDateRaw) : '-';
  const examStatus = order?.testStatus || results[0]?.orderStatus || '-';

  return (
    <div className={styles.container}>
      <Header title={examName} showBackButton variant="primary" />

      <div className={styles.examHeader}>
        <p className={styles.examInfo}>{examStatus} | {examDate}</p>
      </div>

      <div className={styles.tabsWrapper}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="dark" />
      </div>

      <div className={styles.tabContent}>
        {loading ? (
          <div className={styles.empty}>
            <p>{t('common.loading')}</p>
          </div>
        ) : error ? (
          <div className={styles.empty}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {activeTab === 'report' && (
              reportItems.length === 0 ? (
                <div className={styles.empty}>
                  <p>{t('exams.noResultsFound')}</p>
                </div>
              ) : (
                <div className={styles.reportContent}>
                  <div className={styles.reportList}>
                    {reportItems.map((item) => (
                      <div key={item.id} className={styles.reportResultCard}>
                        <div className={styles.reportResultTop}>
                          <span className={styles.reportResultName}>{item.label}</span>
                          {item.abnormality ? <span className={styles.historyBadge}>{item.abnormality}</span> : null}
                        </div>
                        <div className={styles.reportResultMetrics}>
                          <div className={styles.reportMetricBlock}>
                            <span className={styles.reportMetricLabel}>{t('exams.valueLabel')}</span>
                            <span className={styles.reportMetricValue}>{`${item.value}${item.unit}`}</span>
                          </div>
                          <div className={styles.reportMetricBlock}>
                            <span className={styles.reportMetricLabel}>{t('exams.referenceLabel')}</span>
                            <span className={styles.reportMetricValue}>{item.reference}</span>
                          </div>
                        </div>
                        <div className={styles.reportResultMeta}>
                          <span>{item.date}</span>
                          <span>{item.time}</span>
                          <span>{`${t('exams.statusLabel')}: ${item.status}`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {activeTab === 'images' && (
              <div className={styles.imagesContent}>
                <div className={styles.imagePlaceholder}>
                  <div className={styles.placeholderX}>
                    <div className={styles.line1} />
                    <div className={styles.line2} />
                  </div>
                  <p>{t('exams.noImagesAvailable')}</p>
                </div>
              </div>
            )}

            {activeTab === 'historical' && (
              <div className={styles.historicalContent}>
                {results.length === 0 ? (
                  <div className={styles.empty}>
                    <p>{t('exams.noResultsFound')}</p>
                  </div>
                ) : (
                  results.map((result, index) => {
                    const label = result.resultDescription || result.ngTestDescription || `${t('exams.fallbackResultName')} ${index + 1}`;
                    const value = result.observationValue ?? '-';
                    const unit = result.units ? ` ${result.units}` : '';
                    const reference = result.referenceRange || '-';
                    const date = result.observationDateTime ? formatDate(result.observationDateTime) : '-';
                    const time = result.observationDateTime ? formatTime(result.observationDateTime) : '-';
                    const abnormality = result.abnormality && result.abnormality !== 'None' ? result.abnormality : '';
                    return (
                      <div key={`${result.panelId}-${index}`} className={styles.historyItem}>
                        <div className={styles.historyTopRow}>
                          <span className={styles.historyLabel}>{label}</span>
                          {abnormality && (
                            <span className={styles.historyBadge}>{abnormality}</span>
                          )}
                        </div>
                        <div className={styles.historyMetrics}>
                          <div className={styles.historyMetricBlock}>
                            <span className={styles.historyMetricLabel}>{t('exams.valueLabel')}</span>
                            <span className={styles.historyMetricValue}>{`${value}${unit}`}</span>
                          </div>
                          <div className={styles.historyMetricBlock}>
                            <span className={styles.historyMetricLabel}>{t('exams.referenceLabel')}</span>
                            <span className={styles.historyMetricValue}>{reference}</span>
                          </div>
                        </div>
                        <div className={styles.historyBottomRow}>
                          <span className={styles.historyDate}>{date}</span>
                          <span className={styles.historyTime}>{time}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

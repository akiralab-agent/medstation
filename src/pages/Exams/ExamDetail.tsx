import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Header, Tabs } from '../../components/ui';
import styles from './Exams.module.css';

export function ExamDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('report');
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
  const exam = {
    id,
    name: t('exams.mock.completeBloodCount'),
    doctor: 'Dr. Sarah Johnson',
    date: formatDate('2026-01-05'),
    report: t('exams.reportBody'),
  };

  return (
    <div className={styles.container}>
      <Header title={exam.name} showBackButton variant="primary" />

      <div className={styles.examHeader}>
        <p className={styles.examInfo}>{exam.doctor} | {exam.date}</p>
      </div>

      <div className={styles.tabsWrapper}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="dark" />
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'report' && (
          <div className={styles.reportContent}>
            <pre className={styles.reportText}>{exam.report}</pre>
          </div>
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
            <div className={styles.historyItem}>
              <span className={styles.historyDate}>{formatDate('2026-01-05')}</span>
              <span className={styles.historyValue}>{t('exams.currentResult')}</span>
            </div>
            <div className={styles.historyItem}>
              <span className={styles.historyDate}>{formatDate('2025-07-15')}</span>
              <span className={styles.historyValue}>{t('exams.previousResult')}</span>
            </div>
            <div className={styles.historyItem}>
              <span className={styles.historyDate}>{formatDate('2025-01-10')}</span>
              <span className={styles.historyValue}>{t('exams.earlierResult')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

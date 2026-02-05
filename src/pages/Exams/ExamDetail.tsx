import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Tabs } from '../../components/ui';
import styles from './Exams.module.css';

const tabs = [
  { id: 'report', label: 'Report' },
  { id: 'images', label: 'Images' },
  { id: 'historical', label: 'Historical' },
];

export function ExamDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('report');

  // Mock data
  const exam = {
    id,
    name: 'Complete Blood Count',
    doctor: 'Dr. Sarah Johnson',
    date: 'Jan 05, 2026',
    report: `
COMPLETE BLOOD COUNT (CBC)

Patient: John Doe
Date of Collection: January 5, 2026
Lab: Miami Medical Laboratory

RESULTS:

White Blood Cells (WBC): 7.2 x10^9/L (Normal: 4.5-11.0)
Red Blood Cells (RBC): 4.8 x10^12/L (Normal: 4.5-5.5)
Hemoglobin (Hgb): 14.5 g/dL (Normal: 13.5-17.5)
Hematocrit (Hct): 42% (Normal: 38-50%)
Platelets: 250 x10^9/L (Normal: 150-400)

INTERPRETATION:
All values within normal range. No abnormalities detected.

RECOMMENDATIONS:
Continue routine monitoring as scheduled.

Electronically signed by:
Dr. Sarah Johnson, MD
License #: FL12345
    `.trim(),
  };

  return (
    <div className={styles.container}>
      <Header title={exam.name} showBackButton variant="primary" />

      <div className={styles.examHeader}>
        <p className={styles.examInfo}>{exam.doctor} • {exam.date}</p>
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
              <p>No images available</p>
            </div>
          </div>
        )}

        {activeTab === 'historical' && (
          <div className={styles.historicalContent}>
            <div className={styles.historyItem}>
              <span className={styles.historyDate}>Jan 05, 2026</span>
              <span className={styles.historyValue}>Current Result</span>
            </div>
            <div className={styles.historyItem}>
              <span className={styles.historyDate}>Jul 15, 2025</span>
              <span className={styles.historyValue}>Previous Result</span>
            </div>
            <div className={styles.historyItem}>
              <span className={styles.historyDate}>Jan 10, 2025</span>
              <span className={styles.historyValue}>Earlier Result</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

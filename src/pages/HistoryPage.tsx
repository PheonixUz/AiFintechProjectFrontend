import React from 'react';
import { Card } from '../components/ui/Card';
import { Clock } from 'lucide-react';
import styles from './HistoryPage.module.css';

export const HistoryPage: React.FC = () => {
  return (
    <div className={`animate-fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tarix</h1>
        <p className={styles.subtitle}>Avvalgi saqlangan hisob-kitoblarni qayta ko'rish.</p>
      </div>

      <Card className={styles.content}>
        <div className={styles.emptyState}>
          <Clock size={48} className={styles.emptyIcon} />
          <h3>Tarix bo'sh</h3>
          <p>Hozircha saqlangan market sizing tahlillari yo'q.</p>
        </div>
      </Card>
    </div>
  );
};

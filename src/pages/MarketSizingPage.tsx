import React from 'react';
import { MarketSizingForm } from '../features/market-sizing/MarketSizingForm';
import { MarketSizingResults } from '../features/market-sizing/MarketSizingResults';
import { MapContainer } from '../components/map/MapContainer';
import styles from './MarketSizingPage.module.css';

export const MarketSizingPage: React.FC = () => {
  return (
    <div className={`animate-fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Market Sizing (M-A1)</h1>
        <p className={styles.subtitle}>Bozor hajmini hisoblash va raqobatchilarni tahlil qilish</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <MarketSizingForm />
        </div>
        <div className={styles.mapArea}>
          <div className="glass-panel" style={{ height: '100%', padding: '8px' }}>
            <MapContainer />
          </div>
        </div>
      </div>
      
      <div className={styles.resultsArea}>
        <MarketSizingResults />
      </div>
    </div>
  );
};

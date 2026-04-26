import React, { useMemo } from 'react';
import { ChurnPredictionForm } from '../features/churn-prediction/ChurnPredictionForm';
import { ChurnPredictionResults } from '../features/churn-prediction/ChurnPredictionResults';
import { MapContainer } from '../components/map/MapContainer';
import { useChurnPredictionStore } from '../store/churnPredictionStore';
import styles from './ChurnPredictionPage.module.css';

export const ChurnPredictionPage: React.FC = () => {
  const lat = useChurnPredictionStore((s) => s.lat);
  const lon = useChurnPredictionStore((s) => s.lon);
  const radius_m = useChurnPredictionStore((s) => s.radius_m);
  const sendLoc = useChurnPredictionStore((s) => s.send_location);
  const setLocation = useChurnPredictionStore((s) => s.setLocation);

  const mapOverrides = useMemo(
    () =>
      sendLoc
        ? {
            lat,
            lon,
            radius_m,
            onLocationChange: setLocation,
          }
        : undefined,
    [sendLoc, lat, lon, radius_m, setLocation]
  );

  return (
    <div className={`animate-fade-in ${styles.page}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>Churn Prediction (M-E2)</h1>
        <p className={styles.subtitle}>
          SMB biznesining 6–36 oy ichida yopilish ehtimolini bashorat qilish va top risk omillarini aniqlash
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <ChurnPredictionForm />
        </div>
        <div className={styles.mapArea}>
          <div className="glass-panel" style={{ height: '100%', padding: '8px' }}>
            {sendLoc ? (
              <MapContainer overrides={mapOverrides} />
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  textAlign: 'center',
                  padding: 24,
                }}
              >
                Raqobat zonasini lokatsiya asosida hisoblash uchun formada «Lokatsiya»ni yoqing.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.resultsArea}>
        <ChurnPredictionResults />
      </div>
    </div>
  );
};

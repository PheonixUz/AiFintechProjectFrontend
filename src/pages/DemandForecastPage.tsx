import React, { useMemo } from 'react';
import { DemandForecastForm } from '../features/demand-forecast/DemandForecastForm';
import { DemandForecastResults } from '../features/demand-forecast/DemandForecastResults';
import { MapContainer } from '../components/map/MapContainer';
import { useDemandForecastStore } from '../store/demandForecastStore';
import styles from './DemandForecastPage.module.css';

export const DemandForecastPage: React.FC = () => {
  const lat = useDemandForecastStore((s) => s.lat);
  const lon = useDemandForecastStore((s) => s.lon);
  const radius_m = useDemandForecastStore((s) => s.radius_m);
  const sendLoc = useDemandForecastStore((s) => s.send_location_for_competitors);
  const setLocation = useDemandForecastStore((s) => s.setLocation);

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
        <h1 className={styles.title}>Demand Forecasting (M-B1)</h1>
        <p className={styles.subtitle}>
          MCC bo‘yicha kelgusi 12/24/36 oy uchun oyma-oy daromad prognozi va ishonch oralig‘i
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <DemandForecastForm />
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
                Raqobatchi zonasi uchun formada «xarita nuqtasini yuborish»ni yoqing.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.resultsArea}>
        <DemandForecastResults />
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { ViabilityCheckForm } from '../features/viability-check/ViabilityCheckForm';
import { ViabilityCheckResults } from '../features/viability-check/ViabilityCheckResults';
import { MapContainer } from '../components/map/MapContainer';
import { useViabilityCheckStore } from '../store/viabilityCheckStore';
import styles from './ViabilityCheckPage.module.css';

export const ViabilityCheckPage: React.FC = () => {
  const lat = useViabilityCheckStore((s) => s.lat);
  const lon = useViabilityCheckStore((s) => s.lon);
  const radius_m = useViabilityCheckStore((s) => s.radius_m);
  const sendLoc = useViabilityCheckStore((s) => s.send_location);
  const setLocation = useViabilityCheckStore((s) => s.setLocation);

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
        <h1 className={styles.title}>Financial Viability (M-D1)</h1>
        <p className={styles.subtitle}>
          Break-even, runway, 24 oy survival, cash-out risk va approve / review / reject tavsiyasi — Monte Carlo
          cashflow asosida
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <ViabilityCheckForm />
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
                Xarita uchun formada «Lokatsiya (lat/lon/radius)» ni yoqing.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.resultsArea}>
        <ViabilityCheckResults />
      </div>
    </div>
  );
};

import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { MapContainer } from '../components/map/MapContainer';
import { OrchestratorForm } from '../features/orchestrator/OrchestratorForm';
import { OrchestratorResults } from '../features/orchestrator/OrchestratorResults';
import { useOrchestratorStore } from '../store/orchestratorStore';
import styles from './OrchestratorPage.module.css';

export const OrchestratorPage: React.FC = () => {
  const lat = useOrchestratorStore((s) => s.lat);
  const lon = useOrchestratorStore((s) => s.lon);
  const radius_m = useOrchestratorStore((s) => s.radius_m);
  const setLocation = useOrchestratorStore((s) => s.setLocation);

  const mapOverrides = useMemo(
    () => ({ lat, lon, radius_m, onLocationChange: setLocation }),
    [lat, lon, radius_m, setLocation],
  );

  return (
    <div className={`animate-fade-in ${styles.page}`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>AI Orkestrator</h1>
          <Badge variant="info">
            <Sparkles size={12} style={{ marginRight: 6 }} /> 7 blok · 35 modul
          </Badge>
        </div>
        <p className={styles.subtitle}>
          Barcha 35 moduldan olingan signallarni birlashtiruvchi yagona tahlil — bitta input bilan
          umumiy skor, blok-bo'yicha natijalar, radar chart va AI tavsiyalar.
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <OrchestratorForm />
        </div>
        <div className={styles.mapArea}>
          <div className="glass-panel" style={{ height: '100%', padding: '8px' }}>
            <MapContainer overrides={mapOverrides} />
          </div>
        </div>
      </div>

      <div className={styles.resultsArea}>
        <OrchestratorResults />
      </div>
    </div>
  );
};

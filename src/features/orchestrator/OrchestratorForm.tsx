import React from 'react';
import { Sparkles } from 'lucide-react';
import { NicheSelector } from '../../components/shared/NicheSelector';
import { CitySelector } from '../../components/shared/CitySelector';
import { Slider } from '../../components/ui/Slider';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useOrchestratorStore } from '../../store/orchestratorStore';

export const OrchestratorForm: React.FC = () => {
  const store = useOrchestratorStore();
  const { isRunning, error } = store;

  const isFormValid =
    store.niche.length > 0 &&
    store.mcc_code.length > 0 &&
    !Number.isNaN(store.lat) &&
    !Number.isNaN(store.lon) &&
    parseFloat(store.capital_uzs) > 0;

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Orkestrator parametrlari
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Bitta formadan — barcha 35 modul bo'yicha AI tahlil
          </p>
        </div>

        <NicheSelector
          value={store.mcc_code}
          onChange={(mcc, niche) => {
            store.setMccCode(mcc);
            store.setNiche(niche);
          }}
        />

        <CitySelector value={store.city} onChange={store.setCity} />

        <Slider
          label="Tahlil radiusi"
          min={100}
          max={10000}
          step={100}
          value={store.radius_m}
          onChange={store.setRadius}
          formatValue={(v) => `${v} m`}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Kenglik (Lat)"
            type="number"
            value={store.lat.toFixed(4)}
            readOnly
            helperText="Xaritadan bosing"
          />
          <Input
            label="Uzunlik (Lon)"
            type="number"
            value={store.lon.toFixed(4)}
            readOnly
          />
        </div>

        <Input
          label="Boshlang'ich kapital (UZS)"
          type="number"
          placeholder="Masalan: 500000000"
          value={store.capital_uzs}
          onChange={(e) => store.setCapital(e.target.value)}
        />

        <Input
          label="Yil"
          type="number"
          value={store.year}
          onChange={(e) => store.setYear(parseInt(e.target.value) || new Date().getFullYear())}
        />

        {error && (
          <div
            style={{
              color: 'var(--danger)',
              fontSize: '0.875rem',
              padding: '8px 12px',
              background: 'var(--danger-bg)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {error}
          </div>
        )}

        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => store.runAnalysis()}
          isLoading={isRunning}
          disabled={!isFormValid}
          icon={!isRunning ? <Sparkles size={18} /> : undefined}
          style={{ marginTop: '8px' }}
        >
          {isRunning ? 'AI ishlamoqda...' : "To'liq AI Tahlil (35 modul)"}
        </Button>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          7 blok × 35 modul — TAM/SAM/SOM, talab prognozi, lokatsiya skori, moliyaviy
          hayotchanlik, raqobat va churn, kredit skoring, demografik profil barchasi bir o'rinda.
        </div>
      </div>
    </Card>
  );
};

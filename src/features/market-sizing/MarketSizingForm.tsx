import React from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { NicheSelector } from '../../components/shared/NicheSelector';
import { CitySelector } from '../../components/shared/CitySelector';
import { Slider } from '../../components/ui/Slider';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useMarketSizing } from '../../hooks/useMarketSizing';

export const MarketSizingForm: React.FC = () => {
  const store = useAnalysisStore();
  const { mutate: analyze, isPending, error } = useMarketSizing();

  const handleAnalyze = () => {
    store.setResult(null); // Clear previous results
    analyze({
      niche: store.niche,
      mcc_code: store.mcc_code,
      lat: store.lat,
      lon: store.lon,
      radius_m: store.radius_m,
      city: store.city,
      capital_uzs: store.capital_uzs || 0,
      year: store.year
    }, {
      onSuccess: (data) => {
        store.setResult(data);
      }
    });
  };

  const isFormValid = store.niche && store.mcc_code && store.lat && store.lon && store.capital_uzs;

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Parametrlar
        </h2>
        
        <NicheSelector 
          value={store.mcc_code}
          onChange={(mcc, niche) => {
            store.setMccCode(mcc);
            store.setNiche(niche);
          }}
        />

        <CitySelector 
          value={store.city}
          onChange={store.setCity}
        />

        <Slider
          label="Tahlil Radiusi"
          min={100}
          max={10000}
          step={100}
          value={store.radius_m}
          onChange={store.setRadius}
          formatValue={(val) => `${val} m`}
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
          label="Boshlang'ich Kapital (UZS)" 
          type="number" 
          placeholder="Masalan: 500000000"
          value={store.capital_uzs}
          onChange={(e) => store.setCapital(e.target.value)}
        />

        {error && (
          <div style={{ color: 'var(--danger)', fontSize: '0.875rem', padding: '8px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)' }}>
            Xatolik yuz berdi. Iltimos tekshiring.
          </div>
        )}

        <Button 
          variant="primary" 
          fullWidth 
          size="lg"
          onClick={handleAnalyze}
          isLoading={isPending}
          disabled={!isFormValid}
          style={{ marginTop: '8px' }}
        >
          Tahlil Qilish
        </Button>
      </div>
    </Card>
  );
};

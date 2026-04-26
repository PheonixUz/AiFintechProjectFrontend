import React from 'react';
import { useDemandForecastStore } from '../../store/demandForecastStore';
import { NicheSelector } from '../../components/shared/NicheSelector';
import { CitySelector } from '../../components/shared/CitySelector';
import { Slider } from '../../components/ui/Slider';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { useDemandForecast } from '../../hooks/useDemandForecast';
import type { DemandForecastRequest } from '../../types/api.types';

const HORIZON_ALLOWED = new Set([12, 24, 36]);

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
};

const buildPayload = (
  s: ReturnType<typeof useDemandForecastStore.getState>
): DemandForecastRequest => {
  const horizon = HORIZON_ALLOWED.has(s.horizon_months) ? s.horizon_months : 12;
  const body: DemandForecastRequest = {
    mcc_code: s.mcc_code,
    city: s.city || undefined,
    horizon_months: horizon,
  };
  if (s.send_location_for_competitors) {
    body.lat = s.lat;
    body.lon = s.lon;
    body.radius_m = s.radius_m;
  }
  return body;
};

export const DemandForecastForm: React.FC = () => {
  const store = useDemandForecastStore();
  const { mutate: forecast, isPending, error } = useDemandForecast();

  const handleRun = () => {
    store.setResult(null);
    const payload = buildPayload(store);
    forecast(payload, {
      onSuccess: (data) => store.setResult(data),
    });
  };

  const isFormValid = Boolean(store.mcc_code && store.mcc_code.length === 4);

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Parametrlar
        </h2>

        <NicheSelector
          value={store.mcc_code}
          onChange={(mcc) => {
            store.setMccCode(mcc);
          }}
        />

        <CitySelector value={store.city} onChange={store.setCity} />

        <Select
          label="Prognoz muddati"
          placeholder="Tanlang"
          options={[
            { value: '12', label: '12 oy (1 yil)' },
            { value: '24', label: '24 oy (2 yil)' },
            { value: '36', label: '36 oy (3 yil)' },
          ]}
          value={String(store.horizon_months)}
          onChange={(v) => store.setHorizonMonths(Number(v) as 12 | 24 | 36)}
        />

        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={store.send_location_for_competitors}
            onChange={(e) => store.setSendLocationForCompetitors(e.target.checked)}
          />
          Lat/lon/radius — mahalliy raqobatchi bosimi (ixtiyoriy)
        </label>

        {store.send_location_for_competitors && (
          <>
            <Slider
              label="Radius (m)"
              min={100}
              max={20000}
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
          </>
        )}

        {error && (
          <div
            style={{
              color: 'var(--danger)',
              fontSize: '0.875rem',
              padding: '8px',
              background: 'var(--danger-bg)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            So‘rov xato qaytdi. MCC va tarmoqni tekshiring.
          </div>
        )}

        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleRun}
          isLoading={isPending}
          disabled={!isFormValid}
          style={{ marginTop: '8px' }}
        >
          Prognozni hisoblash
        </Button>
      </div>
    </Card>
  );
};

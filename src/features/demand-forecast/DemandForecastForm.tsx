import React, { useState } from 'react';
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

/** api_docs.json DemandForecastRequest chegaralari */
const INFLATION_MIN = -0.2;
const INFLATION_MAX = 1;
const MACRO_MIN = -0.5;
const MACRO_MAX = 0.5;
const HORIZON_ALLOWED = new Set([12, 24, 36]);

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
};

const buildPayload = (s: ReturnType<typeof useDemandForecastStore.getState>): DemandForecastRequest => {
  const horizon = HORIZON_ALLOWED.has(s.horizon_months) ? s.horizon_months : 12;
  const body: DemandForecastRequest = {
    mcc_code: s.mcc_code,
    city: s.city || undefined,
    horizon_months: horizon,
    confidence_level: s.confidence_level,
    use_holiday_adjustments: s.use_holiday_adjustments,
    clean_anomalies: s.clean_anomalies,
  };
  if (s.niche.trim()) body.niche = s.niche.trim();
  if (s.send_location_for_competitors) {
    body.lat = s.lat;
    body.lon = s.lon;
    body.radius_m = s.radius_m;
  }
  const infl = parseFloat(s.annual_inflation_rate_pct.replace(',', '.'));
  if (!Number.isNaN(infl)) body.annual_inflation_rate_pct = infl;
  const macro = parseFloat(s.annual_macro_growth_pct.replace(',', '.'));
  if (!Number.isNaN(macro)) body.annual_macro_growth_pct = macro;
  return body;
};

const validatePayload = (body: DemandForecastRequest): string | null => {
  const infl = body.annual_inflation_rate_pct;
  if (infl != null && (infl < INFLATION_MIN || infl > INFLATION_MAX)) {
    return `Yillik inflatsiya ${INFLATION_MIN} … ${INFLATION_MAX} oraliqda bo‘lishi kerak (API cheklovi).`;
  }
  const macro = body.annual_macro_growth_pct;
  if (macro != null && (macro < MACRO_MIN || macro > MACRO_MAX)) {
    return `Makro o‘sish ${MACRO_MIN} … ${MACRO_MAX} oraliqda bo‘lishi kerak (API cheklovi).`;
  }
  return null;
};

export const DemandForecastForm: React.FC = () => {
  const store = useDemandForecastStore();
  const { mutate: forecast, isPending, error } = useDemandForecast();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    store.setResult(null);
    setValidationError(null);
    const payload = buildPayload(store);
    const v = validatePayload(payload);
    if (v) {
      setValidationError(v);
      return;
    }
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
          onChange={(mcc, niche) => {
            store.setMccCode(mcc);
            store.setNiche(niche);
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

        <Slider
          label="Ishonch intervali"
          min={0.8}
          max={0.99}
          step={0.01}
          value={store.confidence_level}
          onChange={store.setConfidenceLevel}
          formatValue={(v) => `${Math.round(v * 100)}%`}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Yillik inflatsiya (taxmin)"
            type="text"
            inputMode="decimal"
            placeholder="0.12"
            value={store.annual_inflation_rate_pct}
            onChange={(e) => store.setAnnualInflationPct(e.target.value)}
            helperText={`API: ${INFLATION_MIN} … ${INFLATION_MAX} (masalan 0.12 = 12%)`}
          />
          <Input
            label="Makro o'sish (taxmin)"
            type="text"
            inputMode="decimal"
            placeholder="0.03"
            value={store.annual_macro_growth_pct}
            onChange={(e) => store.setAnnualMacroGrowthPct(e.target.value)}
            helperText={`API: ${MACRO_MIN} … ${MACRO_MAX} (masalan 0.03 = 3%)`}
          />
        </div>

        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={store.use_holiday_adjustments}
            onChange={(e) => store.setUseHolidayAdjustments(e.target.checked)}
          />
          Bayram/mavsumiy tuzatishlar
        </label>
        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={store.clean_anomalies}
            onChange={(e) => store.setCleanAnomalies(e.target.checked)}
          />
          Anomaliyalarni yumshatish
        </label>
        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={store.send_location_for_competitors}
            onChange={(e) => store.setSendLocationForCompetitors(e.target.checked)}
          />
          Lat/lon/radius — mahalliy raqobatchi bosimi (ixtiyoriy, API bo‘yicha alohida maydonlar)
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

        {validationError && (
          <div
            style={{
              color: 'var(--danger)',
              fontSize: '0.875rem',
              padding: '8px',
              background: 'var(--danger-bg)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {validationError}
          </div>
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

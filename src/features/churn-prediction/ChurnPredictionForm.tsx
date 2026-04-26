import React, { useState } from 'react';
import { useChurnPredictionStore } from '../../store/churnPredictionStore';
import { NicheSelector } from '../../components/shared/NicheSelector';
import { CitySelector } from '../../components/shared/CitySelector';
import { Slider } from '../../components/ui/Slider';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { useChurnPrediction } from '../../hooks/useChurnPrediction';
import type { ChurnPredictionRequest } from '../../types/api.types';

const HORIZON_MIN = 6;
const HORIZON_MAX = 36;
const RADIUS_MIN = 100;
const RADIUS_MAX = 20000;

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.9rem',
  color: 'var(--text-secondary)',
};

const parseDecimal = (raw: string): number | undefined => {
  const t = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
};

const parseOptionalInt = (raw: string): number | undefined => {
  const t = raw.trim();
  if (!t) return undefined;
  const n = parseInt(t, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

const parsePositiveInt = (raw: string): number | undefined => {
  const v = parseOptionalInt(raw);
  return v != null && v > 0 ? v : undefined;
};

type Store = ReturnType<typeof useChurnPredictionStore.getState>;

const attachNumber = (
  body: ChurnPredictionRequest,
  key: keyof ChurnPredictionRequest,
  raw: string,
  opts?: { min?: number; max?: number; positive?: boolean }
) => {
  const n = parseDecimal(raw);
  if (n == null) return;
  if (opts?.positive && n <= 0) return;
  if (opts?.min != null && n < opts.min) return;
  if (opts?.max != null && n > opts.max) return;
  (body as Record<string, unknown>)[key] = n;
};

const attachInt = (
  body: ChurnPredictionRequest,
  key: keyof ChurnPredictionRequest,
  raw: string,
  opts?: { min?: number; max?: number }
) => {
  const n = parseOptionalInt(raw);
  if (n == null) return;
  if (opts?.min != null && n < opts.min) return;
  if (opts?.max != null && n > opts.max) return;
  (body as Record<string, unknown>)[key] = n;
};

const buildPayload = (s: Store): ChurnPredictionRequest => {
  let horizon = Math.round(s.prediction_horizon_months);
  if (!Number.isFinite(horizon)) horizon = 24;
  if (horizon < HORIZON_MIN) horizon = HORIZON_MIN;
  if (horizon > HORIZON_MAX) horizon = HORIZON_MAX;

  const body: ChurnPredictionRequest = {
    prediction_horizon_months: horizon,
  };

  const businessId = parsePositiveInt(s.business_id);
  if (businessId != null) body.business_id = businessId;
  if (s.mcc_code && s.mcc_code.length === 4) body.mcc_code = s.mcc_code;
  if (s.niche.trim()) body.niche = s.niche.trim();
  if (s.city.trim()) body.city = s.city.trim();
  if (s.district.trim()) body.district = s.district.trim();

  if (s.as_of_date.trim()) body.as_of_date = s.as_of_date.trim();

  if (s.send_location) {
    body.lat = s.lat;
    body.lon = s.lon;
    body.radius_m = s.radius_m;
  }

  attachInt(body, 'business_age_months', s.business_age_months, { min: 0, max: 600 });
  attachInt(body, 'employee_count_est', s.employee_count_est, { min: 0, max: 500 });
  attachNumber(body, 'area_sqm', s.area_sqm, { min: 1, max: 100000 });

  attachNumber(body, 'revenue_3m_avg_uzs', s.revenue_3m_avg_uzs, { min: 0 });
  attachNumber(body, 'revenue_6m_avg_uzs', s.revenue_6m_avg_uzs, { min: 0 });
  attachNumber(body, 'revenue_12m_avg_uzs', s.revenue_12m_avg_uzs, { min: 0 });
  attachNumber(body, 'revenue_trend_6m_pct', s.revenue_trend_6m_pct, { min: -1, max: 2 });
  attachNumber(body, 'revenue_volatility_12m_pct', s.revenue_volatility_12m_pct, { min: 0, max: 3 });
  attachNumber(body, 'revenue_drop_last_3m_pct', s.revenue_drop_last_3m_pct, { min: 0, max: 1 });
  attachInt(body, 'zero_revenue_months_12m', s.zero_revenue_months_12m, { min: 0, max: 12 });

  attachNumber(body, 'tx_count_3m_avg', s.tx_count_3m_avg, { min: 0 });
  attachNumber(body, 'tx_count_12m_avg', s.tx_count_12m_avg, { min: 0 });
  attachNumber(body, 'tx_count_trend_6m_pct', s.tx_count_trend_6m_pct, { min: -1, max: 2 });
  attachNumber(body, 'avg_ticket_3m_uzs', s.avg_ticket_3m_uzs, { min: 0 });
  attachNumber(body, 'avg_ticket_change_6m_pct', s.avg_ticket_change_6m_pct, { min: -1, max: 2 });
  attachInt(body, 'active_days_last_90d', s.active_days_last_90d, { min: 0, max: 90 });
  attachInt(body, 'inactive_days_last_90d', s.inactive_days_last_90d, { min: 0, max: 90 });
  attachNumber(body, 'online_share_12m_pct', s.online_share_12m_pct, { min: 0, max: 1 });

  attachInt(body, 'competitor_count_radius', s.competitor_count_radius, { min: 0, max: 10000 });
  attachNumber(body, 'competitor_density_score', s.competitor_density_score, { min: 0, max: 1 });
  attachInt(body, 'nearby_closed_businesses_24m', s.nearby_closed_businesses_24m, { min: 0, max: 10000 });
  attachNumber(body, 'district_failure_rate_24m_pct', s.district_failure_rate_24m_pct, { min: 0, max: 1 });
  attachNumber(body, 'macro_risk_score', s.macro_risk_score, { min: 0, max: 1 });
  attachNumber(body, 'seasonality_risk_score', s.seasonality_risk_score, { min: 0, max: 1 });
  attachNumber(body, 'data_quality_score', s.data_quality_score, { min: 0, max: 1 });

  return body;
};

const validatePayload = (body: ChurnPredictionRequest): string | null => {
  if (!body.business_id && !body.mcc_code) {
    return 'business_id yoki 4 raqamli MCC kodni kiriting.';
  }
  if (body.mcc_code && body.mcc_code.length !== 4) {
    return 'MCC kod aniq 4 raqamdan iborat bo‘lishi kerak.';
  }
  if (body.as_of_date && !/^\d{4}-\d{2}-\d{2}$/.test(body.as_of_date)) {
    return 'as_of_date formati YYYY-MM-DD bo‘lishi kerak.';
  }
  if (
    body.prediction_horizon_months != null &&
    (body.prediction_horizon_months < HORIZON_MIN ||
      body.prediction_horizon_months > HORIZON_MAX)
  ) {
    return `Prognoz gorizonti ${HORIZON_MIN} … ${HORIZON_MAX} oy oralig‘ida.`;
  }
  return null;
};

export const ChurnPredictionForm: React.FC = () => {
  const store = useChurnPredictionStore();
  const { mutate: predict, isPending, error } = useChurnPrediction();
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
    predict(payload, {
      onSuccess: (data) => store.setResult(data),
    });
  };

  const hasMcc = store.mcc_code.length === 4;
  const hasBusinessId = parsePositiveInt(store.business_id) != null;
  const isFormValid = hasMcc || hasBusinessId;

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Churn parametrlari (M-E2)
        </h2>

        <NicheSelector
          value={store.mcc_code}
          onChange={(mcc, niche) => {
            store.setMccCode(mcc);
            store.setNiche(niche);
          }}
        />

        <CitySelector value={store.city} onChange={store.setCity} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Tuman (ixtiyoriy)"
            value={store.district}
            onChange={(e) => store.setDistrict(e.target.value)}
            placeholder="Yunusobod"
          />
          <Input
            label="Business ID (ixtiyoriy)"
            inputMode="numeric"
            value={store.business_id}
            onChange={(e) => store.setBusinessId(e.target.value)}
            helperText="Berilsa DBdan olinadi"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select
            label="Prognoz gorizonti"
            options={[
              { value: '12', label: '12 oy' },
              { value: '18', label: '18 oy' },
              { value: '24', label: '24 oy' },
              { value: '30', label: '30 oy' },
              { value: '36', label: '36 oy' },
            ]}
            value={String(store.prediction_horizon_months)}
            onChange={(v) => store.setPredictionHorizon(Number(v))}
          />
          <Input
            label="As of date (ixtiyoriy)"
            type="date"
            value={store.as_of_date}
            onChange={(e) => store.setAsOfDate(e.target.value)}
            helperText="YYYY-MM-DD"
          />
        </div>

        <details style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
            Biznes parametrlari (ixtiyoriy)
          </summary>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <Input
              label="Yoshi (oy, 0–600)"
              inputMode="numeric"
              value={store.business_age_months}
              onChange={(e) => store.setField('business_age_months', e.target.value)}
            />
            <Input
              label="Xodimlar soni (0–500)"
              inputMode="numeric"
              value={store.employee_count_est}
              onChange={(e) => store.setField('employee_count_est', e.target.value)}
            />
            <Input
              label="Maydon (sqm, 1–100000)"
              inputMode="decimal"
              value={store.area_sqm}
              onChange={(e) => store.setField('area_sqm', e.target.value)}
            />
          </div>
        </details>

        <details style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
            Moliyaviy ko‘rsatkichlar (ixtiyoriy)
          </summary>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <Input
              label="Revenue 3m avg (UZS)"
              inputMode="decimal"
              value={store.revenue_3m_avg_uzs}
              onChange={(e) => store.setField('revenue_3m_avg_uzs', e.target.value)}
            />
            <Input
              label="Revenue 6m avg (UZS)"
              inputMode="decimal"
              value={store.revenue_6m_avg_uzs}
              onChange={(e) => store.setField('revenue_6m_avg_uzs', e.target.value)}
            />
            <Input
              label="Revenue 12m avg (UZS)"
              inputMode="decimal"
              value={store.revenue_12m_avg_uzs}
              onChange={(e) => store.setField('revenue_12m_avg_uzs', e.target.value)}
            />
            <Input
              label="Trend 6m (-1 … 2)"
              inputMode="decimal"
              value={store.revenue_trend_6m_pct}
              onChange={(e) => store.setField('revenue_trend_6m_pct', e.target.value)}
              placeholder="0.05 = +5%"
            />
            <Input
              label="Volatillik 12m (0 … 3)"
              inputMode="decimal"
              value={store.revenue_volatility_12m_pct}
              onChange={(e) => store.setField('revenue_volatility_12m_pct', e.target.value)}
            />
            <Input
              label="Oxirgi 3m pasayish (0 … 1)"
              inputMode="decimal"
              value={store.revenue_drop_last_3m_pct}
              onChange={(e) => store.setField('revenue_drop_last_3m_pct', e.target.value)}
            />
            <Input
              label="Zero-rev oylar (0 … 12)"
              inputMode="numeric"
              value={store.zero_revenue_months_12m}
              onChange={(e) => store.setField('zero_revenue_months_12m', e.target.value)}
            />
          </div>
        </details>

        <details style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
            Tranzaksiya aktivligi (ixtiyoriy)
          </summary>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <Input
              label="TX 3m avg"
              inputMode="decimal"
              value={store.tx_count_3m_avg}
              onChange={(e) => store.setField('tx_count_3m_avg', e.target.value)}
            />
            <Input
              label="TX 12m avg"
              inputMode="decimal"
              value={store.tx_count_12m_avg}
              onChange={(e) => store.setField('tx_count_12m_avg', e.target.value)}
            />
            <Input
              label="TX trend 6m (-1 … 2)"
              inputMode="decimal"
              value={store.tx_count_trend_6m_pct}
              onChange={(e) => store.setField('tx_count_trend_6m_pct', e.target.value)}
            />
            <Input
              label="O‘rt. chek 3m (UZS)"
              inputMode="decimal"
              value={store.avg_ticket_3m_uzs}
              onChange={(e) => store.setField('avg_ticket_3m_uzs', e.target.value)}
            />
            <Input
              label="O‘rt. chek o‘zgarishi 6m (-1 … 2)"
              inputMode="decimal"
              value={store.avg_ticket_change_6m_pct}
              onChange={(e) => store.setField('avg_ticket_change_6m_pct', e.target.value)}
            />
            <Input
              label="Faol kun (0 … 90)"
              inputMode="numeric"
              value={store.active_days_last_90d}
              onChange={(e) => store.setField('active_days_last_90d', e.target.value)}
            />
            <Input
              label="Nofaol kun (0 … 90)"
              inputMode="numeric"
              value={store.inactive_days_last_90d}
              onChange={(e) => store.setField('inactive_days_last_90d', e.target.value)}
            />
            <Input
              label="Onlayn ulush 12m (0 … 1)"
              inputMode="decimal"
              value={store.online_share_12m_pct}
              onChange={(e) => store.setField('online_share_12m_pct', e.target.value)}
              placeholder="0.3 = 30%"
            />
          </div>
        </details>

        <details style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
            Tashqi omillar (ixtiyoriy)
          </summary>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
            <Input
              label="Raqobatchi soni (radiusda)"
              inputMode="numeric"
              value={store.competitor_count_radius}
              onChange={(e) => store.setField('competitor_count_radius', e.target.value)}
            />
            <Input
              label="Raqobat zichligi (0 … 1)"
              inputMode="decimal"
              value={store.competitor_density_score}
              onChange={(e) => store.setField('competitor_density_score', e.target.value)}
            />
            <Input
              label="Atrofdagi yopilganlar (24m)"
              inputMode="numeric"
              value={store.nearby_closed_businesses_24m}
              onChange={(e) => store.setField('nearby_closed_businesses_24m', e.target.value)}
            />
            <Input
              label="Tuman failure rate (0 … 1)"
              inputMode="decimal"
              value={store.district_failure_rate_24m_pct}
              onChange={(e) => store.setField('district_failure_rate_24m_pct', e.target.value)}
            />
            <Input
              label="Makro risk (0 … 1)"
              inputMode="decimal"
              value={store.macro_risk_score}
              onChange={(e) => store.setField('macro_risk_score', e.target.value)}
            />
            <Input
              label="Mavsumiy risk (0 … 1)"
              inputMode="decimal"
              value={store.seasonality_risk_score}
              onChange={(e) => store.setField('seasonality_risk_score', e.target.value)}
            />
            <Input
              label="Data quality (0 … 1)"
              inputMode="decimal"
              value={store.data_quality_score}
              onChange={(e) => store.setField('data_quality_score', e.target.value)}
            />
          </div>
        </details>

        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={store.send_location}
            onChange={(e) => store.setSendLocation(e.target.checked)}
          />
          Lokatsiya (lat/lon/radius) — raqobat zonasini aniqlash
        </label>
        {store.send_location && (
          <>
            <Slider
              label="Radius (m)"
              min={RADIUS_MIN}
              max={RADIUS_MAX}
              step={100}
              value={store.radius_m}
              onChange={store.setRadius}
              formatValue={(val) => `${val} m`}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input label="Lat" type="number" value={store.lat.toFixed(4)} readOnly helperText="Xaritadan" />
              <Input label="Lon" type="number" value={store.lon.toFixed(4)} readOnly />
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
            So‘rov xato qaytdi. Maydonlarni va tarmoqni tekshiring.
          </div>
        )}

        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={handleRun}
          isLoading={isPending}
          disabled={!isFormValid}
        >
          Churn ehtimolini hisoblash
        </Button>
      </div>
    </Card>
  );
};

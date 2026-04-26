import React, { useState } from 'react';
import { useViabilityCheckStore } from '../../store/viabilityCheckStore';
import { NicheSelector } from '../../components/shared/NicheSelector';
import { CitySelector } from '../../components/shared/CitySelector';
import { Slider } from '../../components/ui/Slider';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { useViabilityCheck } from '../../hooks/useViabilityCheck';
import type { ViabilityCheckRequest } from '../../types/api.types';

const SIM_MONTHS = new Set([12, 24, 36]);
const MC_MIN = 500;
const MC_MAX = 20000;
const INFLATION_MIN = -0.2;
const INFLATION_MAX = 1;
const MACRO_MIN = -0.5;
const MACRO_MAX = 0.5;
const TAX_MAX = 0.5;

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
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

const buildPayload = (s: ReturnType<typeof useViabilityCheckStore.getState>): ViabilityCheckRequest => {
  const sim = SIM_MONTHS.has(s.simulation_months) ? s.simulation_months : 24;
  let mc = Math.round(s.monte_carlo_iterations);
  if (!Number.isFinite(mc) || mc < MC_MIN) mc = MC_MIN;
  if (mc > MC_MAX) mc = MC_MAX;

  const initial = parseDecimal(s.initial_capital_uzs);
  const body: ViabilityCheckRequest = {
    mcc_code: s.mcc_code,
    initial_capital_uzs: initial != null && initial > 0 ? initial : 0,
    city: s.city.trim() || undefined,
    simulation_months: sim,
    monte_carlo_iterations: mc,
    clean_anomalies: s.clean_anomalies,
  };

  if (s.plan_name.trim()) body.plan_name = s.plan_name.trim();
  if (s.niche.trim()) body.niche = s.niche.trim();
  if (s.send_location) {
    body.lat = s.lat;
    body.lon = s.lon;
    body.radius_m = s.radius_m;
  }

  const infl = parseDecimal(s.annual_inflation_rate_pct);
  if (infl != null) body.annual_inflation_rate_pct = infl;
  const macro = parseDecimal(s.annual_macro_growth_pct);
  if (macro != null) body.annual_macro_growth_pct = macro;
  const tax = parseDecimal(s.tax_rate_pct);
  if (tax != null) body.tax_rate_pct = tax;

  const m = (val: string): number | undefined => {
    const n = parseDecimal(val);
    return n != null && n >= 0 ? n : undefined;
  };
  const mPositive = (val: string): number | undefined => {
    const n = parseDecimal(val);
    return n != null && n > 0 ? n : undefined;
  };

  const capex = m(s.startup_capex_uzs);
  if (capex != null) body.startup_capex_uzs = capex;
  const loan = m(s.loan_amount_uzs);
  if (loan != null) body.loan_amount_uzs = loan;
  const loanPay = m(s.monthly_loan_payment_uzs);
  if (loanPay != null) body.monthly_loan_payment_uzs = loanPay;
  const rev = mPositive(s.expected_monthly_revenue_uzs);
  if (rev != null) body.expected_monthly_revenue_uzs = rev;
  const ticket = mPositive(s.avg_ticket_uzs);
  if (ticket != null) body.avg_ticket_uzs = ticket;
  const fixedTot = m(s.monthly_fixed_cost_uzs);
  if (fixedTot != null) body.monthly_fixed_cost_uzs = fixedTot;
  const rent = m(s.monthly_rent_uzs);
  if (rent != null) body.monthly_rent_uzs = rent;
  const payroll = m(s.monthly_payroll_uzs);
  if (payroll != null) body.monthly_payroll_uzs = payroll;
  const util = m(s.monthly_utilities_uzs);
  if (util != null) body.monthly_utilities_uzs = util;
  const mkt = m(s.monthly_marketing_uzs);
  if (mkt != null) body.monthly_marketing_uzs = mkt;
  const other = m(s.monthly_other_fixed_uzs);
  if (other != null) body.monthly_other_fixed_uzs = other;
  const draw = m(s.owner_draw_uzs);
  if (draw != null) body.owner_draw_uzs = draw;

  const tx = parseOptionalInt(s.expected_monthly_transactions);
  if (tx != null) body.expected_monthly_transactions = tx;

  const gm = parseDecimal(s.gross_margin_pct);
  if (gm != null) body.gross_margin_pct = gm;
  const vc = parseDecimal(s.variable_cost_pct);
  if (vc != null) body.variable_cost_pct = vc;
  const rg = parseDecimal(s.monthly_revenue_growth_pct);
  if (rg != null) body.monthly_revenue_growth_pct = rg;
  const vol = parseDecimal(s.revenue_volatility_pct);
  if (vol != null) body.revenue_volatility_pct = vol;

  const seedRaw = s.random_seed.trim();
  if (seedRaw) {
    const seed = parseInt(seedRaw, 10);
    if (Number.isFinite(seed)) body.random_seed = seed;
  }

  const sj = s.seasonality_json.trim();
  if (sj) {
    try {
      const o = JSON.parse(sj) as unknown;
      if (o && typeof o === 'object' && !Array.isArray(o)) {
        body.seasonality_profile = o as Record<string, number>;
      }
    } catch {
      /* validated before submit */
    }
  }
  const rj = s.risk_json.trim();
  if (rj) {
    try {
      const o = JSON.parse(rj) as unknown;
      if (o && typeof o === 'object' && !Array.isArray(o)) {
        body.risk_assumptions = o as Record<string, unknown>;
      }
    } catch {
      /* validated before submit */
    }
  }

  return body;
};

const validatePayload = (
  body: ViabilityCheckRequest,
  seasonalityRaw: string,
  riskRaw: string
): string | null => {
  const initial =
    typeof body.initial_capital_uzs === 'number'
      ? body.initial_capital_uzs
      : parseDecimal(String(body.initial_capital_uzs));
  if (initial == null || initial <= 0) {
    return 'Boshlang‘ich kapital musbat son bo‘lishi kerak.';
  }
  const infl = body.annual_inflation_rate_pct;
  if (infl != null && (infl < INFLATION_MIN || infl > INFLATION_MAX)) {
    return `Yillik inflatsiya ${INFLATION_MIN} … ${INFLATION_MAX} oraliqda (API).`;
  }
  const macro = body.annual_macro_growth_pct;
  if (macro != null && (macro < MACRO_MIN || macro > MACRO_MAX)) {
    return `Makro o‘sish ${MACRO_MIN} … ${MACRO_MAX} oraliqda (API).`;
  }
  const tax = body.tax_rate_pct;
  if (tax != null && (tax < 0 || tax > TAX_MAX)) {
    return `Soliq stavkasi 0 … ${TAX_MAX} oraliqda (API).`;
  }
  const gm = body.gross_margin_pct;
  if (gm != null && (gm <= 0 || gm >= 1)) {
    return 'Yalpi marja 0 dan katta va 1 dan kichik bo‘lishi kerak (masalan 0.35).';
  }
  const vc = body.variable_cost_pct;
  if (vc != null && (vc < 0 || vc >= 1)) {
    return 'O‘zgaruvchan xarajat ulushi 0 … 1 oraliqda (1 dan kichik).';
  }
  const sj = seasonalityRaw.trim();
  if (sj) {
    try {
      const o = JSON.parse(sj) as unknown;
      if (!o || typeof o !== 'object' || Array.isArray(o)) {
        return 'Seasonality: yaroqli JSON obyekt kiriting (masalan {"12": 1.2}).';
      }
    } catch {
      return 'Seasonality JSON noto‘g‘ri.';
    }
  }
  const rj = riskRaw.trim();
  if (rj) {
    try {
      const o = JSON.parse(rj) as unknown;
      if (!o || typeof o !== 'object' || Array.isArray(o)) {
        return 'Risk assumptions: yaroqli JSON obyekt kiriting.';
      }
    } catch {
      return 'Risk assumptions JSON noto‘g‘ri.';
    }
  }
  return null;
};

export const ViabilityCheckForm: React.FC = () => {
  const store = useViabilityCheckStore();
  const { mutate: runCheck, isPending, error } = useViabilityCheck();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRun = () => {
    store.setResult(null);
    setValidationError(null);
    const payload = buildPayload(store);
    const v = validatePayload(payload, store.seasonality_json, store.risk_json);
    if (v) {
      setValidationError(v);
      return;
    }
    runCheck(payload, {
      onSuccess: (data) => store.setResult(data),
    });
  };

  const cap0 = parseDecimal(store.initial_capital_uzs);
  const isFormValid = store.mcc_code.length === 4 && cap0 != null && cap0 > 0;

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Moliyaviy parametrlar (M-D1)
        </h2>

        <NicheSelector
          value={store.mcc_code}
          onChange={(mcc, niche) => {
            store.setMccCode(mcc);
            store.setNiche(niche);
          }}
        />

        <CitySelector value={store.city} onChange={store.setCity} />

        <Input
          label="Reja / ssenariya nomi (ixtiyoriy)"
          value={store.plan_name}
          onChange={(e) => store.setPlanName(e.target.value)}
          placeholder="Masalan: Filial #1"
        />

        <Input
          label="Boshlang‘ich kapital (UZS) *"
          inputMode="decimal"
          value={store.initial_capital_uzs}
          onChange={(e) => store.setInitialCapital(e.target.value)}
          placeholder="50000000"
          helperText="Mavjud naqd / hisobdagi kapital"
        />

        <details style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
            CAPEX va kredit
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <Input
              label="Boshlang‘ich CAPEX (UZS)"
              inputMode="decimal"
              value={store.startup_capex_uzs}
              onChange={(e) => store.setStartupCapex(e.target.value)}
              helperText="Bo‘sh qoldirilsa — benchmark"
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Kredit summasi (UZS)"
                inputMode="decimal"
                value={store.loan_amount_uzs}
                onChange={(e) => store.setLoanAmount(e.target.value)}
              />
              <Input
                label="Oylik kredit to‘lovi (UZS)"
                inputMode="decimal"
                value={store.monthly_loan_payment_uzs}
                onChange={(e) => store.setMonthlyLoanPayment(e.target.value)}
              />
            </div>
          </div>
        </details>

        <details style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
            Daromad taxminlari (bo‘sh — benchmark)
          </summary>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <Input
              label="Kutilayotgan oylik tushum (UZS)"
              inputMode="decimal"
              value={store.expected_monthly_revenue_uzs}
              onChange={(e) => store.setExpectedMonthlyRevenue(e.target.value)}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="O‘rtacha chek (UZS)"
                inputMode="decimal"
                value={store.avg_ticket_uzs}
                onChange={(e) => store.setAvgTicket(e.target.value)}
              />
              <Input
                label="Oylik tranzaksiyalar soni"
                inputMode="numeric"
                value={store.expected_monthly_transactions}
                onChange={(e) => store.setExpectedMonthlyTransactions(e.target.value)}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Yalpi marja (0–1)"
                inputMode="decimal"
                value={store.gross_margin_pct}
                onChange={(e) => store.setGrossMarginPct(e.target.value)}
                placeholder="0.35"
                helperText="35% = 0.35"
              />
              <Input
                label="O‘zgaruvchan xarajat %"
                inputMode="decimal"
                value={store.variable_cost_pct}
                onChange={(e) => store.setVariableCostPct(e.target.value)}
                placeholder="0.65"
              />
            </div>
          </div>
        </details>

        <details style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--text-primary)' }}>
            Doimiy xarajatlar (oylik, UZS)
          </summary>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginTop: '12px',
            }}
          >
            <Input
              label="Jami fixed (override)"
              inputMode="decimal"
              value={store.monthly_fixed_cost_uzs}
              onChange={(e) => store.setMonthlyFixedCost(e.target.value)}
              helperText="Bo‘sh bo‘lsa — quyidagilar yig‘indisi / benchmark"
            />
            <Input
              label="Ijara"
              inputMode="decimal"
              value={store.monthly_rent_uzs}
              onChange={(e) => store.setMonthlyRent(e.target.value)}
            />
            <Input
              label="Ish haqi"
              inputMode="decimal"
              value={store.monthly_payroll_uzs}
              onChange={(e) => store.setMonthlyPayroll(e.target.value)}
            />
            <Input
              label="Kommunal"
              inputMode="decimal"
              value={store.monthly_utilities_uzs}
              onChange={(e) => store.setMonthlyUtilities(e.target.value)}
            />
            <Input
              label="Marketing"
              inputMode="decimal"
              value={store.monthly_marketing_uzs}
              onChange={(e) => store.setMonthlyMarketing(e.target.value)}
            />
            <Input
              label="Boshqa fixed"
              inputMode="decimal"
              value={store.monthly_other_fixed_uzs}
              onChange={(e) => store.setMonthlyOtherFixed(e.target.value)}
            />
            <Input
              label="Egasi chiqimlari (draw)"
              inputMode="decimal"
              value={store.owner_draw_uzs}
              onChange={(e) => store.setOwnerDraw(e.target.value)}
            />
          </div>
        </details>

        <Select
          label="Simulyatsiya davri (oy)"
          options={[
            { value: '12', label: '12 oy' },
            { value: '24', label: '24 oy' },
            { value: '36', label: '36 oy' },
          ]}
          value={String(store.simulation_months)}
          onChange={(v) => store.setSimulationMonths(Number(v) as 12 | 24 | 36)}
        />

        <Slider
          label="Monte Carlo iteratsiyalari"
          min={MC_MIN}
          max={MC_MAX}
          step={100}
          value={store.monte_carlo_iterations}
          onChange={store.setMonteCarloIterations}
          formatValue={(n) => `${n}`}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Yillik inflatsiya"
            inputMode="decimal"
            value={store.annual_inflation_rate_pct}
            onChange={(e) => store.setAnnualInflationPct(e.target.value)}
            helperText={`${INFLATION_MIN} … ${INFLATION_MAX}`}
          />
          <Input
            label="Makro o‘sish"
            inputMode="decimal"
            value={store.annual_macro_growth_pct}
            onChange={(e) => store.setAnnualMacroGrowthPct(e.target.value)}
            helperText={`${MACRO_MIN} … ${MACRO_MAX}`}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Soliq stavkasi (0–1)"
            inputMode="decimal"
            value={store.tax_rate_pct}
            onChange={(e) => store.setTaxRatePct(e.target.value)}
            placeholder="0.04"
          />
          <Input
            label="Random seed (ixtiyoriy)"
            inputMode="numeric"
            value={store.random_seed}
            onChange={(e) => store.setRandomSeed(e.target.value)}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Oylik revenue o‘sishi"
            inputMode="decimal"
            value={store.monthly_revenue_growth_pct}
            onChange={(e) => store.setMonthlyRevenueGrowthPct(e.target.value)}
            placeholder="0.015"
            helperText="1.5% = 0.015"
          />
          <Input
            label="Revenue volatilligi"
            inputMode="decimal"
            value={store.revenue_volatility_pct}
            onChange={(e) => store.setRevenueVolatilityPct(e.target.value)}
            placeholder="0.25"
          />
        </div>

        <Input
          label="Seasonality (JSON obyekt)"
          value={store.seasonality_json}
          onChange={(e) => store.setSeasonalityJson(e.target.value)}
          placeholder='{"12": 1.15, "1": 0.95}'
        />
        <Input
          label="Risk assumptions (JSON)"
          value={store.risk_json}
          onChange={(e) => store.setRiskJson(e.target.value)}
          placeholder="{}"
        />

        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={store.send_location}
            onChange={(e) => store.setSendLocation(e.target.checked)}
          />
          Lokatsiya (lat/lon/radius) — raqobat zonasi
        </label>
        {store.send_location && (
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
              <Input label="Lat" type="number" value={store.lat.toFixed(4)} readOnly helperText="Xaritadan" />
              <Input label="Lon" type="number" value={store.lon.toFixed(4)} readOnly />
            </div>
          </>
        )}

        <label style={rowStyle}>
          <input
            type="checkbox"
            checked={store.clean_anomalies}
            onChange={(e) => store.setCleanAnomalies(e.target.checked)}
          />
          Ekstremal simulyatsiyalarni yumshatish
        </label>

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
          Moliyaviy yashovchanlikni hisoblash
        </Button>
      </div>
    </Card>
  );
};

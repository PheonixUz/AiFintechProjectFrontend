import React, { useState } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import {
  AlertCircle, ChevronDown, ChevronUp, MapPin,
  Percent, DollarSign, Activity, TrendingUp, Info,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// ─── Utility: safe parse number from string or number ───────────────────────
const parseNum = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = value.replace(/[^\d.eE+\-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// ─── Utility: format UZS currency ────────────────────────────────────────────
const formatCurrency = (value: string | number | undefined | null): string => {
  const num = parseNum(value);
  if (num === 0) return '0 UZS';
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)} trln UZS`;
  if (num >= 1e9)  return `${(num / 1e9).toFixed(1)} mlrd UZS`;
  if (num >= 1e6)  return `${(num / 1e6).toFixed(0)} mln UZS`;
  if (num >= 1e3)  return `${(num / 1e3).toFixed(0)} ming UZS`;
  return `${num.toFixed(0)} UZS`;
};

// ─── Utility: safe percentage display ────────────────────────────────────────
const formatPct = (value: number | undefined | null, decimals = 1): string => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return value.toFixed(decimals);
};

// ─── Confidence score helpers (API returns 0–1 float) ────────────────────────
const toConfidencePct = (score: number | undefined | null): number => {
  if (score === undefined || score === null || isNaN(score)) return 0;
  return score <= 1 ? Math.round(score * 100) : Math.round(score);
};

const getConfidenceColor = (score: number | undefined | null): string => {
  const pct = toConfidencePct(score);
  if (pct < 40) return 'var(--error)';
  if (pct < 70) return 'var(--warning)';
  return 'var(--success)';
};

const getConfidenceLabel = (score: number | undefined | null): string => {
  const pct = toConfidencePct(score);
  if (pct < 40) return 'Past';
  if (pct < 70) return "O'rta";
  return 'Yuqori';
};

// ─── Confidence threshold description ────────────────────────────────────────
const getConfidenceNote = (score: number | undefined | null): string => {
  const pct = toConfidencePct(score);
  if (pct >= 95) return '≥10 000 tranzaksiya — juda ishonchli';
  if (pct >= 80) return '≥1 000 tranzaksiya — ishonchli';
  if (pct >= 60) return '≥100 tranzaksiya — qoniqarli';
  if (pct >= 40) return '≥10 tranzaksiya — cheklangan';
  return '<10 tranzaksiya — ehtiyotkorlik bilan';
};

// ─── Small inline note component (Hover Tooltip) ─────────────────────────────
const Note: React.FC<{ text: string }> = ({ text }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        marginLeft: '6px', 
        position: 'relative',
        cursor: 'help',
        verticalAlign: 'middle'
      }}
    >
      <Info 
        size={14} 
        style={{ 
          color: isHovered ? 'var(--accent-primary)' : 'var(--text-muted)', 
          opacity: isHovered ? 1 : 0.7,
          transition: 'all 0.2s ease'
        }} 
      />
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: 1.5,
            whiteSpace: 'pre-line',
            width: 'max-content',
            maxWidth: '280px',
            textAlign: 'center',
            zIndex: 50,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none'
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
export const MarketSizingResults: React.FC = () => {
  const { result, niche } = useAnalysisStore();
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  if (!result) return null;

  const confidencePct = toConfidencePct(result.confidence_score);
  const marketSharePct = Math.min(100, Math.max(0, result.market_share_pct ?? 0));
  // API 0–1 oraliqda qaytaradi → ko'rsatish uchun ×100
  const growthRate  = (result.market_growth_rate_pct ?? 0) * 100;
  const grossMargin = (result.gross_margin_pct ?? 0) * 100;
  const dataWeightPct = Math.round((result.data_weight ?? 0) * 100);
  const bayesianTopDownPct = result.methodology_notes?.bayesian_weight_top_down != null
    ? Math.round((result.methodology_notes.bayesian_weight_top_down as number) * 100)
    : null;

  const calcDate =
    result.methodology_notes?.calculation_date ||
    new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-slide-up">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            Tahlil Natijalari: {niche || result.mcc_code} — {result.city}
          </h2>
          {/* mcc_code — inputdan ko'chirilgan, tahlil qaysi kategoriyaga tegishli */}
          <Badge variant="info">MCC: {result.mcc_code}</Badge>
          {result.from_cache && (
            /* from_cache — bir xil so'rov qayta yuborilganda True bo'ladi */
            <Badge variant="warning">Keshdan</Badge>
          )}
        </div>

        {/* confidence_score — bank tranzaksiya hajmiga qarab 0.20–0.95 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '220px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Ishonch darajasi:</span>
            <span style={{ fontWeight: 600, color: getConfidenceColor(result.confidence_score) }}>
              {confidencePct}% [{getConfidenceLabel(result.confidence_score)}]
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${confidencePct}%`,
                backgroundColor: getConfidenceColor(result.confidence_score),
                transition: 'width 1s ease-in-out',
              }}
            />
          </div>
          <Note text={getConfidenceNote(result.confidence_score)} />
        </div>
      </div>

      {/* ── TAM / SAM / SOM Funnel ── */}
      <Card padding="lg" className="glass-panel">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Bozor Hajmi (Funnel)</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Qavs ichidagi raqamlar ±30% ishonch oralig'i
            </span>
          </div>

          {/* TAM — butun shahar bo'yicha yillik bozor aylanmasi */}
          <div style={{
            width: '100%',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#60a5fa' }}>TAM — Umumiy bozor</div>
              <Note text={`Butun ${result.city} bo'yicha MCC ${result.mcc_code} bizneslarining yillik aylanmasi`} />
              <Note text="Hisob: bank tranzaksiyalari × w + benchmark × (1−w)" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#60a5fa' }}>
                {formatCurrency(result.tam_uzs)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                [{formatCurrency(result.tam_low_uzs)} – {formatCurrency(result.tam_high_uzs)}]
              </div>
            </div>
          </div>

          {/* SAM — radius ichidagi bozor */}
          <div style={{
            width: '85%',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#a78bfa' }}>SAM — Qamrab olish mumkin</div>
              <Note text="Faqat tanlangan radius ichidagi raqobatchilarning yillik aylanmasi" />
              <Note text={`"Atrofimda shu nishada qancha pul aylanmoqda?"`} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a78bfa' }}>
                {formatCurrency(result.sam_uzs)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                [{formatCurrency(result.sam_low_uzs)} – {formatCurrency(result.sam_high_uzs)}]
              </div>
            </div>
          </div>

          {/* SOM — realistik ulush */}
          <div style={{
            width: '70%',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#34d399' }}>SOM — Haqiqiy ulush</div>
              <Note text="Hisob: SAM × 1/(raqobatchilar+1) × sifat_koeffitsiyenti" />
              <Note text="Eng muhim raqam — kapitalingiz bilan solishtiring" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399' }}>
                {formatCurrency(result.som_uzs)}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                [{formatCurrency(result.som_low_uzs)} – {formatCurrency(result.som_high_uzs)}]
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Kontekst ko'rsatkichlari ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>

        {/* market_share_pct — 1/(raqobatchilar+1) × 100 */}
        <Card padding="md" className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <Percent size={16} />
            <span style={{ fontSize: '0.9rem' }}>Bozor ulushi</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px' }}>
            {formatPct(marketSharePct)}%
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
            <div style={{
              height: '100%',
              width: `${marketSharePct}%`,
              backgroundColor: 'var(--accent-primary)',
              transition: 'width 1s ease-in-out',
            }} />
          </div>
          <Note text={`Hisob: 1 / (${result.competitor_count_radius} + 1) × 100 — teng bo'linish ssenariysi`} />
        </Card>

        {/* market_growth_rate_pct — benchmarkdan, 0-1 → ×100 */}
        <Card padding="md" className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <Activity size={16} />
            <span style={{ fontSize: '0.9rem' }}>O'sish sur'ati</span>
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: growthRate >= 0 ? 'var(--success)' : 'var(--error)',
          }}>
            {growthRate > 0 ? '+' : ''}{formatPct(growthRate)}%
            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '4px' }}>/yil</span>
          </div>
          <Note text="DB benchmark ma'lumotidan — nisha kengaymoqdami yoki qisqarmoqda?" />
        </Card>

        {/* gross_margin_pct — benchmarkdan, 0-1 → ×100 */}
        <Card padding="md" className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <DollarSign size={16} />
            <span style={{ fontSize: '0.9rem' }}>Brutto marja</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {formatPct(grossMargin)}%
          </div>
          <Note text="DB benchmark ma'lumotidan — daromadning xarajatlar chegirilib qoladigan foizi" />
          <Note text="ROI va rentabellik modellarida asosiy kirish" />
        </Card>

        {/* competitor_count_radius — market_share_pct ni belgilaydi */}
        <Card padding="md" className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <MapPin size={16} />
            <span style={{ fontSize: '0.9rem' }}>Raqobatchilar</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            {result.competitor_count_radius ?? 0} ta
          </div>
          <Note text="Tanlangan radius ichida topilgan shu MCC kodli bizneslar soni" />
          <Note text="Bu raqam bozor ulushini (SOM) to'g'ridan-to'g'ri belgilaydi" />
        </Card>

      </div>

      {/* ── Tahlil (analysis_summary) ── */}
      <Card padding="lg" className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <AlertCircle size={20} color="var(--accent-primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Tahlili</h3>
        </div>
        {/* analysis_summary — Gemini tomonidan o'zbek tilida yozilgan 3-5 gap */}
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Gemini AI tomonidan avtomatik tayyorlangan — SOM va kapital nisbati, nisha perspektivi, asosiy xavflar
        </p>
        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {result.analysis_summary ? (
            <ReactMarkdown>{result.analysis_summary}</ReactMarkdown>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Tahlil mavjud emas.</span>
          )}
        </div>
      </Card>

      {/* ── Metodologiya (methodology_notes) ── */}
      <Card padding="md" className="glass-panel">
        <div style={{ cursor: 'pointer' }} onClick={() => setMethodologyOpen(!methodologyOpen)}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--text-muted)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>Metodologiya ma'lumotlari</h3>
            </div>
            {methodologyOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          {!methodologyOpen && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Bayesian birlashtirish og'irliklari, bottom-up / top-down TAM & SAM, hisob formulasi
            </p>
          )}
        </div>

        {methodologyOpen && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>

              {/* data_weight — bank tranzaksiya ma'lumotiga berilgan Bayesian og'irlik */}
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Umumiy Bayesian og'irlik (data_weight):
                </div>
                <div style={{ fontWeight: 500 }}>
                  {dataWeightPct}%
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    bank ma'lumotiga | {100 - dataWeightPct}% benchmarkga
                  </span>
                </div>
                <Note text={
                  dataWeightPct >= 70
                    ? 'Hisob asosan haqiqiy bank tranzaksiyalariga asoslangan'
                    : 'DB da kam tranzaksiya — hisob ko\'proq benchmarkka tayanmoqda'
                } />
              </div>

              {/* bayesian_weight_top_down — top-down (bank) ulushi, data_weight ning izoh nusxasi */}
              {bayesianTopDownPct !== null && (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Top-down ulushi (bank tranzaksiyalari):
                  </div>
                  <div style={{ fontWeight: 500 }}>
                    {bayesianTopDownPct}%
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                      | Bottom-up (benchmark): {100 - bayesianTopDownPct}%
                    </span>
                  </div>
                  <Note text="data_weight ning metodologiyadagi izoh ko'rinishi" />
                </div>
              )}

              {/* tam_bottom_up_uzs — benchmark usuli bilan hisoblangan TAM */}
              {result.methodology_notes?.tam_bottom_up_uzs && (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>TAM — Bottom-up (benchmark):</div>
                  <div style={{ fontWeight: 500 }}>{formatCurrency(result.methodology_notes.tam_bottom_up_uzs)}</div>
                  <Note text="Raqobatchilar soni × o'rtacha benchmark daromadi × 12 oy" />
                </div>
              )}

              {/* tam_top_down_uzs — bank tranzaksiyalaridan olingan TAM */}
              {result.methodology_notes?.tam_top_down_uzs && (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>TAM — Top-down (bank tranzaksiyalari):</div>
                  <div style={{ fontWeight: 500 }}>{formatCurrency(result.methodology_notes.tam_top_down_uzs)}</div>
                  <Note text="Haqiqiy bank to'lov ma'lumotlaridan olingan yillik aylanma" />
                </div>
              )}

              {/* sam_bottom_up_uzs — benchmark usuli bilan hisoblangan SAM */}
              {result.methodology_notes?.sam_bottom_up_uzs && (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SAM — Bottom-up (benchmark):</div>
                  <div style={{ fontWeight: 500 }}>{formatCurrency(result.methodology_notes.sam_bottom_up_uzs)}</div>
                  <Note text="Radius ichidagi raqobatchilar × benchmark daromadi × 12 oy" />
                </div>
              )}

              {/* sam_top_down_uzs — bank tranzaksiyalaridan olingan SAM */}
              {result.methodology_notes?.sam_top_down_uzs && (
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SAM — Top-down (bank tranzaksiyalari):</div>
                  <div style={{ fontWeight: 500 }}>{formatCurrency(result.methodology_notes.sam_top_down_uzs)}</div>
                  <Note text="Radius ichidagi bank to'lovlaridan olingan yillik aylanma" />
                </div>
              )}

              {/* market_share_formula — qanday hisoblangani aniq formulada */}
              {result.methodology_notes?.market_share_formula && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Bozor ulushi formulasi (SOM hisob asosi):
                  </div>
                  <div style={{
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    fontFamily: 'monospace',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    marginTop: '6px',
                    border: '1px solid var(--border)',
                  }}>
                    {result.methodology_notes.market_share_formula}
                  </div>
                  <Note text="1 / (radius_ichida_raqobatchilar + 1) × sifat_koeffitsiyenti — teng bo'linish asosida hisoblangan ulush" />
                </div>
              )}
            </div>

            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border)',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <span>📅 Hisob sanasi: <strong>{calcDate}</strong></span>
              <span>⚠ Barcha qiymatlar ±30% ishonch oralig'iga ega</span>
              {confidencePct < 40 && (
                <span style={{ color: 'var(--error)' }}>
                  ⚠ Ishonch darajasi past — natijalar taxminiy, ehtiyotkorlik tavsiya etiladi
                </span>
              )}
            </div>
          </div>
        )}
      </Card>

    </div>
  );
};

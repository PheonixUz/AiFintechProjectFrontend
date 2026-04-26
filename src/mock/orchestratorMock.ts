import type {
  BlockCode,
  BlockMockResult,
  ModuleMockResult,
  ModuleVerdict,
  OrchestratorInput,
  OrchestratorResult,
  OverallVerdict,
} from '../types/orchestrator.types';

// ─── Deterministic RNG (Mulberry32) ─────────────────────────────────────────

function hashString(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function makeRng(input: OrchestratorInput) {
  const seed = hashString(
    [
      input.niche,
      input.mcc_code,
      input.city,
      input.lat.toFixed(3),
      input.lon.toFixed(3),
      input.radius_m,
      input.capital_uzs,
      input.year,
    ].join('|'),
  );
  return mulberry32(seed);
}

// ─── Block metadata ─────────────────────────────────────────────────────────

export const BLOCKS: Record<BlockCode, { title: string; description: string }> = {
  A: {
    title: 'Bozor tahlili va hajmi',
    description: 'Ushbu nishada qancha pul aylanmoqda va yana bitta o\'yinchi sig\'adimi?',
  },
  B: {
    title: 'Prognoz va talab',
    description: 'Kelasi 1–3 yilda talab, daromad va raqobat qanday o\'zgaradi?',
  },
  C: {
    title: 'Lokatsiya va trafik',
    description: 'Tanlangan nuqta naqadar jozibali: trafik, ko\'rinish, qo\'shnilar, izoxron.',
  },
  D: {
    title: 'Moliyaviy hayotchanlik',
    description: 'Biznes moliyaviy jihatdan qutuladimi: qaytim, kassa, marja, sezgirlik.',
  },
  E: {
    title: 'Raqobat va risklar',
    description: 'Tahdidlar: kim raqobatchi, yopilish ehtimoli, kirish bariyerlari.',
  },
  F: {
    title: 'Kreditlash va bank mahsulotlari',
    description: 'Bank uchun qiymat: skoring, mahsulot tanlash, erta default signali.',
  },
  G: {
    title: 'Ijtimoiy profil va TA',
    description: 'Xaridor kim: demografiya, xatti-harakat, mikrozonalarda xarid kuchi.',
  },
};

// ─── Module catalog (35 modules) ────────────────────────────────────────────

interface ModuleMeta {
  code: string;
  name: string;
  algorithm: string;
  description: string;
  blockCode: BlockCode;
  metric: (ctx: MetricContext) => { label: string; value: string; trend?: 'up' | 'down' | 'flat' };
  details?: (ctx: MetricContext) => { label: string; value: string }[];
  bias?: (ctx: MetricContext) => number; // -20..+20 score bias
}

interface MetricContext {
  input: OrchestratorInput;
  score: number;
  rand: () => number;
  capitalMln: number;
  radiusKm: number;
}

function fmtUZS(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} trln UZS`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} mlrd UZS`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)} mln UZS`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)} ming UZS`;
  return `${n.toFixed(0)} UZS`;
}

function fmtPct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

function range(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min);
}

function intRange(rand: () => number, min: number, max: number): number {
  return Math.floor(range(rand, min, max + 1));
}

function trendFromScore(score: number): 'up' | 'down' | 'flat' {
  if (score >= 65) return 'up';
  if (score <= 45) return 'down';
  return 'flat';
}

const CATALOG: ModuleMeta[] = [
  // ── Block A: Market ──────────────────────────────────────────────────────
  {
    code: 'M-A1',
    name: 'Market Sizing',
    algorithm: 'Bayesian regressiya + bottom-up',
    description: 'TAM/SAM/SOM ni nisha va lokatsiya bo\'yicha hisoblaydi.',
    blockCode: 'A',
    bias: (c) => (c.capitalMln > 300 ? 5 : -3),
    metric: (c) => {
      const som = range(c.rand, 80, 1200) * 1e6;
      return { label: 'SOM (yillik ulush)', value: fmtUZS(som), trend: trendFromScore(c.score) };
    },
    details: (c) => {
      const som = range(c.rand, 80, 1200) * 1e6;
      const sam = som * range(c.rand, 4, 8);
      const tam = sam * range(c.rand, 3, 6);
      return [
        { label: 'TAM', value: fmtUZS(tam) },
        { label: 'SAM', value: fmtUZS(sam) },
        { label: 'SOM', value: fmtUZS(som) },
      ];
    },
  },
  {
    code: 'M-A2',
    name: 'GAP Analysis',
    algorithm: 'Normativ hisob',
    description: 'Norma va fakt o\'rtasidagi defitsit yoki to\'yinish.',
    blockCode: 'A',
    metric: (c) => {
      const gap = intRange(c.rand, -15, 25);
      return { label: gap >= 0 ? 'Defitsit (ta)' : 'Ortiqcha (ta)', value: `${Math.abs(gap)} ta nuqta` };
    },
  },
  {
    code: 'M-A3',
    name: 'Saturation Index',
    algorithm: 'Composite index',
    description: 'Nisha to\'yinish indeksi 0–100.',
    blockCode: 'A',
    metric: (c) => {
      const sat = intRange(c.rand, 20, 90);
      return { label: 'To\'yinish', value: `${sat}/100` };
    },
  },
  {
    code: 'M-A4',
    name: 'Wallet Share',
    algorithm: 'Ensembl regressiya',
    description: 'MCC kategoriyasida hamyon ulushi.',
    blockCode: 'A',
    metric: (c) => ({ label: 'Hamyon ulushi', value: fmtPct(range(c.rand, 1.5, 12)) }),
  },
  {
    code: 'M-A5',
    name: 'Niche Opportunity Score',
    algorithm: 'XGBoost + weighted scoring',
    description: 'Potentsial × (1 − to\'yinish).',
    blockCode: 'A',
    metric: (c) => ({ label: 'Imkoniyat skori', value: `${Math.round(c.score)}/100`, trend: trendFromScore(c.score) }),
  },
  {
    code: 'M-A6',
    name: 'Cross-Niche Cannibalization',
    algorithm: 'Graf tahlili MCC pattern',
    description: 'Qo\'shni nishalarga kannibalizatsiya ta\'siri.',
    blockCode: 'A',
    metric: (c) => ({ label: 'Ta\'sir darajasi', value: fmtPct(range(c.rand, 2, 18)) }),
  },

  // ── Block B: Forecast ────────────────────────────────────────────────────
  {
    code: 'M-B1',
    name: 'Demand Forecasting',
    algorithm: 'LSTM + Facebook Prophet',
    description: 'Nisha daromadini 12/24/36 oyga prognoz.',
    blockCode: 'B',
    metric: (c) => {
      const g = range(c.rand, -5, 35);
      return { label: '36 oy o\'sish', value: fmtPct(g), trend: g >= 0 ? 'up' : 'down' };
    },
    details: (c) => [
      { label: '12 oy', value: fmtPct(range(c.rand, -2, 15)) },
      { label: '24 oy', value: fmtPct(range(c.rand, 2, 25)) },
      { label: '36 oy', value: fmtPct(range(c.rand, 5, 35)) },
    ],
  },
  {
    code: 'M-B2',
    name: 'Seasonality Model',
    algorithm: 'STL dekompozitsiya + Fourier',
    description: 'Oylik indekslar: Ramazon, Navro\'z, to\'ylar.',
    blockCode: 'B',
    metric: (c) => {
      const peak = intRange(c.rand, 1, 12);
      const months = ['Yanv', 'Fev', 'Mart', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noya', 'Dek'];
      return { label: 'Cho\'qqi oyi', value: months[peak - 1] };
    },
  },
  {
    code: 'M-B3',
    name: 'Population Dynamics',
    algorithm: 'Kohorta-komponent',
    description: 'Demografik siljishlar 5 yilga.',
    blockCode: 'B',
    metric: (c) => ({ label: 'Aholi o\'sishi (5y)', value: fmtPct(range(c.rand, 1, 12)), trend: 'up' }),
  },
  {
    code: 'M-B4',
    name: 'Income Trend Forecast',
    algorithm: 'ARIMA + makro',
    description: 'Daromad va xarid kuchi prognozi.',
    blockCode: 'B',
    metric: (c) => {
      const g = range(c.rand, 3, 18);
      return { label: 'Daromad o\'sishi (3y)', value: fmtPct(g), trend: 'up' };
    },
  },
  {
    code: 'M-B5',
    name: 'MCC Trend Detector',
    algorithm: 'Changepoint (PELT)',
    description: 'O\'suvchi va tushuvchi kategoriyalar.',
    blockCode: 'B',
    metric: (c) => {
      const up = c.score >= 55;
      return { label: 'Trend', value: up ? 'O\'smoqda' : 'Stagnatsiya', trend: up ? 'up' : 'flat' };
    },
  },
  {
    code: 'M-B6',
    name: 'Business Registration Forecast',
    algorithm: 'Autoregressiv + XGBoost',
    description: 'Yangi raqobatchilar prognozi.',
    blockCode: 'B',
    metric: (c) => ({ label: 'Yangi raqobatchi (24oy)', value: `${intRange(c.rand, 3, 28)} ta` }),
  },

  // ── Block C: Location ────────────────────────────────────────────────────
  {
    code: 'M-C1',
    name: 'Location Score',
    algorithm: 'Vaznli composite',
    description: 'Lokatsiyaning jozibadorlik indeksi 0–100.',
    blockCode: 'C',
    metric: (c) => ({ label: 'Lokatsiya skori', value: `${Math.round(c.score)}/100`, trend: trendFromScore(c.score) }),
  },
  {
    code: 'M-C2',
    name: 'Traffic Scoring',
    algorithm: 'Gradient boosting + GPS',
    description: 'Piyoda va avto trafik soatlar bo\'yicha.',
    blockCode: 'C',
    metric: (c) => ({ label: 'O\'rtacha trafik', value: `${intRange(c.rand, 120, 2400)} / soat` }),
  },
  {
    code: 'M-C3',
    name: 'Isochrone Demand',
    algorithm: 'Tarmoq tahlili OSM',
    description: '5–10 daqiqa piyodalik ichidagi potensial.',
    blockCode: 'C',
    metric: (c) => ({ label: '10 daq. aholi', value: `${intRange(c.rand, 2000, 45000).toLocaleString('ru-RU')} kishi` }),
  },
  {
    code: 'M-C4',
    name: 'Street Vitality Index',
    algorithm: 'POI + ro\'yxatlar',
    description: 'Ko\'chadagi faol vitrinalar ulushi.',
    blockCode: 'C',
    metric: (c) => ({ label: 'Vitalit indeksi', value: `${intRange(c.rand, 35, 92)}/100` }),
  },
  {
    code: 'M-C5',
    name: 'Anchor Effect Model',
    algorithm: 'Spatial lag + gravity',
    description: 'Yirik anchor (bozor, TC) ta\'siri.',
    blockCode: 'C',
    metric: (c) => ({ label: 'Anchor bonusi', value: `+${fmtPct(range(c.rand, 3, 28))}` }),
  },
  {
    code: 'M-C6',
    name: 'Visibility Score',
    algorithm: 'Geometrik tahlil',
    description: 'Yo\'ldan va trotuardan ko\'rinish.',
    blockCode: 'C',
    metric: (c) => ({ label: 'Ko\'rinish', value: `${intRange(c.rand, 40, 95)}/100` }),
  },

  // ── Block D: Financial ───────────────────────────────────────────────────
  {
    code: 'M-D1',
    name: 'Viability Check',
    algorithm: 'Monte Carlo + fin. model',
    description: '2 yillik omon qolish ehtimoli.',
    blockCode: 'D',
    bias: (c) => (c.capitalMln >= 200 ? 6 : c.capitalMln < 50 ? -8 : 0),
    metric: (c) => {
      const survive = Math.max(25, Math.min(95, Math.round(c.score + range(c.rand, -5, 10))));
      return { label: 'Omon qolish (24oy)', value: `${survive}%`, trend: survive >= 65 ? 'up' : 'down' };
    },
    details: (c) => [
      { label: 'Break-even', value: `${intRange(c.rand, 4, 18)} oy` },
      { label: 'Runway', value: `${intRange(c.rand, 6, 22)} oy` },
      { label: 'Cash-out risk', value: fmtPct(range(c.rand, 5, 45)) },
    ],
  },
  {
    code: 'M-D2',
    name: 'Unit Economics',
    algorithm: 'Kohorta tahlil',
    description: 'LTV, CAC, payback, net margin.',
    blockCode: 'D',
    metric: (c) => ({ label: 'LTV / CAC', value: `${range(c.rand, 1.2, 4.8).toFixed(1)}×` }),
  },
  {
    code: 'M-D3',
    name: 'ROI Estimator',
    algorithm: 'DCF + regressiya',
    description: 'Qaytim muddati va NPV.',
    blockCode: 'D',
    metric: (c) => ({ label: 'Payback', value: `${intRange(c.rand, 10, 42)} oy` }),
  },
  {
    code: 'M-D4',
    name: 'Rental Burden',
    algorithm: 'Pog\'onali model',
    description: 'Ijara / daromad nisbati zonalari.',
    blockCode: 'D',
    metric: (c) => {
      const pct = range(c.rand, 6, 35);
      const zone = pct < 15 ? 'Yashil' : pct < 25 ? 'Sariq' : 'Qizil';
      return { label: `${zone} zona`, value: fmtPct(pct) };
    },
  },
  {
    code: 'M-D5',
    name: 'Cash Flow Simulator',
    algorithm: 'Monte Carlo + mavsumiylik',
    description: '24 oy kashflov, kassa uzilishlari.',
    blockCode: 'D',
    metric: (c) => ({ label: 'Kassa uzilishi', value: `${intRange(c.rand, 0, 5)} oy` }),
  },
  {
    code: 'M-D6',
    name: 'COGS & Margin',
    algorithm: 'Benchmark + D36',
    description: 'Tannarx va marja sanoat bo\'yicha.',
    blockCode: 'D',
    metric: (c) => ({ label: 'Yalpi marja', value: fmtPct(range(c.rand, 18, 58)) }),
  },

  // ── Block E: Competition ─────────────────────────────────────────────────
  {
    code: 'M-E1',
    name: 'Competitor Intelligence',
    algorithm: 'Spatial query + NLP',
    description: 'Raqobatchilar xaritasi, reyting, zaif nuqtalar.',
    blockCode: 'E',
    metric: (c) => ({ label: 'Raqobatchilar (1km)', value: `${intRange(c.rand, 3, 38)} ta` }),
  },
  {
    code: 'M-E2',
    name: 'Churn Prediction',
    algorithm: 'XGBoost (50K SMB)',
    description: '24 oy ichida yopilish ehtimoli.',
    blockCode: 'E',
    metric: (c) => {
      const ch = Math.max(8, Math.min(75, Math.round(100 - c.score + range(c.rand, -5, 5))));
      return { label: 'Churn (24oy)', value: `${ch}%`, trend: ch >= 40 ? 'down' : 'flat' };
    },
  },
  {
    code: 'M-E3',
    name: 'Regulatory Risk',
    algorithm: 'Qoidali + jarima tarixi',
    description: 'Tekshiruv va jarima xatarlari.',
    blockCode: 'E',
    metric: (c) => {
      const r = intRange(c.rand, 10, 80);
      return { label: 'Risk darajasi', value: `${r}/100` };
    },
  },
  {
    code: 'M-E4',
    name: 'Market Entry Barrier',
    algorithm: 'Composite index',
    description: 'Kirish bariyerlari: moliya, regulator, raqobat.',
    blockCode: 'E',
    metric: (c) => ({ label: 'Bariyer', value: `${intRange(c.rand, 20, 85)}/100` }),
  },
  {
    code: 'M-E5',
    name: 'Price Pressure',
    algorithm: 'Hedonic + elastiklik',
    description: 'Narx bosimi va optimal koridor.',
    blockCode: 'E',
    metric: (c) => ({ label: 'Narx bosimi', value: fmtPct(range(c.rand, 4, 28)) }),
  },

  // ── Block F: Credit ──────────────────────────────────────────────────────
  {
    code: 'M-F1',
    name: 'Credit Risk Score',
    algorithm: 'LightGBM',
    description: 'Mijoz × lokatsiya × nisha skoring.',
    blockCode: 'F',
    metric: (c) => ({ label: 'Skor', value: `${intRange(c.rand, 520, 820)}`, trend: trendFromScore(c.score) }),
  },
  {
    code: 'M-F2',
    name: 'Loan Sizing',
    algorithm: 'Regressiya (kashflov)',
    description: 'Optimal kredit summasi.',
    blockCode: 'F',
    metric: (c) => {
      const amt = (c.capitalMln * range(c.rand, 0.4, 1.8)) * 1e6;
      return { label: 'Tavsiya kredit', value: fmtUZS(amt) };
    },
  },
  {
    code: 'M-F3',
    name: 'DTI Predictor',
    algorithm: 'Vaqt qatori + regressiya',
    description: 'Debt-to-income 6/12/24 oyga.',
    blockCode: 'F',
    metric: (c) => ({ label: 'DTI (12oy)', value: fmtPct(range(c.rand, 18, 55)) }),
  },
  {
    code: 'M-F4',
    name: 'NPL Early Warning',
    algorithm: 'Isolation Forest + LSTM',
    description: 'Default\'dan 2–3 oy oldin signal.',
    blockCode: 'F',
    metric: (c) => ({ label: 'Erta signal', value: `${intRange(c.rand, 0, 4)} anomaliya` }),
  },
  {
    code: 'M-F5',
    name: 'Bank Product Recommender',
    algorithm: 'Collaborative filtering',
    description: 'Eng mos bank mahsuloti.',
    blockCode: 'F',
    metric: (c) => {
      const prods = ['Mikrokredit', 'Lizing', 'Overdraft', 'Kafolat', 'Trade Finance'];
      return { label: 'Tavsiya', value: prods[intRange(c.rand, 0, prods.length - 1)] };
    },
  },

  // ── Block G: Social ──────────────────────────────────────────────────────
  {
    code: 'M-G1',
    name: 'Customer Segment Profiler',
    algorithm: 'K-means / DBSCAN',
    description: 'TA segmentlari: yosh, daromad, xaridlar.',
    blockCode: 'G',
    metric: (c) => ({ label: 'Asosiy segment', value: `${intRange(c.rand, 25, 44)}–${intRange(c.rand, 45, 60)} yosh` }),
  },
  {
    code: 'M-G2',
    name: 'Day Population',
    algorithm: 'Gravity + GPS',
    description: 'Kunduzgi auditoriya: aholi + tranzit.',
    blockCode: 'G',
    metric: (c) => ({ label: 'Kunduzgi oqim', value: `${intRange(c.rand, 1500, 26000).toLocaleString('ru-RU')} kishi` }),
  },
  {
    code: 'M-G3',
    name: 'Consumer Behavior',
    algorithm: 'NLP MCC ketma-ketlik',
    description: 'Iste\'molchi turlari: premium, bargain.',
    blockCode: 'G',
    metric: (c) => {
      const types = ['Premium', 'O\'rta', 'Bargain hunter', 'Ertalabki', 'Kechki'];
      return { label: 'Dominant', value: types[intRange(c.rand, 0, types.length - 1)] };
    },
  },
  {
    code: 'M-G4',
    name: 'Brand Affinity',
    algorithm: 'Collaborative filtering',
    description: 'Tarmoq vs mustaqil nuqtalar sodiqligi.',
    blockCode: 'G',
    metric: (c) => ({ label: 'Tarmoq afzalligi', value: fmtPct(range(c.rand, 28, 78)) }),
  },
  {
    code: 'M-G5',
    name: 'Spending Power Index',
    algorithm: 'Spatial interpolation',
    description: 'Kvartal bo\'yicha xarid kuchi.',
    blockCode: 'G',
    metric: (c) => ({ label: 'Xarid kuchi', value: `${intRange(c.rand, 40, 92)}/100`, trend: trendFromScore(c.score) }),
  },
];

// ─── Scoring helpers ────────────────────────────────────────────────────────

function scoreToVerdict(score: number): ModuleVerdict {
  if (score >= 65) return 'positive';
  if (score >= 45) return 'neutral';
  return 'negative';
}

function overallVerdict(score: number): OverallVerdict {
  if (score >= 70) return 'GO';
  if (score >= 50) return 'CAUTION';
  return 'NO_GO';
}

function makeSummary(meta: ModuleMeta, verdict: ModuleVerdict): string {
  if (verdict === 'positive') return `${meta.name} natijasi ijobiy — nisha foydasiga ishlaydi.`;
  if (verdict === 'neutral') return `${meta.name} o\'rtacha natija bermoqda — ehtiyotkorlik talab etiladi.`;
  return `${meta.name} salbiy signal — alohida e\'tibor kerak.`;
}

// ─── Insights generation ────────────────────────────────────────────────────

function pick<T>(rand: () => number, arr: T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const i = Math.floor(rand() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

const RECOMMENDATION_POOL = [
  'Dastlabki 6 oylik kashflov rezervini kamida 3 oylik operatsion xarajatga teng tuting.',
  'Mavsumiy cho\'qqi oyida marketing byudjetini 1.5×ga oshiring.',
  'Raqobatchilarning zaif xizmat nuqtalariga qarshi pozitsiyalash shiorini tayyorlang.',
  'Ijara shartnomasini 12 oy emas, 36 oyga muzlatilgan narx bilan kelishing.',
  'Premium segmentga yo\'naltirilgan sodiqlik dasturini joriy qiling.',
  'POS qurilmalar orqali QR to\'lovni majburiy qilib, tranzaksiya ma\'lumotlarini yig\'ing.',
  'Kredit summasini unit economics\'ni buzmaydigan darajada cheklang.',
  'Kunduzgi oqim yuqori soatlar uchun alohida menyu / taklif tuzing.',
  'Eng yaqin anchor (bozor/TC) bilan kross-promo shartnoma tuzing.',
  'Narx siyosatini raqobatchilardan 5–8% past bo\'lishi bilan boshlang, so\'ng ko\'taring.',
];

const RISK_POOL = [
  'Nisha yuqori darajada to\'yingan — yangi o\'yinchi uchun ulush cheklangan.',
  'Ijara xarajatlari daromad prognoziga nisbatan yuqori.',
  'Raqobatchilar oqimi keyingi 24 oy ichida jiddiy o\'sishi mumkin.',
  'Mavsumiy tushish oylarida kassa uzilishi xavfi mavjud.',
  'Tekshiruv va litsenziya xatari o\'rtadan yuqori.',
  'Kredit yuki bo\'yicha DTI chegarasiga yaqin.',
  'Ko\'rinish (visibility) past — marketing xarajati o\'sadi.',
  'TA xarid kuchi radius ichida cheklangan.',
  'Narx bosimi raqobatchilar tomonidan yuqori.',
  'Anchor effekti zaif — trafik tabiiy ravishda past.',
];

const OPPORTUNITY_POOL = [
  'Daromad o\'sishi prognozi barqaror musbat zona.',
  'Kunduzgi oqim yuqori — B2B yoki biznes-lanch segment tayyor.',
  'Demografik ko\'rsatkichlar nisha foydasiga ishlaydi (yosh aholi).',
  'Raqobatchilar orasida NPS past — sifat orqali farqlanish imkoniyati.',
  'Bank mahsulotlari orqali oborot moliyalashni tez olish mumkin.',
  'Mikrozonada xarid kuchi o\'rtacha shahardan yuqori.',
  'Yangi ro\'yxatdan o\'tgan biznes o\'sishi past — oyna hali ochiq.',
  'Brend sodiqligi past — tarmoqqa kirish imkoniyati ochiq.',
  'Anchor POI\'lar radius ichida mavjud — tabiiy trafik bor.',
  'Mavsumiylik aniq — marketing kalendarini optimizatsiya qilish oson.',
];

function makeHeadline(input: OrchestratorInput, verdict: OverallVerdict, score: number): string {
  const niche = input.niche || `MCC ${input.mcc_code}`;
  if (verdict === 'GO') {
    return `${input.city} da «${niche}» nishasi uchun ${score} ball — loyiha umumiy baholashda ijobiy signal bermoqda. Asosiy bloklar kapitalingizga mos keladi.`;
  }
  if (verdict === 'CAUTION') {
    return `${input.city} da «${niche}» nishasi ${score} ball bilan chegaraviy zonada — loyiha potensiali bor, lekin moliyaviy va raqobat risklari alohida e\'tibor talab qiladi.`;
  }
  return `${input.city} da «${niche}» nishasi bo\'yicha ${score} ball — tavsiya etilmaydi. Bir nechta kritik blok bo\'yicha salbiy signal aniqlandi.`;
}

// ─── Main runner ────────────────────────────────────────────────────────────

export function computeOrchestratorResult(input: OrchestratorInput): OrchestratorResult {
  const started = performance.now();
  const rand = makeRng(input);
  const capitalMln = input.capital_uzs / 1e6;
  const radiusKm = input.radius_m / 1000;

  const modulesByBlock: Record<BlockCode, ModuleMockResult[]> = {
    A: [], B: [], C: [], D: [], E: [], F: [], G: [],
  };

  for (const meta of CATALOG) {
    const baseScore = 50 + (rand() - 0.5) * 60; // 20..80
    const biasCtx: MetricContext = { input, score: baseScore, rand, capitalMln, radiusKm };
    const bias = meta.bias ? meta.bias(biasCtx) : 0;
    const score = Math.max(10, Math.min(95, Math.round(baseScore + bias)));

    const ctx: MetricContext = { input, score, rand, capitalMln, radiusKm };
    const verdict = scoreToVerdict(score);

    const module: ModuleMockResult = {
      code: meta.code,
      name: meta.name,
      algorithm: meta.algorithm,
      description: meta.description,
      blockCode: meta.blockCode,
      score,
      verdict,
      keyMetric: meta.metric(ctx),
      summary: makeSummary(meta, verdict),
      details: meta.details ? meta.details(ctx) : undefined,
    };

    modulesByBlock[meta.blockCode].push(module);
  }

  const blocks: BlockMockResult[] = (Object.keys(BLOCKS) as BlockCode[]).map((code) => {
    const mods = modulesByBlock[code];
    const avg = Math.round(mods.reduce((s, m) => s + m.score, 0) / mods.length);
    return {
      code,
      title: BLOCKS[code].title,
      description: BLOCKS[code].description,
      score: avg,
      verdict: scoreToVerdict(avg),
      modules: mods,
    };
  });

  const overallScore = Math.round(blocks.reduce((s, b) => s + b.score, 0) / blocks.length);
  const verdict = overallVerdict(overallScore);

  const recommendations = pick(rand, RECOMMENDATION_POOL, 5);
  const topRisks = pick(rand, RISK_POOL, 5);
  const topOpportunities = pick(rand, OPPORTUNITY_POOL, 5);

  return {
    input,
    overallScore,
    verdict,
    blocks,
    recommendations,
    topRisks,
    topOpportunities,
    headline: makeHeadline(input, verdict, overallScore),
    generatedAt: new Date().toISOString(),
    runtimeMs: Math.round(performance.now() - started),
  };
}

export function runOrchestratorMock(
  input: OrchestratorInput,
  opts?: { minDelayMs?: number; maxDelayMs?: number },
): Promise<OrchestratorResult> {
  const min = opts?.minDelayMs ?? 1500;
  const max = opts?.maxDelayMs ?? 2500;
  const delay = Math.round(min + Math.random() * (max - min));
  return new Promise((resolve) => {
    setTimeout(() => resolve(computeOrchestratorResult(input)), delay);
  });
}

# 📋 Loyihani Amalga Oshirish Rejasi

## AI Fintech Platform — Frontend Implementation Plan (TypeScript)

---

## 🎯 Umumiy Strategiya

Loyiha **bosqichma-bosqich** (incremental) yondashuv bilan amalga oshiriladi.
Birinchi bo'lib **M-A1 (Market Sizing)** moduli to'liq ishlaydi, keyin qolgan modullar qo'shiladi.
Loyiha **TypeScript** tilida yoziladi — barcha komponentlar `.tsx`, barcha modullar `.ts`.

---

## 📅 Bosqich 1: Loyiha Asosi (Foundation)

### 1.1 Vite + React + TypeScript loyiha yaratish
- [ ] `npx create-vite` bilan React + TypeScript loyiha init (`--template react-ts`)
- [ ] Folder structure yaratish (`src/api/`, `src/components/`, `src/types/`, etc.)
- [ ] Path alias sozlash (`@/` → `src/`) — `tsconfig.json` + `vite.config.ts`
- [ ] `.env.example` yaratish

### 1.2 Asosiy paketlarni o'rnatish
```
react-router-dom                — Routing
axios                           — HTTP client
@tanstack/react-query           — Server state management
zustand                         — Client state management
recharts                        — Charts
react-leaflet leaflet           — Maps
@types/leaflet                  — Leaflet type definitions
lucide-react                    — Icons
```

### 1.3 Design System — `index.css`
- [ ] CSS Variables (ranglar, shriftlar, spacing, border-radius)
- [ ] Dark theme tokens
- [ ] Glassmorphism utility classes
- [ ] Animation keyframes (fadeIn, slideUp, pulse)
- [ ] Typography scale (h1-h6, body, caption)
- [ ] Responsive breakpoints

---

## 📅 Bosqich 2: Infrastruktura (Core Layer)

### 2.1 Type Definitions (`src/types/`)
- [ ] `api.types.ts` — Barcha API request/response interfeyslari
  - `MarketSizingRequest`, `MarketSizingResponse`
  - `MCCCategoryOut`, `BenchmarkOut`, `CompetitorOut`, `CompetitorListOut`
  - `TransactionSummaryOut`, `TransactionMonthOut`
  - `PopulationListOut`, `PopulationZoneOut`
  - `POIListOut`, `POIOut`
  - `CustomerSegmentListOut`, `CustomerSegmentOut`
  - `MarketEstimateOut`
  - `HTTPValidationError`, `ValidationError`
- [ ] `market.types.ts` — Market sizing feature types
- [ ] `geo.types.ts` — Geo/location types (LatLng, Bounds, etc.)
- [ ] `ui.types.ts` — Component prop interfaces

### 2.2 API Layer
- [ ] `httpClient.ts` — Axios instance + interceptors + error handling
- [ ] `config/api.ts` — Base URL, endpoint constants
- [ ] Har bir endpoint uchun API service fayli (11 ta, `.ts`)

### 2.3 Custom Hooks
- [ ] `useNiches()` — Niche ro'yxatini olish (React Query)
- [ ] `useBenchmarks(city, mcc)` — Benchmark data
- [ ] `useCompetitors(niche, lat, lon, radius)` — Raqobatchilar
- [ ] `useTransactions(mcc, city, year)` — Tranzaksiya stats
- [ ] `usePopulation(lat, lon, radius)` — Aholi zonalari
- [ ] `usePOI(lat, lon, radius)` — Points of Interest
- [ ] `useCustomerSegments(lat, lon, radius)` — Mijoz segmentlari
- [ ] `useMarketEstimates(niche, city)` — Saqlangan tahminlar
- [ ] `useMarketSizing()` — Market sizing mutation (POST)

### 2.4 State Management (Zustand)
- [ ] `analysisStore.ts` — tanlangan niche, lokatsiya, radius, natijalar
- [ ] `uiStore.ts` — sidebar holati, theme, loading states

### 2.5 Utility Functions
- [ ] `formatCurrency(amount: number): string` — "1.2 mlrd so'm"
- [ ] `formatNumber(n: number): string` — "12.5K", "3.2M"
- [ ] `geoUtils.ts` — distance calculation, bounds
- [ ] `validators.ts` — form validation

---

## 📅 Bosqich 3: UI Komponentlar

### 3.1 Layout Components
- [ ] `AppLayout.tsx` — sidebar + main content grid
- [ ] `Sidebar.tsx` — navigation (A-G bloklar), logo, collapsible
- [ ] `TopBar.tsx` — title, breadcrumbs, theme toggle

### 3.2 UI Primitives
- [ ] `Button.tsx` — primary, secondary, ghost, loading variants
- [ ] `Card.tsx` — glassmorphism card, hover glow effect
- [ ] `Input.tsx` — labeled input, error state, icon support
- [ ] `Select.tsx` — searchable dropdown
- [ ] `Slider.tsx` — radius slider (100m — 10km)
- [ ] `Badge.tsx` — status badges (confidence: low/med/high)
- [ ] `Modal.tsx` — overlay dialog
- [ ] `Loader.tsx` — skeleton loading + spinner
- [ ] `AnimatedCounter.tsx` — animated number counting effect

### 3.3 Chart Components
- [ ] `TAMSAMSOMChart.tsx` — funnel yoki stacked bar (TAM > SAM > SOM)
- [ ] `MonthlyTrendChart.tsx` — area/line chart (12 oylik trend)
- [ ] `CompetitorDistribution.tsx` — donut chart
- [ ] `BenchmarkRadar.tsx` — radar chart (revenue, margin, growth)
- [ ] `PopulationBar.tsx` — horizontal bar (population zones)
- [ ] `SegmentDonut.tsx` — customer segments pie
- [ ] `ConfidenceGauge.tsx` — gauge 0-100
- [ ] `GrowthSparkline.tsx` — mini trend line

### 3.4 Map Components
- [ ] `MapContainer.tsx` — Leaflet map, Tashkent centered
- [ ] `RadiusCircle.tsx` — dynamic radius overlay
- [ ] `CompetitorMarkers.tsx` — raqobatchi markerlar
- [ ] `POIMarkers.tsx` — POI markerlar (masjid, maktab, bozor)
- [ ] `HeatmapLayer.tsx` — aholi/xarajat issiqlik xaritasi

### 3.5 Shared Components
- [ ] `NicheSelector.tsx` — MCC search + category filter
- [ ] `CitySelector.tsx` — Tashkent, Samarqand, etc.
- [ ] `LocationPicker.tsx` — xaritadan nuqta tanlash
- [ ] `RadiusControl.tsx` — slider + raqamli input
- [ ] `MetricCard.tsx` — icon + label + value + trend

---

## 📅 Bosqich 4: M-A1 Market Sizing Feature

### 4.1 MarketSizingForm
- [ ] Niche tanlash (NicheSelector orqali)
- [ ] Xaritadan lokatsiya tanlash (click → lat/lon)
- [ ] Radius sozlash (slider 100m — 10km)
- [ ] Shahar tanlash
- [ ] Boshlang'ich kapital kiritish (UZS)
- [ ] Yil tanlash
- [ ] "Tahlil qilish" button (loading state bilan)

### 4.2 MarketSizingResults
- [ ] TAM / SAM / SOM funnel chart + confidence intervals
- [ ] Market share %, growth rate %, gross margin %
- [ ] Confidence score gauge
- [ ] Analysis summary (AI generated text)
- [ ] Methodology notes

### 4.3 Supporting Sections
- [ ] `CompetitorSection` — xaritada raqobatchilar + jadval
- [ ] `BenchmarkSection` — sanoat benchmarklari radar chart
- [ ] `PopulationSection` — aholi zonalari bar chart
- [ ] `TransactionSection` — oylik tranzaksiya trend chart
- [ ] `CustomerSegmentSection` — segment donut + jadval
- [ ] `AnalysisSummary` — AI tahlil xulosa matni

### 4.4 Export
- [ ] PDF export (natijalar + chartlar)
- [ ] CSV export (raw data)

---

## 📅 Bosqich 5: Sahifalar va Routing

### 5.1 Routing sozlash
```
/                     → DashboardPage
/market-sizing        → MarketSizingPage
/data-explorer        → DataExplorerPage
/history              → HistoryPage
*                     → NotFoundPage
```

### 5.2 Dashboard Page
- [ ] Hero section — platformaning qisqacha tavsifi
- [ ] Bloklar grid — 7 ta blok kartochkalari (A-G)
- [ ] Tezkor "Market Sizing" havolasi
- [ ] Oxirgi tahlillar ro'yxati (agar mavjud)
- [ ] System health status

### 5.3 Market Sizing Page
- [ ] 2-column layout: chap — forma, o'ng — xarita
- [ ] Natijalar qismi: pastda, full-width sections
- [ ] Scroll animations

### 5.4 Data Explorer Page
- [ ] Tab-based: Niches | Benchmarks | Competitors | Transactions
- [ ] Filter + search
- [ ] Table view

### 5.5 History Page
- [ ] Saqlangan market estimates ro'yxati
- [ ] Filter by niche, city, date
- [ ] Click → batafsil ko'rish

---

## 📅 Bosqich 6: Polish va Optimization

### 6.1 UX Polish
- [ ] Skeleton loading states (har bir section uchun)
- [ ] Error states (API xato, no data)
- [ ] Empty states (hali tahlil qilinmagan)
- [ ] Toast notifications
- [ ] Smooth page transitions

### 6.2 Performance
- [ ] React.lazy + Suspense (code splitting)
- [ ] Chart komponentlarni lazy load
- [ ] Map lazy loading
- [ ] React Query cache sozlash (staleTime, cacheTime)

### 6.3 Responsive Design
- [ ] Desktop (1440px+) — full layout
- [ ] Tablet (768px-1439px) — collapsed sidebar
- [ ] Mobile uchun — keyinchalik

### 6.4 TypeScript Strict Mode
- [ ] `strict: true` — barcha strict tekshiruvlar yoqilgan
- [ ] `noImplicitAny` — barcha tiplar aniq belgilangan
- [ ] `strictNullChecks` — null/undefined tekshiruvi

---

## 🔄 Keyingi Bosqichlar (Roadmap)

| Tartib | Model | Tavsif |
|--------|-------|--------|
| 2 | M-A2 | GAP Analysis |
| 3 | M-A3 | Saturation Index |
| 4 | M-C1 | Location Score |
| 5 | M-D1 | Viability Check |
| 6 | M-E1 | Competitor Intelligence |
| 7 | M-B1 | Demand Forecasting |

---

## 📐 Arxitektura Qarorlari

### Nima uchun TypeScript?
- Compile-time xatolarni ushlab olish
- IDE autocomplete va refactoring qulayligi
- API response type-safety — backend schema bilan sinxron

### Nima uchun Zustand?
- Redux'ga qaraganda soddaroq, kamroq boilerplate
- React Query bilan yaxshi ishlaydi (server state → RQ, client state → Zustand)
- TypeScript bilan mukammal integratsiya

### Nima uchun Vanilla CSS?
- To'liq nazorat, Tailwind dependency yo'q
- CSS Variables orqali theme tizimi

### Nima uchun Recharts?
- React-native charting library, TypeScript support
- Responsive, customizable, declarative API

### Nima uchun React Leaflet?
- Bepul, open-source map
- OpenStreetMap tiles — Google Maps kaliti shart emas

---

## ⚠️ Muhim Eslatmalar

1. **API Base URL** — `.env` orqali boshqariladi, hardcode qilinmasin
2. **UZS formatlash** — Backend `Decimal` string qaytaradi, frontend `parseFloat` qilishi kerak
3. **Koordinatalar** — Tashkent default: `lat=41.2995, lon=69.2401`
4. **MCC kodlar** — 4 raqamli string (e.g., `"5812"`)
5. **Radius** — metrda, `min=100`, `max=10000`
6. **Type definitions** — `api_docs.json` dagi schema → `src/types/api.types.ts`

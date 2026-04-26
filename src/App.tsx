import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { MarketSizingPage } from './pages/MarketSizingPage';
import { DemandForecastPage } from './pages/DemandForecastPage';
import { ViabilityCheckPage } from './pages/ViabilityCheckPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="market-sizing" element={<MarketSizingPage />} />
        <Route path="demand-forecast" element={<DemandForecastPage />} />
        <Route path="viability-check" element={<ViabilityCheckPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

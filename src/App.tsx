import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from './pages/DashboardPage';
import DetailPage from './pages/DetailPage';
import ComparisonPage from './pages/ComparisonPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/SwissSnowWeather">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/resort/:id" element={<DetailPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MapView from './pages/Map';
import Alerts from './pages/Alerts';
import Diagnosis from './pages/Diagnosis';
import Prices from './pages/Prices';
import AIAssistant from './pages/AIAssistant';
import Shopping from './pages/Shopping';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="agrin-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="diagnosis" element={<Diagnosis />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="map" element={<MapView />} />
            <Route path="profile" element={<Prices />} />
            <Route path="shopping" element={<Shopping />} />
            <Route path="ai" element={<AIAssistant />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

import { AlertTriangle, Droplets, Wind, Sun, Thermometer, Bug, Snowflake } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Alerts() {
  return (
    <div className="flex flex-col gap-6 pt-16 md:pt-8 px-4 md:px-8 max-w-5xl mx-auto pb-12">
      <header className="md:hidden fixed top-0 left-0 w-full bg-surface z-30 h-14 flex items-center px-4 border-b border-border">
         <span className="font-bold text-primary text-lg">Agriculture with DL</span>
      </header>

      <div>
        <h1 className="text-3xl font-semibold text-primary">Alerts & Risks</h1>
      </div>

      {/* High Priority Alert Card */}
      <div className="bg-[#ffdad6] border border-[#ba1a1a] rounded-2xl p-6 flex items-start gap-4 shadow-sm">
        <AlertTriangle className="w-8 h-8 text-[#ba1a1a] shrink-0" fill="currentColor" />
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-[#93000a] mb-1">Thunderstorm Alert</h2>
          <p className="text-sm text-[#414844] mb-3">Severe thunderstorm expected in 45 minutes. High winds and heavy rainfall likely.</p>
          <div className="bg-surface/80 rounded-xl p-3 border border-red-200 flex items-center gap-2">
            <span className="text-sm font-semibold text-[#7f5539]">Suggested Action: Cover young seedlings immediately.</span>
          </div>
        </div>
      </div>

      {/* Weather Climate Section */}
      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">Weather Climate</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
            <Droplets className="w-7 h-7 text-primary" />
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Humidity</p>
              <p className="text-2xl font-bold text-primary">82%</p>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
            <Wind className="w-7 h-7 text-[#1b4332]" />
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Wind Speed</p>
              <p className="text-2xl font-bold text-primary">24 km/h</p>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
            <Sun className="w-7 h-7 text-[#7f5539]" />
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">UV Index</p>
              <p className="text-2xl font-bold text-primary">Mod (5)</p>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
            <Thermometer className="w-7 h-7 text-red-600" />
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Temp</p>
              <p className="text-2xl font-bold text-primary">28°C</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Risk Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-primary mb-4">Crop Risk Alerts</h3>
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#f2bb98]/40 flex items-center justify-center shrink-0">
                <Bug className="w-6 h-6 text-[#795035]" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-primary">High Pest Risk (Aphids)</h4>
                <p className="text-sm text-text-muted">High humidity levels increase aphid proliferation.</p>
              </div>
              <button className="bg-[#7f5539] text-on-primary px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">Details</button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Snowflake className="w-6 h-6 text-text-muted" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-primary">Low Frost Risk</h4>
                <p className="text-sm text-text-muted">Temperatures remain above critical thresholds.</p>
              </div>
              <button className="border border-border text-text-muted px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">Details</button>
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div>
          <h3 className="text-xl font-semibold text-primary mb-4">Recent Alerts</h3>
          <div className="bg-surface border border-border rounded-2xl shadow-sm">
            <ul className="flex flex-col">
              <li className="flex items-start gap-4 p-4 border-b border-slate-100">
                <Droplets className="w-5 h-5 text-[#1b4332] mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary">Heavy Rainfall Warning</p>
                  <p className="text-xs text-text-muted">Yesterday, 14:30</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4 border-b border-slate-100">
                <Wind className="w-5 h-5 text-[#7f5539] mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary">High Wind Advisory</p>
                  <p className="text-xs text-text-muted">Oct 24, 09:15</p>
                </div>
              </li>
              <li className="flex items-start gap-4 p-4">
                <Thermometer className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary">Extreme Heat Warning</p>
                  <p className="text-xs text-text-muted">Oct 20, 11:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import { AlertTriangle, Droplets, Wind, Sun, Thermometer, Bug, Snowflake, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Alerts() {
  // Use state to manage alerts so it's not permanently hardcoded to a thunderstorm
  const [activeAlert, setActiveAlert] = useState<{title: string, desc: string, action: string, type: 'danger' | 'warning' | 'info'} | null>(null);
  
  // Weather state
  const [weather, setWeather] = useState<{ temp: number, humidity: number, wind: number, uv: number } | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  // Modal state
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          // Free weather API using current location
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=uv_index_max&timezone=auto`);
          const data = await res.json();
          if (mounted) {
            setWeather({
              temp: data.current.temperature_2m,
              humidity: data.current.relative_humidity_2m,
              wind: data.current.wind_speed_10m,
              uv: data.daily.uv_index_max[0] || 0
            });
          }
        } catch (e) {
          console.error(e);
        } finally {
          if (mounted) setIsLoadingWeather(false);
        }
      }, () => {
        if (mounted) setIsLoadingWeather(false);
      });
    } else {
      setIsLoadingWeather(false);
    }
    return () => { mounted = false; };
  }, []);

  const getUVSeverity = (uv: number) => {
    if (uv <= 2) return `Low (${uv})`;
    if (uv <= 5) return `Mod (${uv})`;
    if (uv <= 7) return `High (${uv})`;
    return `Extreme (${uv})`;
  };

  return (
    <div className="flex flex-col gap-6 pt-16 md:pt-8 px-4 md:px-8 max-w-5xl mx-auto pb-12">
      <header className="md:hidden fixed top-0 left-0 w-full bg-surface z-30 h-14 flex items-center px-4 border-b border-border">
         <span className="font-bold text-primary text-lg">Agriculture with DL</span>
      </header>

      <div>
        <h1 className="text-3xl font-semibold text-primary">Alerts & Risks</h1>
      </div>

      {/* High Priority Alert Card */}
      {activeAlert ? (
        <div className={`border rounded-2xl p-6 flex items-start gap-4 shadow-sm ${
          activeAlert.type === 'danger' ? 'bg-[#ffdad6] border-[#ba1a1a]' : 'bg-orange-50 border-orange-200'
        }`}>
          <AlertTriangle className={`w-8 h-8 shrink-0 ${activeAlert.type === 'danger' ? 'text-[#ba1a1a]' : 'text-orange-500'}`} fill="currentColor" />
          <div className="flex-1">
            <h2 className={`text-xl font-semibold mb-1 ${activeAlert.type === 'danger' ? 'text-[#93000a]' : 'text-orange-800'}`}>
              {activeAlert.title}
            </h2>
            <p className="text-sm text-[#414844] mb-3">{activeAlert.desc}</p>
            {activeAlert.action && (
              <div className="bg-surface/80 rounded-xl p-3 border border-red-200 flex items-center gap-2">
                <span className="text-sm font-semibold text-[#7f5539]">Suggested Action: {activeAlert.action}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-[#c4eed0] border border-[#0f5223] rounded-2xl p-6 flex items-center gap-4 shadow-sm">
          <CheckCircle className="w-8 h-8 text-[#0f5223] shrink-0" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#0f5223] mb-1">No Active Severe Alerts</h2>
            <p className="text-sm text-[#0f5223]">Weather and crop conditions are stable. No immediate actions required.</p>
          </div>
        </div>
      )}

      {/* Weather Climate Section */}
      <div>
        <h3 className="text-xl font-semibold text-primary mb-4">Weather Climate</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
            <Droplets className="w-7 h-7 text-primary" />
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Humidity</p>
              <p className="text-2xl font-bold text-primary">
                {isLoadingWeather ? '--' : weather ? `${weather.humidity}%` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
            <Wind className="w-7 h-7 text-[#1b4332]" />
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Wind Speed</p>
              <p className="text-2xl font-bold text-primary">
                 {isLoadingWeather ? '--' : weather ? `${weather.wind} km/h` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
            <Sun className="w-7 h-7 text-[#7f5539]" />
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">UV Index</p>
              <p className="text-2xl font-bold text-primary">
                {isLoadingWeather ? '--' : weather ? getUVSeverity(weather.uv) : 'N/A'}
              </p>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[120px]">
            <Thermometer className="w-7 h-7 text-red-600" />
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Temp</p>
              <p className="text-2xl font-bold text-primary">
                 {isLoadingWeather ? '--' : weather ? `${weather.temp}°C` : 'N/A'}
              </p>
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
              <button 
                onClick={() => setSelectedRisk('aphids')}
                className="bg-[#7f5539] text-on-primary px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                Details
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Snowflake className="w-6 h-6 text-text-muted" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-primary">Low Frost Risk</h4>
                <p className="text-sm text-text-muted">Temperatures remain above critical thresholds.</p>
              </div>
              <button 
                onClick={() => setSelectedRisk('frost')}
                className="border border-border text-text-muted px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                Details
              </button>
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

      {/* Details Modal */}
      {selectedRisk && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRisk(null)}>
          <div className="bg-surface rounded-3xl p-6 max-w-md w-full relative shadow-xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedRisk(null)} 
              className="absolute top-4 right-4 text-text-muted hover:text-primary transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-1.5"
            >
               <X className="w-5 h-5" />
            </button>
            
            {selectedRisk === 'aphids' && (
               <>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#f2bb98]/40 flex items-center justify-center shrink-0">
                      <Bug className="w-5 h-5 text-[#795035]" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">Pest Risk: Aphids</h3>
                 </div>
                 <p className="text-[#414844] mb-5 text-sm leading-relaxed">
                    High humidity levels and current temperatures have created an ideal environment for aphid proliferation. Aphids can rapidly multiply and drain plant sap, stunting growth and transmitting viral diseases.
                 </p>
                 <div className="bg-[#f2bb98]/10 rounded-xl p-4 border border-[#f2bb98]/30">
                   <h4 className="font-semibold text-[#795035] mb-2 text-sm">Recommended Actions:</h4>
                   <ul className="list-disc pl-5 text-sm text-[#414844] flex flex-col gap-1.5">
                     <li>Inspect the undersides of leaves and new growth immediately.</li>
                     <li>Apply neem oil or insecticidal soap if aphid clusters are spotted.</li>
                     <li>Avoid over-fertilizing with nitrogen, which promotes vulnerable leafy growth.</li>
                   </ul>
                 </div>
               </>
            )}

            {selectedRisk === 'frost' && (
               <>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Snowflake className="w-5 h-5 text-text-muted" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">Low Frost Risk</h3>
                 </div>
                 <p className="text-[#414844] mb-5 text-sm leading-relaxed">
                    Temperatures currently remain above critical freezing thresholds. Based on the 7-day forecast, frost damage is highly unlikely.
                 </p>
                 <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                   <h4 className="font-semibold text-primary mb-2 text-sm">Status:</h4>
                   <ul className="list-disc pl-5 text-sm text-[#414844] flex flex-col gap-1.5">
                     <li>No protective covers needed tonight.</li>
                     <li>Continue standard irrigation schedules.</li>
                   </ul>
                 </div>
               </>
            )}
            
            <div className="mt-6 flex justify-end">
               <button 
                 onClick={() => setSelectedRisk(null)}
                 className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-fixed transition-colors"
               >
                 Close
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

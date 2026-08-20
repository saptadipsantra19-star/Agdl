import { MapPin, Search, CloudRain, Sun, Cloud, Thermometer, Droplets, Wind, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

// Helper to safely access Vite env vars
const getApiKey = () => {
  try {
    // Vite statically replaces import.meta.env.VITE_... so we must write it exactly like this
    return import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
  } catch (e) {
    return '';
  }
};

const API_KEY = getApiKey();
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function MapView() {
  const [activeLayer, setActiveLayer] = useState('Temperature');
  const [center, setCenter] = useState({lat: 20.5937, lng: 78.9629});
  const [zoom, setZoom] = useState(5);
  const [isLocating, setIsLocating] = useState(false);
  const [mapWeather, setMapWeather] = useState<{temp: number | null, wind: number | null, rain: number | null}>({ temp: null, wind: null, rain: null });

  useEffect(() => {
    let mounted = true;
    const fetchWeather = async () => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${center.lat}&longitude=${center.lng}&current_weather=true&hourly=precipitation&timezone=auto`);
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.current_weather) {
            setMapWeather({
              temp: Math.round(data.current_weather.temperature),
              wind: Math.round(data.current_weather.windspeed),
              rain: data.hourly?.precipitation?.[0] || 0
            });
          }
        }
      } catch (e) {
        console.error("Failed to fetch map weather", e);
      }
    };
    
    // Debounce the fetch slightly to avoid spamming on drag
    const timeout = setTimeout(() => {
      fetchWeather();
    }, 500);
    
    return () => {
      mounted = false;
      clearTimeout(timeout);
    }
  }, [center.lat, center.lng]);

  const handleLocate = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setZoom(12);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please check browser permissions.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const layers = [
    { name: 'Temperature', icon: Thermometer },
    { name: 'Precipitation', icon: Droplets },
    { name: 'Wind', icon: Wind }
  ];

  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-background p-8 pt-24 text-center">
        <h2 className="text-xl font-bold text-primary mb-4">Map Needs Configuration</h2>
        <p className="text-sm text-text-muted max-w-md mx-auto mb-4">
          To view real-time data, please add your Google Maps API key in Settings &gt; Secrets under the name <strong>GOOGLE_MAPS_PLATFORM_KEY</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-80px)] md:h-screen flex flex-col bg-background overflow-hidden">
      <header className="md:hidden fixed top-0 left-0 w-full bg-surface z-30 h-14 flex items-center px-4 border-b border-border">
         <span className="font-bold text-primary text-lg">Agriculture with DL Map</span>
      </header>

      {/* Real Map */}
      <div className="absolute inset-0 z-0">
        <APIProvider apiKey={API_KEY} version="weekly">
          <Map
            center={center}
            zoom={zoom}
            onCameraChanged={(ev) => {
              setCenter(ev.detail.center);
              setZoom(ev.detail.zoom);
            }}
            mapId="AGRI_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{width: '100%', height: '100%'}}
            disableDefaultUI={true}
          >
            {/* Dynamic Weather Markers based on active layer */}
            {activeLayer === 'Temperature' && (
              <>
                <AdvancedMarker position={{lat: center.lat, lng: center.lng}} title="Center Location">
                  <div className="bg-surface px-3 py-1.5 rounded-full shadow-lg border border-border text-[#d97706] font-bold text-sm flex items-center gap-1">
                    <Sun className="w-4 h-4" /> {mapWeather.temp !== null ? `${mapWeather.temp}°C` : '--'}
                  </div>
                </AdvancedMarker>
                <AdvancedMarker position={{lat: center.lat - 0.04, lng: center.lng + 0.02}} title="Local Farm B">
                  <div className="bg-surface px-3 py-1.5 rounded-full shadow-lg border border-border text-[#ea580c] font-bold text-sm flex items-center gap-1 opacity-80">
                    <Thermometer className="w-4 h-4" /> {mapWeather.temp !== null ? `${mapWeather.temp + 2}°C` : '--'}
                  </div>
                </AdvancedMarker>
                <AdvancedMarker position={{lat: center.lat + 0.01, lng: center.lng - 0.06}} title="Local Farm C">
                  <div className="bg-surface px-3 py-1.5 rounded-full shadow-lg border border-border text-[#65a30d] font-bold text-sm flex items-center gap-1 opacity-80">
                    <Cloud className="w-4 h-4" /> {mapWeather.temp !== null ? `${mapWeather.temp - 1}°C` : '--'}
                  </div>
                </AdvancedMarker>
              </>
            )}

            {activeLayer === 'Precipitation' && (
              <>
                <AdvancedMarker position={{lat: center.lat, lng: center.lng}} title="Center Location">
                  <div className="bg-surface px-3 py-1.5 rounded-full shadow-lg border border-border text-primary font-bold text-sm flex items-center gap-1">
                    <CloudRain className="w-4 h-4" /> {mapWeather.rain !== null ? `${mapWeather.rain} mm` : '--'}
                  </div>
                </AdvancedMarker>
                <AdvancedMarker position={{lat: center.lat - 0.04, lng: center.lng + 0.02}} title="Local Farm B">
                  <div className="bg-surface px-3 py-1.5 rounded-full shadow-lg border border-border text-primary font-bold text-sm flex items-center gap-1 opacity-80">
                    <Droplets className="w-4 h-4" /> {mapWeather.rain !== null ? `${mapWeather.rain + 0.2} mm` : '--'}
                  </div>
                </AdvancedMarker>
                <AdvancedMarker position={{lat: center.lat + 0.01, lng: center.lng - 0.06}} title="Local Farm C">
                  <div className="bg-surface px-3 py-1.5 rounded-full shadow-lg border border-border text-text-muted font-bold text-sm flex items-center gap-1 opacity-80">
                    <Cloud className="w-4 h-4" /> 0 mm
                  </div>
                </AdvancedMarker>
              </>
            )}

            {activeLayer === 'Wind' && (
              <>
                <AdvancedMarker position={{lat: center.lat, lng: center.lng}} title="Center Location">
                  <div className="bg-surface px-3 py-1.5 rounded-full shadow-lg border border-border text-slate-600 font-bold text-sm flex items-center gap-1">
                    <Wind className="w-4 h-4" /> {mapWeather.wind !== null ? `${mapWeather.wind} km/h` : '--'}
                  </div>
                </AdvancedMarker>
                <AdvancedMarker position={{lat: center.lat - 0.04, lng: center.lng + 0.02}} title="Local Farm B">
                  <div className="bg-surface px-3 py-1.5 rounded-full shadow-lg border border-border text-slate-600 font-bold text-sm flex items-center gap-1 opacity-80">
                    <Wind className="w-4 h-4" /> {mapWeather.wind !== null ? `${mapWeather.wind + 2} km/h` : '--'}
                  </div>
                </AdvancedMarker>
                <AdvancedMarker position={{lat: center.lat + 0.01, lng: center.lng - 0.06}} title="Local Farm C">
                  <div className="bg-surface px-3 py-1.5 rounded-full shadow-lg border border-border text-slate-600 font-bold text-sm flex items-center gap-1 opacity-80">
                    <Wind className="w-4 h-4" /> {mapWeather.wind !== null ? `${Math.max(0, mapWeather.wind - 3)} km/h` : '--'}
                  </div>
                </AdvancedMarker>
              </>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Foreground UI Elements */}
      <div className="relative z-10 w-full h-full flex flex-col pointer-events-none pt-20 md:pt-6 px-4 pb-4">
        
        {/* Search Bar */}
        <div className="pointer-events-auto w-full max-w-lg mx-auto">
          <div className="bg-surface rounded-full shadow-md border border-border flex items-center h-12 px-4">
            <Search className="w-5 h-5 text-text-muted mr-2 shrink-0" />
            <input 
              type="text" 
              className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-medium text-text-main placeholder-slate-400 py-0 h-full outline-none"
              placeholder="Search region or crop zone..."
            />
          </div>
        </div>

        <div className="flex-grow"></div>

        {/* Bottom Controls & Legend */}
        <div className="pointer-events-auto flex flex-col gap-4 w-full max-w-lg mx-auto md:mb-6">
          <div className="flex justify-end w-full">
            <button 
              onClick={handleLocate}
              disabled={isLocating}
              className={cn(
                "bg-surface text-primary p-3 rounded-full shadow-lg border border-border hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center",
                isLocating && "opacity-50 cursor-wait"
              )}
            >
              {isLocating ? <Loader2 className="w-6 h-6 animate-spin" /> : <MapPin className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
            {layers.map(layer => (
              <button
                key={layer.name}
                onClick={() => setActiveLayer(layer.name)}
                className={cn(
                  "flex-shrink-0 rounded-full px-4 h-9 text-sm font-semibold flex items-center gap-2 transition-all border",
                  activeLayer === layer.name 
                    ? "bg-primary text-on-primary border-[#012d1d] shadow-sm"
                    : "bg-surface text-text-muted border-border hover:bg-slate-50"
                )}
              >
                <layer.icon className="w-4 h-4" />
                {layer.name}
              </button>
            ))}
          </div>

          <div className="bg-surface rounded-2xl shadow-md border border-border p-4 w-full mb-16 md:mb-0">
            <h3 className="text-sm font-semibold text-text-muted mb-3">
              Active Layer: <span className="text-primary font-bold">{activeLayer}</span>
            </h3>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-200 via-green-200 to-red-400 mb-2"></div>
            <div className="flex justify-between text-xs font-semibold text-text-muted">
              <span>Cool (&lt;15°C)</span>
              <span>Optimal</span>
              <span>Hot (&gt;30°C)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

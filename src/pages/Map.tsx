import { MapPin, Search, CloudRain, Sun, Cloud, Thermometer, Droplets, Wind } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function MapView() {
  const [activeLayer, setActiveLayer] = useState('Temperature');

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
            defaultCenter={{lat: 20.5937, lng: 78.9629}} // Default center (India)
            defaultZoom={5}
            mapId="AGRI_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{width: '100%', height: '100%'}}
            disableDefaultUI={true}
          >
            {/* Some mock markers that would normally come from your database */}
            <AdvancedMarker position={{lat: 28.6139, lng: 77.2090}} title="Farm A">
               <div className="bg-surface p-2 rounded-full shadow-lg border border-border text-[#7f5539]">
                 <Sun className="w-5 h-5" />
               </div>
            </AdvancedMarker>
            <AdvancedMarker position={{lat: 19.0760, lng: 72.8777}} title="Farm B">
               <div className="bg-surface p-2 rounded-full shadow-lg border border-border text-primary">
                 <CloudRain className="w-5 h-5" />
               </div>
            </AdvancedMarker>
            <AdvancedMarker position={{lat: 12.9716, lng: 77.5946}} title="Farm C">
               <div className="bg-surface p-2 rounded-full shadow-lg border border-border text-text-muted">
                 <Cloud className="w-5 h-5" />
               </div>
            </AdvancedMarker>
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
            <button className="bg-surface text-primary p-3 rounded-full shadow-lg border border-border hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center">
              <MapPin className="w-6 h-6" />
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

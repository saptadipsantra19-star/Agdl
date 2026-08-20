import { Link } from 'react-router-dom';
import { MapPin, Leaf, Sun, Droplets, Lightbulb, Sparkles, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const [region, setRegion] = useState('Locating...');

  useEffect(() => {
    let mounted = true;
    
    // First check profile
    if (user) {
      getDoc(doc(db, 'users', user.uid)).then(docSnap => {
        if (docSnap.exists() && mounted) {
          const profileRegion = docSnap.data().region;
          if (profileRegion && profileRegion !== 'Unknown' && profileRegion !== 'Locating...') {
            setRegion(profileRegion);
          }
        }
      });
    }

    // Try geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!mounted) return;
          try {
            // First try Google Maps if key exists
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY;
            if (apiKey) {
              const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${apiKey}`);
              const data = await res.json();
              if (data.results && data.results.length > 0) {
                const city = data.results[0].address_components.find((ac: any) => ac.types.includes('locality'))?.long_name;
                const state = data.results[0].address_components.find((ac: any) => ac.types.includes('administrative_area_level_1'))?.short_name;
                if (city && state && mounted) {
                  setRegion(`${city}, ${state}`);
                  return;
                }
              }
            }
            
            // Fallback to free OpenStreetMap API (Nominatim)
            const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            const osmData = await osmRes.json();
            if (osmData && osmData.address && mounted) {
               const city = osmData.address.city || osmData.address.town || osmData.address.village;
               const state = osmData.address.state;
               if (city && state) {
                 setRegion(`${city}, ${state}`);
                 return;
               }
            }
            
            if (mounted) setRegion('Local Farm');
          } catch (e) {
            if (mounted) setRegion('Local Farm');
          }
        },
        () => {
          if (mounted) {
             setRegion((prev) => prev === 'Locating...' || prev === 'Unknown' ? 'Your Farm' : prev);
          }
        },
        { timeout: 10000 }
      );
    } else {
       setRegion('Your Farm');
    }
    
    return () => { mounted = false; };
  }, [user]);
  
  return (
    <div className="flex flex-col gap-6 pt-16 md:pt-8 px-4 md:px-8 max-w-5xl mx-auto pb-12">
      {/* Mobile Header Overlay if needed, but let's just make the content flow */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-surface z-30 h-14 flex items-center px-4 border-b border-border">
         <span className="font-bold text-primary text-xl">Agriculture with DL</span>
      </header>

      {/* Farmer Profile Summary */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-primary">Good Morning, {user?.displayName ? user.displayName.split(' ')[0] : 'Farmer'}</h1>
        <div className="flex flex-wrap gap-2 mt-1">
          <div className="flex items-center gap-2 bg-[#eef4fd] text-text-muted px-4 py-1.5 rounded-full border border-border">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-semibold">{region}</span>
          </div>
          <div className="flex items-center gap-2 bg-[#eef4fd] text-text-muted px-4 py-1.5 rounded-full border border-border">
            <Leaf className="w-4 h-4" />
            <span className="text-sm font-semibold">Your Crops</span>
          </div>
        </div>
      </section>

      {/* Smart Advisory Section */}
      <section className="bg-surface border border-border rounded-2xl shadow-sm p-6 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-primary">Farm Advisory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 bg-[#eef4fd] rounded-xl p-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-primary">24°C</div>
              <div className="text-sm text-text-muted">Sunny</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[#eef4fd] rounded-xl p-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="w-full">
              <div className="text-sm font-semibold text-text-muted">Soil Health</div>
              <div className="text-sm font-medium">pH 6.5 • Med. Nitrogen</div>
              <div className="w-full bg-slate-200 h-1.5 mt-2 rounded-full overflow-hidden">
                <div className="bg-green-500 w-2/3 h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 bg-[#F0EAD6] border border-[#DEE2E6] rounded-xl p-4 flex gap-3">
          <Lightbulb className="w-5 h-5 text-[#7f5539] shrink-0 mt-0.5" />
          <div>
            <span className="text-sm font-semibold text-[#7f5539] block mb-1">Regenerative Tip</span>
            <p className="text-sm text-slate-800 leading-relaxed">Current sunny conditions are ideal for mulching with crop residues to conserve soil moisture.</p>
          </div>
        </div>
      </section>

      {/* Gemini Integration */}
      <Link to="/ai" className="bg-primary text-on-primary rounded-2xl p-6 shadow-md flex items-center justify-between group active:scale-[0.98] transition-transform">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">DL with Gemini</h3>
            <p className="text-sm text-green-100/80">Ask your AI farming assistant anything</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-surface/10 flex items-center justify-center">
           <span className="text-on-primary text-xl">→</span>
        </div>
      </Link>

      {/* Diagnosis Shortcut */}
      <Link to="/diagnosis" className="w-full bg-primary text-on-primary rounded-2xl py-8 flex flex-col items-center justify-center gap-3 shadow-md transition-all active:scale-[0.98] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')]"></div>
        <Stethoscope className="w-10 h-10" />
        <span className="text-xl font-semibold">Identify Plant Disease</span>
        <span className="text-sm text-on-primary/70 font-medium">Upload a photo for instant diagnosis</span>
      </Link>

      {/* Recent Observations */}
      <section className="bg-surface border border-border rounded-2xl shadow-sm p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary">Recent Diagnostics</h2>
          <button className="text-sm font-semibold text-primary hover:underline">View All</button>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-4 py-4 border-b border-slate-100">
            <AlertCircle className="w-6 h-6 text-yellow-500" />
            <div className="flex-1">
              <div className="text-sm font-semibold">Tomato Early Blight</div>
              <div className="text-xs text-text-muted mt-0.5">2 days ago • Zone B</div>
            </div>
          </div>
          <div className="flex items-center gap-4 py-4">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <div className="flex-1">
              <div className="text-sm font-semibold">Healthy Crop</div>
              <div className="text-xs text-text-muted mt-0.5">5 days ago • Zone A</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Prices() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [region, setRegion] = useState('Locating...');
  const [currency, setCurrency] = useState('₹');

  const filters = ['All', 'Cereals', 'Vegetables', 'Fruits', 'Legumes', 'Spices', 'Cash Crops'];

  useEffect(() => {
    let mounted = true;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (!mounted) return;
          try {
            const osmRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
            const osmData = await osmRes.json();
            
            if (osmData && osmData.address && mounted) {
              const city = osmData.address.city || osmData.address.town || osmData.address.village;
              const state = osmData.address.state;
              const country = osmData.address.country;
              
              if (city && state) {
                setRegion(`${city}, ${state}`);
              } else if (country) {
                setRegion(country);
              } else {
                setRegion('Local Market');
              }
              
              if (country === 'India') setCurrency('₹');
              else if (country === 'Kenya') setCurrency('Ksh');
              else if (country === 'United States') setCurrency('$');
              else setCurrency('₹'); // Default fallback
              return;
            }
            if (mounted) setRegion('Local Market');
          } catch (e) {
            if (mounted) setRegion('Local Market');
          }
        },
        () => {
          if (mounted) setRegion('Local Market');
        }
      );
    } else {
      setRegion('Local Market');
    }
    return () => { mounted = false; };
  }, []);

  const getPrice = (basePrice: number) => {
    if (currency === '₹') return `${currency} ${(basePrice * 80).toLocaleString()}`;
    if (currency === '$') return `${currency} ${(basePrice).toLocaleString()}`;
    if (currency === 'Ksh') return `${currency} ${(basePrice * 130).toLocaleString()}`;
    return `${currency} ${(basePrice * 80).toLocaleString()}`;
  };

  const getEmoji = (name: string) => {
    const emojiMap: Record<string, string> = {
      'Rice / Paddy': '🌾',
      'Wheat': '🌾',
      'Maize / Corn': '🌽',
      'Pearl Millet / Bajra': '🌾',
      'Sorghum / Jowar': '🌾',
      'Finger Millet / Ragi': '🌾',
      'Green Gram / Moong Dal': '🫘',
      'Black Gram / Urad Dal': '🫘',
      'Lentil / Masoor Dal': '🫘',
      'Mustard (Leaf)': '🥬',
      'Mustard Seed': '🟡',
      'Sunflower': '🌻',
      'Sesame / Til': '🌱',
      'Potato': '🥔',
      'Tomato': '🍅',
      'Carrot': '🥕',
      'Radish / Mooli': '🥕',
      'Spinach / Palak': '🥬',
      'Peas / Matar': '🫛',
      'Garlic': '🧄',
      'Turmeric / Haldi': '🧅',
      'Ginger / Adrak': '🫚',
      'Coriander / Dhania': '🌿',
      'Papaya': '🍈',
      'Guava': '🍐',
      'Grapes': '🍇',
      'Pomegranate / Anar': '🍎',
      'Watermelon': '🍉',
      'Coconut': '🥥',
      'Jute': '🎋',
      'Tea': '🍵',
    };
    return emojiMap[name] || '🌱';
  };

  const crops = [
    { name: 'Rice / Paddy', price: getPrice(40), unit: '/ 100kg bag', trend: 'up', trendVal: '+1.5%', category: 'Cereals' },
    { name: 'Wheat', price: getPrice(30), unit: '/ 100kg bag', trend: 'down', trendVal: '-0.5%', category: 'Cereals' },
    { name: 'Maize / Corn', price: getPrice(25), unit: '/ 90kg bag', trend: 'up', trendVal: '+2%', category: 'Cereals' },
    { name: 'Pearl Millet / Bajra', price: getPrice(35), unit: '/ 100kg bag', trend: 'flat', trendVal: '0%', category: 'Cereals' },
    { name: 'Sorghum / Jowar', price: getPrice(35), unit: '/ 100kg bag', trend: 'up', trendVal: '+1.2%', category: 'Cereals' },
    { name: 'Finger Millet / Ragi', price: getPrice(50), unit: '/ 100kg bag', trend: 'up', trendVal: '+3%', category: 'Cereals' },
    { name: 'Green Gram / Moong Dal', price: getPrice(120), unit: '/ 100kg bag', trend: 'down', trendVal: '-1%', category: 'Legumes' },
    { name: 'Black Gram / Urad Dal', price: getPrice(110), unit: '/ 100kg bag', trend: 'flat', trendVal: '0%', category: 'Legumes' },
    { name: 'Lentil / Masoor Dal', price: getPrice(100), unit: '/ 100kg bag', trend: 'up', trendVal: '+2.5%', category: 'Legumes' },
    { name: 'Mustard (Leaf)', price: getPrice(10), unit: '/ crate', trend: 'down', trendVal: '-2%', category: 'Vegetables' },
    { name: 'Mustard Seed', price: getPrice(80), unit: '/ 100kg bag', trend: 'up', trendVal: '+1.8%', category: 'Cash Crops' },
    { name: 'Sunflower', price: getPrice(60), unit: '/ 100kg bag', trend: 'flat', trendVal: '0%', category: 'Cash Crops' },
    { name: 'Sesame / Til', price: getPrice(150), unit: '/ 100kg bag', trend: 'up', trendVal: '+4%', category: 'Cash Crops' },
    { name: 'Potato', price: getPrice(30), unit: '/ 50kg bag', trend: 'flat', trendVal: '0%', category: 'Vegetables' },
    { name: 'Tomato', price: getPrice(50), unit: '/ crate', trend: 'down', trendVal: '-1.5%', category: 'Vegetables' },
    { name: 'Carrot', price: getPrice(40), unit: '/ 50kg bag', trend: 'up', trendVal: '+1%', category: 'Vegetables' },
    { name: 'Radish / Mooli', price: getPrice(30), unit: '/ 50kg bag', trend: 'down', trendVal: '-3%', category: 'Vegetables' },
    { name: 'Spinach / Palak', price: getPrice(15), unit: '/ crate', trend: 'flat', trendVal: '0%', category: 'Vegetables' },
    { name: 'Peas / Matar', price: getPrice(80), unit: '/ 50kg bag', trend: 'up', trendVal: '+2%', category: 'Vegetables' },
    { name: 'Garlic', price: getPrice(100), unit: '/ 50kg bag', trend: 'up', trendVal: '+5%', category: 'Spices' },
    { name: 'Turmeric / Haldi', price: getPrice(150), unit: '/ 100kg bag', trend: 'flat', trendVal: '0%', category: 'Spices' },
    { name: 'Ginger / Adrak', price: getPrice(90), unit: '/ 50kg bag', trend: 'down', trendVal: '-1.5%', category: 'Spices' },
    { name: 'Coriander / Dhania', price: getPrice(50), unit: '/ 50kg bag', trend: 'up', trendVal: '+2%', category: 'Spices' },
    { name: 'Papaya', price: getPrice(50), unit: '/ crate', trend: 'flat', trendVal: '0%', category: 'Fruits' },
    { name: 'Guava', price: getPrice(60), unit: '/ crate', trend: 'up', trendVal: '+1%', category: 'Fruits' },
    { name: 'Grapes', price: getPrice(30), unit: '/ 20kg box', trend: 'down', trendVal: '-4%', category: 'Fruits' },
    { name: 'Pomegranate / Anar', price: getPrice(40), unit: '/ 20kg box', trend: 'up', trendVal: '+3%', category: 'Fruits' },
    { name: 'Watermelon', price: getPrice(5), unit: '/ piece', trend: 'flat', trendVal: '0%', category: 'Fruits' },
    { name: 'Coconut', price: getPrice(40), unit: '/ 100 pieces', trend: 'up', trendVal: '+1.5%', category: 'Cash Crops' },
    { name: 'Jute', price: getPrice(60), unit: '/ 100kg bale', trend: 'flat', trendVal: '0%', category: 'Cash Crops' },
    { name: 'Tea', price: getPrice(150), unit: '/ 50kg bag', trend: 'up', trendVal: '+2.5%', category: 'Cash Crops' },
  ];

  const filteredCrops = activeFilter === 'All' ? crops : crops.filter(c => c.category === activeFilter);

  return (
    <div className="flex flex-col gap-6 pt-16 md:pt-8 px-4 md:px-8 max-w-5xl mx-auto pb-12">
      <header className="md:hidden fixed top-0 left-0 w-full bg-surface z-30 h-14 flex items-center justify-between px-4 border-b border-border">
         <span className="font-bold text-primary text-lg">Agriculture with DL Prices</span>
         <Search className="w-5 h-5 text-primary" />
      </header>

      <div className="hidden md:flex justify-between items-center mb-2">
        <h1 className="text-3xl font-semibold text-primary">Crop Prices</h1>
      </div>

      <section className="flex flex-col gap-4">
        {/* Search Desktop */}
        <div className="relative w-full hidden md:block">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search crops..." 
            className="w-full h-12 pl-12 pr-4 bg-surface border border-border rounded-full text-sm focus:outline-none focus:border-[#012d1d] focus:ring-1 focus:ring-[#012d1d] transition-shadow shadow-sm"
          />
        </div>

        {/* Regional Indicator */}
        <div className="flex items-center justify-between bg-surface rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#eef4fd] flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Current Region</p>
              <p className="text-sm font-bold text-primary">{region}</p>
            </div>
          </div>
          <button className="w-10 h-10 flex items-center justify-center text-text-muted hover:bg-slate-100 rounded-full transition-colors">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "whitespace-nowrap px-6 py-2 rounded-full text-sm font-semibold transition-all border",
                activeFilter === filter 
                  ? "bg-primary text-on-primary border-[#012d1d] shadow-sm" 
                  : "bg-surface text-text-muted hover:bg-slate-50 border-border"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Price List Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.map((crop) => (
          <div key={crop.name} className="bg-surface rounded-2xl p-4 shadow-sm border border-border flex items-center justify-between hover:shadow-md hover:border-[#012d1d]/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-border overflow-hidden text-2xl group-hover:scale-105 transition-transform">
                {getEmoji(crop.name)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">{crop.name}</h3>
                <p className="text-sm font-semibold text-text-muted mt-0.5">
                  {crop.price} <span className="text-text-muted font-normal">{crop.unit}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={cn(
                "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-bold",
                crop.trend === 'up' && "text-[#0e5138] bg-primary-fixed",
                crop.trend === 'down' && "text-red-800 bg-red-100",
                crop.trend === 'flat' && "text-text-muted bg-slate-100"
              )}>
                {crop.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                {crop.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                {crop.trend === 'flat' && <Minus className="w-3.5 h-3.5" />}
                {crop.trendVal}
              </span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

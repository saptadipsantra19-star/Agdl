import { useState } from 'react';
import { Search, MapPin, ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Prices() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Cereals', 'Vegetables', 'Fruits', 'Legumes'];

  const crops = [
    { name: 'Maize', price: 'Ksh 3,200', unit: '/ 90kg bag', trend: 'up', trendVal: '+2%', category: 'Cereals' },
    { name: 'Tomato', price: 'Ksh 6,500', unit: '/ crate', trend: 'down', trendVal: '-1.5%', category: 'Vegetables' },
    { name: 'Potato', price: 'Ksh 4,100', unit: '/ 50kg bag', trend: 'flat', trendVal: '0%', category: 'Vegetables' },
    { name: 'Beans', price: 'Ksh 9,000', unit: '/ 90kg bag', trend: 'up', trendVal: '+5%', category: 'Legumes' },
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
              <p className="text-sm font-bold text-primary">Nakuru, Kenya</p>
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
                {crop.name === 'Maize' && '🌽'}
                {crop.name === 'Tomato' && '🍅'}
                {crop.name === 'Potato' && '🥔'}
                {crop.name === 'Beans' && '🫘'}
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

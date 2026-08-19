import { ShoppingCart, ExternalLink, Search } from 'lucide-react';
import { useState } from 'react';

export default function Shopping() {
  const [query, setQuery] = useState('');

  const handleSearch = (store: 'amazon' | 'flipkart') => {
    const q = query.trim() || 'agricultural tools seeds fertilizers';
    if (store === 'amazon') {
      window.open(`https://www.amazon.in/s?k=${encodeURIComponent(q)}`, '_blank');
    } else {
      window.open(`https://www.flipkart.com/search?q=${encodeURIComponent(q)}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-6 pt-16 md:pt-8 px-4 md:px-8 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" />
          Online Shopping
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Buy agricultural supplies, tools, and seeds from trusted online stores.
        </p>
      </header>

      <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border mb-4">
        <div className="flex items-center gap-3 bg-background border border-border rounded-xl p-2 focus-within:ring-1 focus-within:ring-primary transition-shadow">
          <Search className="w-5 h-5 text-text-muted shrink-0 ml-2" />
          <input
            type="text"
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-medium text-text-main placeholder-slate-400 py-2 h-full outline-none"
            placeholder="Search for fertilizers, tractors, seeds..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleSearch('amazon')}
          className="flex flex-col items-center justify-center gap-4 p-8 bg-surface border border-border rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm group"
        >
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-2">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-text-main flex items-center justify-center gap-2">
              Amazon <ExternalLink className="w-4 h-4 text-text-muted" />
            </h3>
            <p className="text-sm text-text-muted mt-1">Shop agricultural needs on Amazon</p>
          </div>
        </button>

        <button
          onClick={() => handleSearch('flipkart')}
          className="flex flex-col items-center justify-center gap-4 p-8 bg-surface border border-border rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm group"
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-text-main flex items-center justify-center gap-2">
              Flipkart <ExternalLink className="w-4 h-4 text-text-muted" />
            </h3>
            <p className="text-sm text-text-muted mt-1">Shop agricultural needs on Flipkart</p>
          </div>
        </button>
      </div>
    </div>
  );
}

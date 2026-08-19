import { useState } from 'react';
import { Camera, ChevronDown, Search, Microscope, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Diagnosis() {
  const [cropType, setCropType] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [result, setResult] = useState<null | {status: string, message: string}>(null);
  const { user } = useAuth();

  const handleDiagnose = async () => {
    if (!cropType || !user) return;
    setIsDiagnosing(true);
    // Simulate AI processing
    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'diagnostics'), {
          userId: user.uid,
          cropType,
          result: "Early signs of leaf blight detected.",
          status: "completed",
          createdAt: serverTimestamp()
        });
        setResult({ status: 'warning', message: 'Early signs of leaf blight detected. Recommended action: Apply copper-based fungicide.' });
      } catch (e) {
        console.error(e);
      } finally {
        setIsDiagnosing(false);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 pt-16 md:pt-8 px-4 md:px-8 max-w-3xl mx-auto pb-12">
      <header className="md:hidden fixed top-0 left-0 w-full bg-surface z-30 h-14 flex items-center px-4 border-b border-border">
         <Link to="/" className="w-10 h-10 flex items-center justify-center text-primary -ml-2 rounded-full hover:bg-slate-100">
           <ArrowLeft className="w-5 h-5" />
         </Link>
         <span className="font-bold text-primary text-lg ml-2">Agriculture with DL</span>
      </header>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-primary">Identify Crop Issues</h1>
        <p className="text-text-muted text-sm">Upload a clear photo of the affected plant leaf to receive an instant AI diagnosis and treatment recommendations.</p>
      </div>

      <div className="w-full bg-surface border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#012d1d] hover:bg-slate-50 transition-colors h-64 shadow-sm group">
        <div className="w-16 h-16 rounded-full bg-primary-fixed/50 flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <span className="block text-sm font-semibold text-primary mb-1">Upload or Take Photo of Infected Leaf</span>
          <span className="block text-xs text-text-muted">Supports JPG, PNG up to 10MB</span>
        </div>
        <button className="mt-2 px-4 py-2 rounded-full border border-border text-sm font-semibold text-text-muted group-hover:border-[#012d1d] group-hover:text-primary transition-colors">Browse Files</button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-primary" htmlFor="crop-type">Crop Type</label>
        <div className="relative">
          <select 
            id="crop-type" 
            className="w-full h-12 bg-surface border border-border text-text-muted text-sm rounded-xl px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-[#012d1d]"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
          >
            <option disabled value="">Select affected crop...</option>
            <option value="tomato">Tomato</option>
            <option value="rice">Rice</option>
            <option value="maize">Maize</option>
            <option value="wheat">Wheat</option>
            <option value="potato">Potato</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-muted">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {!result && (
        <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm opacity-60">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <Microscope className="w-6 h-6 text-text-muted" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-text-muted">Awaiting Image</span>
              <span className="block text-sm text-text-muted">Analysis will appear here</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"></div>
        </div>
      )}

      {result && (
        <div className="bg-[#fff5f5] border border-red-200 rounded-2xl p-4 shadow-sm">
           <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <span className="block text-sm font-semibold text-red-900">Diagnosis Complete</span>
            </div>
          </div>
          <p className="text-sm text-red-800 ml-16">{result.message}</p>
        </div>
      )}

      <button 
        disabled={!cropType || isDiagnosing}
        onClick={handleDiagnose}
        className={cn(
          "w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all",
          cropType && !isDiagnosing 
            ? "bg-primary text-on-primary hover:bg-primary active:scale-[0.98]" 
            : "bg-slate-200 text-text-muted cursor-not-allowed"
        )}
      >
        {isDiagnosing ? (
           <span className="animate-pulse">Analyzing Image...</span>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Diagnose Disease
          </>
        )}
      </button>
    </div>
  );
}

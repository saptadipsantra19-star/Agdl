import { useState, useRef, ChangeEvent } from 'react';
import { Camera, ChevronDown, Search, Microscope, ArrowLeft, AlertCircle, X, CheckCircle2, ListChecks, Activity, ShieldAlert, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Diagnosis() {
  const [cropType, setCropType] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [result, setResult] = useState<null | {
    status: string,
    disease?: string,
    confidence?: string,
    treatment?: string[],
    message?: string
  }>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null); // Clear previous results
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!cropType || !user || !imageFile) return;
    setIsDiagnosing(true);
    
    try {
      // Create FormData to send image to our backend
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('cropType', cropType);
      
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      // Save to Firebase history
      await addDoc(collection(db, 'diagnostics'), {
        userId: user.uid,
        cropType,
        result: data.diagnosis,
        status: "completed",
        createdAt: serverTimestamp()
      });
      
      setResult({ 
        status: 'success', 
        disease: data.diagnosis.disease,
        confidence: data.diagnosis.confidence,
        treatment: data.diagnosis.treatment
      });
    } catch (e: any) {
      console.error(e);
      setResult({ status: 'error', message: e.message || 'Analysis failed. Please try again.' });
    } finally {
      setIsDiagnosing(false);
    }
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

      <div 
        className="relative w-full bg-surface border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#012d1d] hover:bg-slate-50 transition-colors h-64 shadow-sm group overflow-hidden"
        onClick={() => !imagePreview && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
        />
        
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Crop Preview" className="w-full h-full object-cover" />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setImagePreview(null);
                setImageFile(null);
                setResult(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-primary-fixed/50 flex items-center justify-center group-hover:bg-primary-fixed transition-colors">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <span className="block text-sm font-semibold text-primary mb-1">Upload or Take Photo of Infected Leaf</span>
              <span className="block text-xs text-text-muted">Supports JPG, PNG up to 10MB</span>
            </div>
            <button 
              className="mt-2 px-4 py-2 rounded-full border border-border text-sm font-semibold text-text-muted group-hover:border-[#012d1d] group-hover:text-primary transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </button>
          </>
        )}
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
            <option value="Rice / Paddy">Rice / Paddy</option>
            <option value="Wheat">Wheat</option>
            <option value="Maize / Corn">Maize / Corn</option>
            <option value="Pearl Millet / Bajra">Pearl Millet / Bajra</option>
            <option value="Sorghum / Jowar">Sorghum / Jowar</option>
            <option value="Finger Millet / Ragi">Finger Millet / Ragi</option>
            <option value="Green Gram / Moong Dal">Green Gram / Moong Dal</option>
            <option value="Black Gram / Urad Dal">Black Gram / Urad Dal</option>
            <option value="Lentil / Masoor Dal">Lentil / Masoor Dal</option>
            <option value="Mustard">Mustard (Leaf)</option>
            <option value="Mustard Seed">Mustard Seed</option>
            <option value="Sunflower">Sunflower</option>
            <option value="Sesame / Til">Sesame / Til</option>
            <option value="Potato">Potato</option>
            <option value="Tomato">Tomato</option>
            <option value="Carrot">Carrot</option>
            <option value="Radish / Mooli">Radish / Mooli</option>
            <option value="Spinach / Palak">Spinach / Palak</option>
            <option value="Peas / Matar">Peas / Matar</option>
            <option value="Garlic">Garlic</option>
            <option value="Turmeric / Haldi">Turmeric / Haldi</option>
            <option value="Ginger / Adrak">Ginger / Adrak</option>
            <option value="Coriander / Dhania">Coriander / Dhania</option>
            <option value="Papaya">Papaya</option>
            <option value="Guava">Guava</option>
            <option value="Grapes">Grapes</option>
            <option value="Pomegranate / Anar">Pomegranate / Anar</option>
            <option value="Watermelon">Watermelon</option>
            <option value="Coconut">Coconut</option>
            <option value="Jute">Jute</option>
            <option value="Tea">Tea</option>
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
        <div className={cn(
          "bg-surface border rounded-2xl p-6 shadow-sm flex flex-col gap-5",
          result.status === 'error' ? "border-red-200 bg-red-50" : "border-border"
        )}>
          {result.status === 'error' ? (
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-red-900">Analysis Failed</span>
                <span className="block text-sm text-red-700">{result.message}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  result.disease?.toLowerCase().includes("healthy") || result.disease?.toLowerCase().includes("none")
                    ? "bg-green-100 text-green-700" 
                    : "bg-amber-100 text-amber-700"
                )}>
                  {result.disease?.toLowerCase().includes("healthy") || result.disease?.toLowerCase().includes("none") ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <ShieldAlert className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <span className="block text-sm font-medium text-text-muted mb-0.5">Detected Condition</span>
                  <span className="block text-lg font-bold text-primary leading-tight">{result.disease}</span>
                </div>
              </div>

              {/* Confidence & Details */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-text-muted" />
                  <span className="text-sm text-text-muted">AI Confidence:</span>
                  <span className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full",
                    result.confidence?.toLowerCase() === 'high' ? "bg-green-100 text-green-700" :
                    result.confidence?.toLowerCase() === 'medium' ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {result.confidence}
                  </span>
                </div>
                
                {result.treatment && result.treatment.length > 0 && (
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <ListChecks className="w-5 h-5" />
                      <span>Recommended Action Plan</span>
                    </div>
                    <ul className="flex flex-col gap-2.5">
                      {result.treatment.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-text-muted bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-border">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
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

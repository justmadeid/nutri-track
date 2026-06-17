import React, { useState, useRef, useEffect } from 'react';
import { HealthProfile, ScanResult, ScanHistoryItem, RiskStatus } from '../types';
import { 
  Camera, Upload, Sparkles, FolderOpen, RefreshCw, AlertTriangle, 
  CheckCircle, HelpCircle, Save, History, Trash2, Heart, Award, Activity, QrCode
} from 'lucide-react';

interface ScanViewProps {
  currentProfile: HealthProfile;
  onSaveToHistory: (item: ScanHistoryItem) => void;
  historyList: ScanHistoryItem[];
  onClearHistory: () => void;
}

// Indonesian Food presets to speed up debugging and play around with
const PRESSED_MEAL_PRESETS = [
  {
    name: 'Nasi Padang Gulai Kikil/Tunjang',
    img: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=400',
    description: 'Hidangan kaya kalori dengan santan kental melimpah'
  },
  {
    name: 'Sayur Asem & Tahu Kukus',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    description: 'Sayur segar rendah purin & lemak'
  },
  {
    name: 'Tumis Daun & Kulit Melinjo',
    img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=400',
    description: 'Tumisan sayur tradisional pelengkap makan siang'
  },
  {
    name: 'Martabak Manis Keju Cokelat',
    img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400',
    description: 'Camilan malam padat gula dan karbohidrat tepung'
  }
];

export default function ScanView({ currentProfile, onSaveToHistory, historyList, onClearHistory }: ScanViewProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('Mengunggah gambar...');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotate loading step messages for realistic feel
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      const steps = [
        'Menerima file foto kuliner...',
        'Mengidentifikasi resep dan bumbu...',
        `Memvalidasi bahan terhadap diagnosis ${currentProfile.diagnosis}...`,
        'Memperhitungkan indeks glikemik & asam urat...',
        'Merumuskan kalimat saran gizi logis...'
      ];
      let index = 0;
      setLoadingStep(steps[0]);
      interval = setInterval(() => {
        index = (index + 1) % steps.length;
        setLoadingStep(steps[index]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing, currentProfile.diagnosis]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.getFiles?.()?.[0] || e.target.files?.[0];
    if (file) {
      setErrorMessage(null);
      setAnalysisResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        // Auto trigger scan
        triggerScan(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = async (presetUrl: string, presetName: string) => {
    setErrorMessage(null);
    setAnalysisResult(null);
    setSelectedImage(presetUrl);
    
    // Simulate preset scan load or call real backend API via base64 encoded presets if possible.
    // For smoothness, we can transmit the simulation via our backend payload!
    triggerScan(presetUrl);
  };

  const triggerScan = async (imgDataUrl: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisResult(null);
    setSaveSuccess(false);

    // Capacitor native: pakai URL Vercel penuh. Web/dev: pakai /api/scan lokal
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    const apiUrl = `${apiBase}/api/scan`;

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imgDataUrl,
          diagnosis: currentProfile.diagnosis
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned error code ${res.status}`);
      }

      const result: ScanResult = await res.json();
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Gagal memproses analisis gizi. Silakan coba kembali.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveItem = () => {
    if (analysisResult && selectedImage) {
      const historyItem: ScanHistoryItem = {
        ...analysisResult,
        id: 'scan_' + Date.now(),
        timestamp: new Date().toISOString(),
        imageUrl: selectedImage
      };
      onSaveToHistory(historyItem);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Safe color picker helper for Risk categories
  const getRiskColorClasses = (risk: RiskStatus) => {
    switch (risk) {
      case 'Aman':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-400/40',
          badge: 'bg-emerald-500 text-white',
          text: 'text-emerald-700',
          border: 'border-emerald-400/50',
          cardClass: 'glass backdrop-blur-lg shadow-emerald-500/5'
        };
      case 'Hati-hati':
        return {
          bg: 'bg-amber-500/10 text-amber-800 border-amber-400/40',
          badge: 'bg-amber-500 text-slate-900',
          text: 'text-amber-800',
          border: 'border-amber-400/50',
          cardClass: 'glass backdrop-blur-lg shadow-amber-500/5'
        };
      case 'Berisiko Tinggi':
        return {
          bg: 'bg-red-500/10 text-[#eb4d4b] border-red-400/40',
          badge: 'bg-[#eb4d4b] text-white',
          text: 'text-[#eb4d4b]',
          border: 'high-risk-border',
          cardClass: 'glass backdrop-blur-lg shadow-red-500/5'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-200',
          badge: 'bg-slate-500 text-white',
          text: 'text-slate-700',
          border: 'border-slate-300',
          cardClass: 'glass'
        };
    }
  };

  return (
    <div id="scan-view-tab" className="px-5 py-4 animate-fade-in space-y-5">
      
      {/* Target Warning diagnosis header card */}
      <div id="active-diagnosis-indicator" className="glass p-3 rounded-2xl flex items-center justify-between border-slate-300/30">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-danger animate-pulse" />
          <span className="text-xs font-semibold text-slate-700 font-display">
            Analisis Target: <span className="text-slate-900 font-bold">{currentProfile.diagnosis}</span>
          </span>
        </div>
        <span className="text-[10px] font-mono font-medium text-slate-500">
          Target BB: {currentProfile.targetWeight}kg
        </span>
      </div>

      {/* Upload Screen Chassis */}
      <div id="image-upload-hub" className="glass p-4 rounded-3xl space-y-4">
        
        {selectedImage ? (
          /* Image preview and analysis triggers */
          <div id="preview-image-box" className="relative h-56 rounded-2xl overflow-hidden group shadow-inner bg-slate-100/50 flex items-center justify-center">
            <img 
              id="uploaded-preview-img"
              src={selectedImage} 
              alt="Preview Makanan" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* Action buttons on top of preview */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
              <button
                id="btn-upload-new-pwa"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white/95 text-slate-800 text-[11px] font-bold rounded-lg shadow-md flex items-center gap-1.5 border border-slate-300/40 active:scale-95 transition-all duration-200"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>Ganti Foto</span>
              </button>
              
              {!isAnalyzing && (
                <button
                  id="btn-manual-reanalyze"
                  onClick={() => triggerScan(selectedImage)}
                  className="px-3 py-1.5 bg-brand-danger text-white text-[11px] font-bold rounded-lg shadow-md flex items-center gap-1.5 active:scale-95 transition-all duration-200"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Analisis Ulang</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Empty Selector Screen triggers */
          <div 
            id="drag-upload-field"
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200/60 hover:border-red-400/80 bg-white/30 hover:bg-red-50/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300"
          >
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xs flex items-center justify-center text-brand-danger border border-slate-100 mb-3">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 font-display">
              Ambil Foto Makanan atau Upload
            </h4>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
              Tekan untuk membuka HP camera atau pilih file dari galeri langsung.
            </p>
          </div>
        )}

        {/* Hidden File Input */}
        <input 
          id="hidden-camera-file-input"
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          capture="environment"
          onChange={handleImageUpload}
          className="hidden" 
        />
      </div>

      {/* Loading scanning overlay indicator */}
      {isAnalyzing && (
        <div id="scanner-loading-screen" className="glass rounded-3xl p-6 border-white/25 text-center space-y-4 shadow-md animate-pulse">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-red-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-red-500 rounded-full animate-spin"></div>
            <Camera className="w-6 h-6 text-brand-danger" />
          </div>
          
          <div className="space-y-1">
            <h4 className="text-xs font-bold font-display text-slate-900">
              Menganalisis Makanan...
            </h4>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide">
              {loadingStep}
            </p>
          </div>

          <div className="w-full bg-slate-200/50 h-1.5 rounded-full overflow-hidden max-w-[180px] mx-auto">
            <div className="bg-brand-danger h-full w-2/3 rounded-full animate-loader"></div>
          </div>
        </div>
      )}

      {/* Error Output Panel */}
      {errorMessage && (
        <div id="scanner-error-card" className="p-4 bg-red-50 border border-red-100 rounded-2xl text-slate-700 space-y-2">
          <div className="flex gap-2 items-start">
            <AlertTriangle className="w-4.5 h-4.5 text-brand-danger flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900 font-display">Analisis Terganggu</h4>
              <p className="text-[11px] text-slate-600 leading-normal mt-0.5">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Structured Glassmorphism Analysis Output Card */}
      {analysisResult && !isAnalyzing && (
        <div 
          id="analysis-result-output-card" 
          className="p-5 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm"
        >
          {/* Risk Badge Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                analysisResult.risk_status === 'Aman'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : analysisResult.risk_status === 'Hati-hati'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {analysisResult.risk_status}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Skor Risiko: {analysisResult.risk_score}/100
              </span>
            </div>
            {analysisResult.risk_status === 'Aman' ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : analysisResult.risk_status === 'Hati-hati' ? (
              <HelpCircle className="w-5 h-5 text-amber-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            )}
          </div>

          {/* Food Info */}
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">
              {analysisResult.food_name}
            </h3>
            
            {/* Health Meter bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1 border border-slate-200">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  analysisResult.risk_status === 'Aman' ? 'bg-emerald-500' :
                  analysisResult.risk_status === 'Hati-hati' ? 'bg-amber-500' : 'bg-[#eb4d4b]'
                }`}
                style={{ width: `${analysisResult.risk_score}%` }}
              ></div>
            </div>
          </div>

          {/* Detailed Calorie & Macronutrients Breakdown Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-2 text-center">
              <span className="text-[8px] font-semibold text-orange-600 uppercase tracking-wider block leading-none">Energi</span>
              <p className="text-xs font-semibold text-orange-700 mt-1">{analysisResult.calories_est ?? 350} <span className="text-[7.5px] font-medium text-slate-400">kkal</span></p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-2 text-center">
              <span className="text-[8px] font-semibold text-amber-600 uppercase tracking-wider block leading-none">Karbo</span>
              <p className="text-xs font-semibold text-amber-700 mt-1">{analysisResult.carbs_est ?? 42} <span className="text-[7.5px] font-medium text-slate-400">g</span></p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-2 text-center">
              <span className="text-[8px] font-semibold text-blue-600 uppercase tracking-wider block leading-none">Protein</span>
              <p className="text-xs font-semibold text-blue-700 mt-1">{analysisResult.protein_est ?? 15} <span className="text-[7.5px] font-medium text-slate-400">g</span></p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-2 text-center">
              <span className="text-[8px] font-semibold text-rose-600 uppercase tracking-wider block leading-none">Lemak</span>
              <p className="text-xs font-semibold text-rose-700 mt-1">{analysisResult.fat_est ?? 12} <span className="text-[7.5px] font-medium text-slate-400">g</span></p>
            </div>
          </div>

          {/* List ingredients */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold text-slate-500">Bahan Makanan Utama Teridentifikasi:</span>
            <div className="flex flex-wrap gap-1.5">
              {analysisResult.detected_ingredients.map((ing, idx) => (
                <span 
                  key={idx} 
                  className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full text-[10px] text-slate-600 font-medium"
                >
                  • {ing}
                </span>
              ))}
            </div>
          </div>

          {/* XAI Explanation */}
          <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500">Penjelasan Logis AI (XAI):</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {analysisResult.xai_explanation}
            </p>
          </div>

          {/* Alternative Suggestion Section */}
          <div className="space-y-1 p-3 bg-slate-900 text-white rounded-2xl">
            <span className="text-[9px] font-semibold uppercase text-amber-300 tracking-wider">
              Saran Menu Alternatif Lokal Sehat
            </span>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              {analysisResult.alternative_suggestion}
            </p>
          </div>

          {/* AI Analysis Medical Disclaimer */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex gap-2.5 items-start text-slate-705">
            <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed font-medium">
              <strong>Pemberitahuan:</strong> Hasil analisis gizi dan status risiko makanan di atas merupakan estimasi kecerdasan buatan (AI) berbasis informasi umum dan bukan merupakan saran medis formal. Selalu konsultasikan dengan dokter atau dokter gizi Anda sebelum mengonsumsi makanan yang berisiko bagi kondisi kesehatan Anda.
            </p>
          </div>

          {/* Buttons to Save to History */}
          <div className="pt-2 flex gap-2">
            <button
              id="btn-save-to-history-pwa"
              onClick={handleSaveItem}
              disabled={saveSuccess}
              className={`flex-1 py-2.5 rounded-xl font-medium text-xs text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                saveSuccess ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Berhasil Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan ke Riwayat Makan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Brief History logger layout within same scanner for client reassurance */}
      {historyList.length > 0 && (
        <div id="mini-history-widget" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <span className="text-[12px] font-semibold text-slate-800">Scan Terakhir ({historyList.length})</span>
            </div>
            <button 
              id="btn-delete-full-history"
              onClick={onClearHistory}
              className="text-[10px] text-slate-400 hover:text-rose-500 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Hapus Semua
            </button>
          </div>

          <div className="max-h-44 overflow-y-auto no-scrollbar divide-y divide-slate-200">
            {historyList.slice(0, 3).map((item) => {
              const badgeClass = item.risk_status === 'Aman'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : item.risk_status === 'Hati-hati'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200';

              return (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.food_name} 
                      className="w-11 h-11 object-cover rounded-xl border border-slate-200" 
                    />
                    <div className="overflow-hidden">
                      <h5 className="text-[12px] font-semibold text-slate-800 truncate leading-tight">
                        {item.food_name}
                      </h5>
                      <div className="flex gap-1.5 items-center mt-1 text-[9px] text-slate-500 font-medium">
                        <span className="font-semibold text-orange-600">{item.calories_est ?? 350} kkal</span>
                        <span className="text-slate-300">•</span>
                        <span>K: {item.carbs_est ?? 42}g</span>
                        <span className="text-slate-300">•</span>
                        <span>P: {item.protein_est ?? 15}g</span>
                        <span className="text-slate-300">•</span>
                        <span>L: {item.fat_est ?? 12}g</span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-[9px] font-semibold px-2 py-1 rounded-full uppercase tracking-wide flex-shrink-0 border ${badgeClass}`}>
                    {item.risk_status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

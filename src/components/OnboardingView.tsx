import React, { useState } from 'react';
import { Camera, ShieldCheck, Heart, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: () => void;
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Solusi Cepat Deteksi Gizi',
      subtitle: 'Analisis Menu Kilat',
      description: 'Cukup foto sajian piring Anda di Warteg atau Rumah Makan Padang. AI Nutri Track akan mendeteksi bahan berbahaya dalam sekejap.',
      badge: 'Instan & Cerdas',
      icon: <Camera className="w-8 h-8 text-[#eb4d4b]" />,
      illustration: (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-[140px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main Plate */}
          <circle cx="100" cy="85" r="50" fill="rgba(255, 255, 255, 0.4)" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="2" />
          <circle cx="100" cy="85" r="40" fill="rgba(255, 255, 255, 0.2)" />
          {/* Food items inside */}
          <ellipse cx="85" cy="75" rx="16" ry="10" fill="url(#grad-warm)" />
          <circle cx="115" cy="78" r="12" fill="url(#grad-orange)" />
          <rect x="92" y="90" width="22" height="15" rx="4" fill="url(#grad-green)" />
          
          {/* Phone scanner frame */}
          <rect x="55" y="25" width="90" height="110" rx="16" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1.5" className="backdrop-blur-xs" />
          {/* Scanning line animation simulated visually */}
          <line x1="58" y1="75" x2="142" y2="75" stroke="#eb4d4b" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="100" cy="75" r="18" fill="rgba(235, 77, 75, 0.15)" stroke="#eb4d4b" strokeWidth="1" />
          <text x="100" y="79" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono">82% RISK</text>

          {/* Definitions */}
          <defs>
            <linearGradient id="grad-warm" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f39c12" />
              <stop offset="100%" stopColor="#d35400" />
            </linearGradient>
            <linearGradient id="grad-orange" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eb4d4b" />
              <stop offset="100%" stopColor="#c0392b" />
            </linearGradient>
            <linearGradient id="grad-green" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2ecc71" />
              <stop offset="100%" stopColor="#27ae60" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      title: 'Sesuai Diagnosis Medis Anda',
      subtitle: 'Pantau Batasan Khusus',
      description: 'Mulai dari Diabetes, Kolesterol Tinggi, Asam Urat, hingga Obesitas. Dapatkan peringatan real-time yang personal seseuai kondisi medis Anda.',
      badge: 'Personal & Aman',
      icon: <Heart className="w-8 h-8 text-[#eb4d4b]" />,
      illustration: (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-[140px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Pulse Waves */}
          <path d="M20 80h40l8-25 10 50 8-35 6 10h40 outline" stroke="rgba(235, 77, 75, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          
          {/* Floating glass cards */}
          <rect x="35" y="32" width="130" height="96" rx="20" fill="rgba(255, 255, 255, 0.45)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" className="backdrop-blur-md" />
          
          {/* Medical Indicators */}
          <g transform="translate(48, 45)">
            <circle cx="15" cy="15" r="12" fill="rgba(235, 77, 75, 0.1)" stroke="#eb4d4b" strokeWidth="1.5" />
            <path d="M12 15h6M15 12v6" stroke="#eb4d4b" strokeWidth="1.5" strokeLinecap="round" />
            <text x="35" y="14" fill="#1e293b" fontSize="10" fontWeight="bold">Diabetes Melitus</text>
            <text x="35" y="24" fill="#64748b" fontSize="8" fontWeight="medium">Batasi Karbohidrat & Gula</text>
          </g>

          <g transform="translate(48, 85)">
            <circle cx="15" cy="15" r="12" fill="rgba(243, 156, 18, 0.1)" stroke="#f39c12" strokeWidth="1.5" />
            <circle cx="15" cy="15" r="5" fill="#f39c12" opacity="0.4" />
            <text x="35" y="14" fill="#1e293b" fontSize="10" fontWeight="bold">Asam Urat</text>
            <text x="35" y="24" fill="#64748b" fontSize="8" fontWeight="medium">Batasi Jeroan, Paru, Emping</text>
          </g>
        </svg>
      )
    },
    {
      title: 'Rekomendasi Menu Bijak',
      subtitle: 'Alternatif Warteg Sehat',
      description: 'Apabila menu pilihan terbukti tinggi ancaman, kami carikan alternatif gizi seimbang terdekat agar diet Anda tidak pernah terputus.',
      badge: 'Solusi Sehat Bebas Cemas',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      illustration: (
        <svg viewBox="0 0 200 160" className="w-full h-full max-h-[140px]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Swap Indicator arrows */}
          <path d="M60 80h80" stroke="rgba(100, 116, 139, 0.2)" strokeWidth="3" strokeDasharray="5 5" />
          
          {/* Left Block - Unsafe Meal */}
          <g transform="translate(15, 35)">
            <rect width="65" height="90" rx="14" fill="rgba(235, 77, 75, 0.05)" stroke="rgba(235, 77, 75, 0.2)" strokeWidth="1" />
            <circle cx="32.5" cy="30" r="18" fill="rgba(235, 77, 75, 0.1)" />
            {/* Red Cross */}
            <path d="M28 26l9 8M37 26l-9 8" stroke="#eb4d4b" strokeWidth="2.5" strokeLinecap="round" />
            <text x="32.5" y="62" fill="#1e293b" fontSize="9" fontWeight="bold" textAnchor="middle">Rendang</text>
            <text x="32.5" y="73" fill="#eb4d4b" fontSize="8" fontWeight="bold" textAnchor="middle">Kolesterol Tinggi</text>
          </g>

          {/* Transition swap arrow */}
          <g transform="translate(88, 70)">
            <circle cx="12" cy="12" r="11" fill="rgba(52, 211, 153, 0.15)" stroke="#10b981" strokeWidth="1" />
            <path d="M10 8l4 4-4 4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Right Block - Safe Alternative */}
          <g transform="translate(120, 35)">
            <rect width="65" height="90" rx="14" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
            <circle cx="32.5" cy="30" r="18" fill="rgba(16, 185, 129, 0.1)" />
            {/* Green Tick */}
            <path d="M26 30l4 4 10-9" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="32.5" y="62" fill="#1e293b" fontSize="9" fontWeight="bold" textAnchor="middle">Soto Ayam</text>
            <text x="32.5" y="73" fill="#10b981" fontSize="8" fontWeight="bold" textAnchor="middle">Bening & Sehat</text>
          </g>
        </svg>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const active = steps[currentStep];

  return (
    <div id="onboarding-container" className="flex h-full flex-col bg-white px-6 pb-6 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep ? 'w-8 bg-slate-900' : 'w-2.5 bg-slate-200'}`}
            />
          ))}
        </div>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
        >
          Lewati
        </button>
      </div>

      <div className="mt-8 flex flex-1 flex-col justify-between">
        <div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-white p-2 shadow-xs border border-slate-200">
                {active.icon}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400">
                {active.badge}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center">
              {active.illustration}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              {active.subtitle}
            </p>
            <h2 className="mt-2 text-2xl font-display font-bold tracking-tight text-slate-900">
              {active.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {active.description}
            </p>
          </div>
        </div>

        <div className={`mt-8 flex items-center gap-3 ${currentStep === 0 ? 'justify-center' : ''}`}>
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-xs transition-all hover:bg-slate-50 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <button
            onClick={handleNext}
            className={`flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-900 text-xs font-semibold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95 ${currentStep === 0 ? 'w-full max-w-[260px]' : 'flex-1'}`}
          >
            <span>{currentStep === steps.length - 1 ? 'Mulai Sekarang' : 'Lanjutkan'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

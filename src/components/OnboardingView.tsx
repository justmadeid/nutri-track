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
      illustration: (
        <img src="/icons/img1.png" alt="Scan Meal Illustration" className="w-full h-full" />
      )
    },
    {
      title: 'Sesuai Diagnosis Medis Anda',
      subtitle: 'Pantau Batasan Khusus',
      description: 'Mulai dari Diabetes, Kolesterol Tinggi, Asam Urat, hingga Obesitas. Dapatkan peringatan real-time yang personal seseuai kondisi medis Anda.',
      badge: 'Personal & Aman',
      illustration: (
        <img src="/icons/img2.png" alt="Scan Meal Illustration" className="w-full h-full" />
      )
    },
    {
      title: 'Rekomendasi Menu Bijak',
      subtitle: 'Alternatif Menu Sehat',
      description: 'Apabila menu pilihan terbukti tinggi ancaman, kami carikan alternatif gizi seimbang terdekat agar diet Anda tidak pernah terputus.',
      badge: 'Solusi Sehat Bebas Cemas',
      illustration: (
        <img src="/icons/img3.png" alt="Scan Meal Illustration" className="w-full h-full" />
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
            <div className="mt-4 flex items-center justify-center">
              {active.illustration}
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
            className={`flex h-12 items-center justify-center gap-2 rounded-2xl bg-red-500 hover:bg-red-650 text-xs font-semibold text-white shadow-md transition-all active:scale-95 ${currentStep === 0 ? 'w-full max-w-[260px]' : 'flex-1'}`}
          >
            <span>{currentStep === steps.length - 1 ? 'Mulai Sekarang' : 'Lanjutkan'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

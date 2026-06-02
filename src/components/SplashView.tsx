import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

interface SplashViewProps {
  onFinish: () => void;
  durationMs?: number;
}

export default function SplashView({ onFinish, durationMs = 1600 }: SplashViewProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [durationMs, onFinish]);

  return (
    <div className="splash-bg flex h-full w-full flex-col items-center justify-center px-6 text-slate-900">
      <div className="splash-lines" />

      <div className="mb-6 flex items-center justify-center">
        <img src="/icons/logo.png" alt="Nutri Track Logo" className="w-32" />
      </div>

      <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-slate-500">Nutri Track</p>
      <h1 className="mt-2 text-[22px] font-display font-bold tracking-tight text-slate-950">
        Jaga Gizi, Tenang Setiap Hari
      </h1>
      <p className="mt-2 max-w-[240px] text-center text-xs text-slate-500">
        Sistem cerdas untuk memindai sajian, memandu diet, dan menjaga kondisi medis Anda.
      </p>

      <div className="mt-8 flex items-center gap-2">
        <span className="splash-dot" />
        <span className="splash-dot splash-dot-delay" />
        <span className="splash-dot" />
      </div>

      <button
        onClick={onFinish}
        className="mt-8 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-700"
      >
        Lewati
      </button>
    </div>
  );
}

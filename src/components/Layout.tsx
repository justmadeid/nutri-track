import React from 'react';
import { User, QrCode, TrendingUp, Sparkles, Shield, Heart, Calendar, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab?: 'home' | 'profile' | 'scan' | 'dashboard' | 'planner';
  setActiveTab?: (tab: 'home' | 'profile' | 'scan' | 'dashboard' | 'planner') => void;
  appName?: string;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export default function Layout({ 
  children, 
  activeTab = 'home', 
  setActiveTab, 
  appName = 'Nutri Track',
  hideHeader = false,
  hideFooter = false
}: LayoutProps) {
  return (
    <div id="app-container" className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-6 lg:p-8 font-sans transition-colors duration-300">
      {/* Simulation Device Wrapper for high-fidelity responsive presentation */}
      <div 
        id="device-frame" 
        className="w-full max-w-full md:max-w-[430px] h-screen md:h-[860px] app-bg md:rounded-[40px] md:shadow-2xl flex flex-col relative overflow-hidden md:border-8 md:border-slate-900 transition-all duration-300"
      >
        {/* Phone Notch/Header for desktop preview */}
        <div id="device-notch" className="hidden md:flex justify-between items-center px-6 pt-3 pb-2 bg-white/45 backdrop-blur-md text-slate-800 text-xs font-mono font-medium z-40 border-b border-white/20">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>Nutri Track Live</span>
          </div>
          <div className="w-16 h-4 bg-slate-900 rounded-full mx-auto -mt-1 absolute left-1/2 -translate-x-1/2"></div>
          <div className="flex items-center gap-1.5">
            <span>12:45 PM</span>
            <div className="w-4 h-2.5 bg-slate-400 rounded-xs flex p-0.5 justify-end">
              <div className="w-1.5 h-1.5 bg-slate-800 rounded-xs"></div>
            </div>
          </div>
        </div>

        {/* Screen Header */}
        {!hideHeader && (
          <header id="screen-header" className="px-5 py-4 flex items-center justify-between border-b border-white/30 bg-white/45 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-brand-danger/10 rounded-xl flex items-center justify-center text-brand-danger shadow-xs">
                <Shield className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold font-display text-slate-900 tracking-tight leading-tight">
                  {appName}
                </h1>
                <p className="text-[10px] font-semibold text-slate-500 font-mono tracking-wider uppercase leading-none mt-0.5">
                  AI Nutrition Guard
                </p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/60 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </header>
        )}

        {/* Screen Content - Scrollable with no scrollbar */}
        <main 
          id="screen-content" 
          className={`flex-1 overflow-y-auto overflow-x-hidden p-0 bg-transparent no-scrollbar ${hideFooter ? 'pb-6 pt-2' : 'pb-[92px]'}`}
        >
          {children}
        </main>

        {/* Elegant Bottom Navigation Bar */}
        {!hideFooter && setActiveTab && (
          <nav 
            id="bottom-navigation-bar" 
            className="absolute bottom-0 left-0 right-0 h-22 glass-nav shadow-[0_-4px_25px_-5px_rgba(0,0,0,0.08)] px-2 flex items-center justify-around z-35 pb-2"
          >
            {/* Overview / Home Tab Link */}
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 py-1 px-1.5 transition-all duration-300 relative shrink-0 ${
                activeTab === 'home' 
                  ? 'text-brand-danger font-semibold scale-105' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className={`w-5 h-5 transition-all duration-300 ${activeTab === 'home' ? 'stroke-[2.5px] text-brand-danger' : 'stroke-2'}`} />
              <span className="text-[9.5px] tracking-wide font-display mt-px">Beranda</span>
              {activeTab === 'home' && (
                <span className="absolute bottom-[-6px] w-4 h-1 bg-brand-danger rounded-full"></span>
              )}
            </button>

            {/* Dashboard Tab Link */}
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-1.5 transition-all duration-300 relative shrink-0 ${
                activeTab === 'dashboard' 
                  ? 'text-brand-danger font-semibold scale-105' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <TrendingUp className={`w-5 h-5 transition-all duration-300 ${activeTab === 'dashboard' ? 'stroke-[2.5px] text-brand-danger' : 'stroke-2'}`} />
              <span className="text-[9.5px] tracking-wide font-display mt-px">Grafik Tren</span>
              {activeTab === 'dashboard' && (
                <span className="absolute bottom-[-6px] w-4 h-1 bg-brand-danger rounded-full"></span>
              )}
            </button>

            {/* Core Feature: AI Food Scan Tab Link - PROMINENT CENTER PLACEMENT */}
            <button
              id="nav-tab-scan"
              onClick={() => setActiveTab('scan')}
              className={`flex flex-col items-center gap-1 transition-all duration-300 relative shrink-0 -mt-7`}
            >
              <div className={`p-3.5 rounded-full shadow-lg transition-all duration-300 ${
                activeTab === 'scan' 
                  ? 'bg-brand-danger text-white scale-110 shadow-red-500/20 ring-4 ring-red-500/15' 
                  : 'bg-white text-slate-500 hover:text-slate-705 border border-slate-200 hover:shadow-md'
              }`}>
                <QrCode className="w-6 h-6 stroke-[2.25px]" />
              </div>
              <span className={`text-[9.5px] tracking-wide font-display pt-1 ${activeTab === 'scan' ? 'text-brand-danger font-bold' : 'text-slate-400'}`}>Scan Gizi</span>
            </button>

            {/* Diet Planner Tab Link */}
            <button
              id="nav-tab-planner"
              onClick={() => setActiveTab('planner')}
              className={`flex flex-col items-center gap-1 py-1 px-1.5 transition-all duration-300 relative shrink-0 ${
                activeTab === 'planner' 
                  ? 'text-brand-danger font-semibold scale-105' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Calendar className={`w-5 h-5 transition-all duration-300 ${activeTab === 'planner' ? 'stroke-[2.5px] text-brand-danger' : 'stroke-2'}`} />
              <span className="text-[9.5px] tracking-wide font-display mt-px">Planner</span>
              {activeTab === 'planner' && (
                <span className="absolute bottom-[-6px] w-4 h-1 bg-brand-danger rounded-full"></span>
              )}
            </button>

            {/* Profile Tab Link */}
            <button
              id="nav-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1 py-1 px-1.5 transition-all duration-300 relative shrink-0 ${
                activeTab === 'profile' 
                  ? 'text-brand-danger font-semibold scale-105' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className={`w-5 h-5 transition-all duration-300 ${activeTab === 'profile' ? 'stroke-[2.5px] text-brand-danger' : 'stroke-2'}`} />
              <span className="text-[9.5px] tracking-wide font-display mt-px">Profil</span>
              {activeTab === 'profile' && (
                <span className="absolute bottom-[-6px] w-4 h-1 bg-brand-danger rounded-full"></span>
              )}
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}

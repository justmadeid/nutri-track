import React, { useState, useEffect } from 'react';
import { HealthProfile, MedicalDiagnosis, UserAccount } from '../types';
import { 
  Save, UserCircle2, ArrowRight, HeartPulse, Activity, Sparkles, Scale, Pill, QrCode, 
  Mail, AlertCircle, ShieldAlert, User
} from 'lucide-react';

interface ProfileViewProps {
  onProfileChange: (profile: HealthProfile, extraFields?: { email?: string; allergies?: string; fullName?: string }) => void;
  currentProfile: HealthProfile;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
}

export default function ProfileView({ onProfileChange, currentProfile, currentUser, onLogout }: ProfileViewProps) {
  const [diagnosis, setDiagnosis] = useState<MedicalDiagnosis>(currentProfile.diagnosis);
  const [targetWeight, setTargetWeight] = useState<number>(currentProfile.targetWeight || 70);
  const [routineMedication, setRoutineMedication] = useState<string>(currentProfile.routineMedication || '');
  
  // Extra user details state
  const [fullName, setFullName] = useState<string>(currentUser?.fullName || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [allergies, setAllergies] = useState<string>(currentUser?.allergies || '');
  
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    setDiagnosis(currentProfile.diagnosis);
    setTargetWeight(currentProfile.targetWeight);
    setRoutineMedication(currentProfile.routineMedication);
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setEmail(currentUser.email || '');
      setAllergies(currentUser.allergies || '');
    }
  }, [currentProfile, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: HealthProfile = {
      diagnosis,
      targetWeight: Number(targetWeight),
      routineMedication
    };
    onProfileChange(updatedProfile, {
      fullName,
      email,
      allergies
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const getDiagnosisDescription = (type: MedicalDiagnosis) => {
    switch (type) {
      case 'Diabetes':
        return 'Membatasi makanan berkarbohidrat tinggi, pemanis buatan, sirup, gorengan tepung, nasi berlebih, dan buah berpemanis tambahan.';
      case 'Kolesterol':
        return 'Membatasi jeroan (babat, paru, usus), gulai kental bersantan, sup berlemak, mentega masakan, dan gorengan berulang minyak.';
      case 'Asam Urat':
        return 'Membatasi asupan kaya purin tinggi seperti melinjo (emping), sayuran paku, kangkung berlebih, ragi roti, sarden, teri, dan daging sapi merah lemak.';
      case 'Obesitas':
        return 'Mengontrol porsi asupan energi, membatasi makanan padat kalori lemak, tepung gurih bumbu, martabak manis, dan sirup pemanis.';
      default:
        return '';
    }
  };

  return (
    <div id="profile-view-tab" className="px-5 py-5 animate-fade-in space-y-6 bg-white">
      
      {/* Short Warm Intro */}
      <div id="profile-hero" className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Profil Kesehatan
              </span>
              <h2 className="text-lg font-semibold text-slate-900">
                Halo, {currentUser?.fullName || 'Sahabat Sehat'}!
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[220px]">
                Data medis Anda membantu kami menyajikan rekomendasi gizi yang lebih akurat dan aman.
              </p>
            </div>
          </div>
          {onLogout && (
            <button 
              onClick={onLogout}
              className="px-3 py-1.5 text-[10px] font-semibold text-rose-600 border border-rose-200 rounded-full hover:bg-rose-50 transition-all"
            >
              Keluar
            </button>
          )}
        </div>
      </div>

      {/* Profil Form */}
      <div id="profile-form-container" className="rounded-3xl border border-slate-200 bg-white p-5 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 pb-4 mb-2 border-b border-slate-200">
          <UserCircle2 className="w-5 h-5 text-rose-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Pengaturan Medis & Profil Akun
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Identitas Diri */}
          <div className="space-y-3.5 p-4 bg-white rounded-2xl border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 block tracking-wider uppercase">Identitas Akun</span>
            
            {/* Full Name */}
            <div className="space-y-1">
              <label id="label-fullname" htmlFor="input-fullname" className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Nama Sapaan Lengkap
              </label>
              <input
                id="input-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Made Wiratman"
                required
                className="w-full bg-white border border-slate-200 focus:border-slate-400 p-2.5 rounded-xl text-xs text-slate-800 focus:outline-none transition-all duration-300"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label id="label-email" htmlFor="input-email" className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Alamat Email Aktif
              </label>
              <input
                id="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: made@domain.com"
                required
                className="w-full bg-white border border-slate-200 focus:border-slate-400 p-2.5 rounded-xl text-xs text-slate-800 focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Section 2: Batasan Alergi */}
          <div className="space-y-3.5 p-4 bg-white rounded-2xl border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 block tracking-wider uppercase">Alergi Bawaan Makanan</span>
            
            <div className="space-y-1">
              <label id="label-allergies" htmlFor="input-allergies" className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                Alergi yang Terdaftar
              </label>
              <input
                id="input-allergies"
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Contoh: Udang, Kacang Tanah, susu sapi laktosa"
                className="w-full bg-white border border-slate-200 focus:border-slate-400 p-2.5 rounded-xl text-xs text-slate-800 focus:outline-none transition-all duration-300"
              />
              <p className="text-[9.5px] text-slate-400 leading-relaxed">
                *Pisahkan dengan koma. Alergi ini dibaca otomatis oleh sensor AI saat Anda memindai hidangan warteg.
              </p>
            </div>
          </div>

          {/* Section 3: Pengaturan Medis */}
          <div className="space-y-3.5 p-4 bg-white rounded-2xl border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 block tracking-wider uppercase">Kondisi Klinis & Target</span>

            {/* Diagnosis Dropdown */}
            <div className="space-y-1">
              <label id="label-diagnosis" htmlFor="select-diagnosis" className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                Diagnosis Medis Utama
              </label>
              <select
                id="select-diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value as MedicalDiagnosis)}
                className="w-full bg-white border border-slate-200 focus:border-slate-400 p-2.5 rounded-xl text-xs text-slate-800 focus:outline-none transition-all duration-300 appearance-none font-medium"
              >
                <option value="Diabetes">Diabetes Melitus (Deteksi Kadar Gula)</option>
                <option value="Kolesterol">Hiperkolesterolemia (Kolesterol Tinggi)</option>
                <option value="Asam Urat">Asam Urat / Gout (Deteksi Purin)</option>
                <option value="Obesitas">Obesitas (Kelebihan Lemak / Kalori)</option>
              </select>
              
              {/* Dynamic Diet Rule Box based on selected Diagnosis */}
              <div id="diagnosis-guideline-box" className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Rekomendasi Diet Nutri Track
                </span>
                <p className="text-[11px] leading-relaxed mt-0.5 text-slate-600">
                  {getDiagnosisDescription(diagnosis)}
                </p>
              </div>
            </div>

            {/* Target Weight */}
            <div className="space-y-1">
              <label id="label-target-weight" htmlFor="input-target-weight" className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                Target Berat Badan (kg)
              </label>
              <div className="relative">
                <input
                  id="input-target-weight"
                  type="number"
                  min="30"
                  max="250"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(Number(e.target.value))}
                  placeholder="Contoh: 65"
                  required
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 p-2.5 rounded-xl text-xs text-slate-800 focus:outline-none transition-all duration-300 pl-10"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  kg
                </span>
              </div>
            </div>

            {/* Routine Medication */}
            <div className="space-y-1">
              <label id="label-medication" htmlFor="input-medication" className="text-[11px] font-semibold text-slate-700 block mb-1">
                <Pill className="w-3.5 h-3.5 text-slate-400 inline mr-1" />
                Obat Rutin Konsumsi (Optional)
              </label>
              <input
                id="input-medication"
                type="text"
                value={routineMedication}
                onChange={(e) => setRoutineMedication(e.target.value)}
                placeholder="Contoh: Metformin 500mg, Allopurinol"
                className="w-full bg-white border border-slate-200 focus:border-slate-400 p-2.5 rounded-xl text-xs text-slate-800 focus:outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            id="btn-save-profile"
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Profil Kesehatan</span>
          </button>
        </form>

        {/* Visual toast message on save success */}
        {isSaved && (
          <div 
            id="toast-profile-saved" 
            className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-medium text-center flex items-center justify-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>Profil diperbarui. Aturan diet otomatis terintegrasi.</span>
          </div>
        )}
      </div>

      {/* Checklist Overview Cards */}
      <div id="instruction-cards" className="grid grid-cols-2 gap-3 pb-6">
        <div id="guided-card-1" className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between shadow-sm">
          <div className="w-7 h-7 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center text-amber-600 mb-2">
            <QrCode className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 leading-tight">1. Ambil Foto</span>
          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
            Gunakan kamera HP di warteg/padang untuk menganalisis gizi kilat.
          </p>
        </div>
        <div id="guided-card-2" className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col justify-between shadow-sm">
          <div className="w-7 h-7 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-center text-indigo-600 mb-2">
            <ArrowRight className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-800 leading-tight">2. Lihat Alternatif</span>
          <p className="text-[10px] text-slate-500 mt-1 leading-normal">
            Bila melanggar diagnosis, cari jalan sehat pintas lewat menu rekomendasi.
          </p>
        </div>
      </div>
    </div>
  );
}

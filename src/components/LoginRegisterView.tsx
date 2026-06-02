import React, { useState } from 'react';
import { UserAccount, MedicalDiagnosis } from '../types';
import { 
  ShieldCheck, User, Lock, Activity, ArrowRight, CornerDownRight, 
  Mail, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Check, Compass, Info
} from 'lucide-react';

interface LoginRegisterViewProps {
  onLoginSuccess: (user: UserAccount) => void;
}

const USERS_STORAGE_KEY = 'nutri_track_users_db_v1';

const COMMON_ALLERGENS = [
  'Udang & Siput / Seafood',
  'Kacang Tanah',
  'Telur',
  'Susu Sapi Laktosa',
  'Sari Kedelai',
  'Gluten / Terigu',
  'Terasi / Ebi kering',
];

export default function LoginRegisterView({ onLoginSuccess }: LoginRegisterViewProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States (Multi-step)
  const [registerStep, setRegisterStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  // Step 2 Allergy States
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');

  // Step 3 Health Diagnosis State
  const [diagnosis, setDiagnosis] = useState<MedicalDiagnosis>('Diabetes');
  
  // Info Feedbacks
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Helper to load all registered users DB
  const getStoredUsers = (): UserAccount[] => {
    try {
      const dbStr = localStorage.getItem(USERS_STORAGE_KEY);
      if (dbStr) {
        return JSON.parse(dbStr);
      }
    } catch (e) {
      console.error('Failed to parse users db', e);
    }
    // Inject default user "Made" if free database is empty for friendly walkthroughs!
    return [
      {
        username: 'made',
        fullName: 'Made',
        password: 'made123',
        email: 'made@domain.com',
        allergies: 'Tidak ada alergi bawaan khusus',
        profile: {
          diagnosis: 'Kolesterol',
          targetWeight: 70,
          routineMedication: ''
        }
      }
    ];
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setErrorMsg('Harap isi username dan password lengkap Anda.');
      return;
    }

    const allUsers = getStoredUsers();
    const cleanUsername = loginUsername.trim().toLowerCase();
    
    const matched = allUsers.find(
      u => u.username.toLowerCase() === cleanUsername && u.password === loginPassword
    );

    if (matched) {
      setSuccessMsg(`Selamat datang kembali, ${matched.fullName}!`);
      setTimeout(() => {
        onLoginSuccess(matched);
      }, 700);
    } else {
      setErrorMsg('Username atau Password yang Anda masukkan tidak terdaftar.');
    }
  };

  const handleNextStep1 = () => {
    setErrorMsg('');
    if (!fullName.trim()) {
      setErrorMsg('Harap isi Nama Lengkap Anda.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Harap isi alamat Email yang valid.');
      return;
    }
    if (!registerUsername.trim()) {
      setErrorMsg('Harap tentukan Username baru Anda.');
      return;
    }
    if (registerPassword.length < 4) {
      setErrorMsg('Kata sandi harus terdiri dari minimal 4 karakter.');
      return;
    }

    // Check availability of Username
    const allUsers = getStoredUsers();
    const cleanUsername = registerUsername.trim().toLowerCase();
    const alreadyExists = allUsers.some(u => u.username.toLowerCase() === cleanUsername);
    if (alreadyExists) {
      setErrorMsg('Username sudah digunakan. Silakan pilih username lain.');
      return;
    }

    setRegisterStep(2);
  };

  const handleNextStep2 = () => {
    // Allergy step allows empty/not specified
    setRegisterStep(3);
  };

  const toggleAllergen = ( allergen: string ) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  const handleRegisterFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const allUsers = getStoredUsers();
    const cleanUsername = registerUsername.trim().toLowerCase();

    // Re-verify availability
    const alreadyExists = allUsers.some(u => u.username.toLowerCase() === cleanUsername);
    if (alreadyExists) {
      setErrorMsg('Username telah digunakan oleh pendaftar lain.');
      setRegisterStep(1);
      return;
    }

    // Compile allergy list
    let finalAllergies = selectedAllergens.join(', ');
    if (customAllergy.trim()) {
      finalAllergies = finalAllergies 
        ? `${finalAllergies}, ${customAllergy.trim()}` 
        : customAllergy.trim();
    }
    if (!finalAllergies) {
      finalAllergies = 'Tidak ada alergi bawaan khusus';
    }

    // Allocate dynamic profile
    const newUser: UserAccount = {
      username: cleanUsername,
      fullName: fullName.trim(),
      password: registerPassword,
      email: email.trim(),
      allergies: finalAllergies,
      profile: {
        diagnosis,
        targetWeight: diagnosis === 'Obesitas' ? 65 : 70,
        routineMedication: ''
      }
    };

    const updatedUsers = [...allUsers, newUser];
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    } catch (err) {
      console.error('Failed to register user to DB:', err);
    }

    setSuccessMsg('Akun pendaftaran berhasil diproses! Mengalihkan ke dashboard...');
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1000);
  };

  return (
    <div id="auth-main-container" className="flex flex-col h-full justify-center px-5 py-4 space-y-5 animate-fade-in">
      
      {/* Brand Visualizer */}
      <div className="text-center space-y-1 mt-2">
        <div className="flex items-center justify-center mx-auto">
          <img src="/icons/logo.png" alt="Nutri Track Logo" className="w-24" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display pt-2">
          Gerbang Nutri Track
        </h2>
        <p className="text-xs text-slate-500 leading-normal max-w-[280px] mx-auto font-medium">
          Asisten cerdas pendeteksi nutrisi & mitigasi penyakit klinis kuliner warteg.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 bg-slate-200/50 backdrop-blur-sm p-1 rounded-2xl border border-white/40 shadow-xs">
        <button
          onClick={() => {
            setActiveTab('login');
            setErrorMsg('');
            setSuccessMsg('');
          }}
          className={`py-2 text-[11px] font-extrabold rounded-xl transition-all ${
            activeTab === 'login' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Masuk Akun
        </button>
        <button
          onClick={() => {
            setActiveTab('register');
            setErrorMsg('');
            setSuccessMsg('');
            setRegisterStep(1);
          }}
          className={`py-2 text-[11px] font-extrabold rounded-xl transition-all ${
            activeTab === 'register' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Daftar Baru
        </button>
      </div>

      {/* Primary Container Box */}
      <div className="glass p-5 rounded-3xl space-y-4">
        
        {/* Step Indicator on Register Tab */}
        {activeTab === 'register' && (
          <div className="space-y-2 border-b border-slate-200/40 pb-3">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
              <span className="uppercase tracking-widest text-[#eb4d4b]">LANGKAH DAFTAR</span>
              <span>Langkah {registerStep} dari 3</span>
            </div>
            
            {/* Horizontal progress indicators */}
            <div className="grid grid-cols-3 gap-2">
              <div className={`h-1.5 rounded-full transition-all duration-350 ${registerStep >= 1 ? 'bg-red-500' : 'bg-slate-200'}`}></div>
              <div className={`h-1.5 rounded-full transition-all duration-350 ${registerStep >= 2 ? 'bg-red-500' : 'bg-slate-200'}`}></div>
              <div className={`h-1.5 rounded-full transition-all duration-350 ${registerStep >= 3 ? 'bg-red-500' : 'bg-slate-200'}`}></div>
            </div>

            <div className="flex justify-between text-[9px] font-extrabold text-slate-500">
              <span className={registerStep === 1 ? 'text-slate-900 font-black' : ''}>1. Akun</span>
              <span className={`text-center ${registerStep === 2 ? 'text-slate-900 font-black' : ''}`}>2. Alergi</span>
              <span className={`text-right ${registerStep === 3 ? 'text-slate-900 font-black' : ''}`}>3. Diagnosa</span>
            </div>
          </div>
        )}

        {/* Global Error/Success Display */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-700 text-xs font-semibold leading-relaxed flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-800 text-xs font-semibold leading-relaxed flex items-start gap-1.5 animate-pulse">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {activeTab === 'login' ? (
          /* ================= LOGIN FORM ================= */
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-450" /> Username Demo/Akses
              </label>
              <input
                id="login-username-input"
                type="text"
                value={loginUsername}
                onChange={e => setLoginUsername(e.target.value)}
                placeholder="Masukkan username Anda, ex: rahardjo"
                className="w-full bg-white/60 border border-slate-200 focus:border-red-500 p-3 rounded-2xl text-xs text-slate-800 focus:outline-none transition-all shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-450" /> Kata Sandi (Password)
              </label>
              <input
                id="login-password-input"
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Masukkan kata sandi Anda"
                className="w-full bg-white/60 border border-slate-200 focus:border-red-500 p-3 rounded-2xl text-xs text-slate-800 focus:outline-none transition-all shadow-xs"
              />
            </div>

            <button
              id="login-submit-button"
              type="submit"
              className="w-full py-3 bg-red-500 hover:bg-red-650 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 mt-2"
            >
              <span>Masuk Aplikasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* ================= REGISTER REGISTER REGISTER (3 STEPS) ================= */
          <div className="pt-1">
            {registerStep === 1 && (
              /* STEP 1: INFORMASI UMUM */
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-450" /> Nama Lengkap Sapaan
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Contoh: Bpk. Made Wiratman (48th)"
                    className="w-full bg-white/60 border border-slate-200 focus:border-red-500 p-3 rounded-2xl text-xs text-slate-800 focus:outline-none transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-450" /> Alamat Email Aktif
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Contoh: made.wira@gmail.com"
                    className="w-full bg-white/60 border border-slate-200 focus:border-red-500 p-3 rounded-2xl text-xs text-slate-800 focus:outline-none transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-450" /> Username Akun Baru
                  </label>
                  <input
                    id="reg-username"
                    type="text"
                    value={registerUsername}
                    onChange={e => setRegisterUsername(e.target.value)}
                    placeholder="Contoh: madewira"
                    className="w-full bg-white/60 border border-slate-200 focus:border-red-500 p-3 rounded-2xl text-xs text-slate-800 focus:outline-none transition-all shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-450" /> Sandi Akun
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                    placeholder="Minimal 4 karakter atau lebih"
                    className="w-full bg-white/60 border border-slate-200 focus:border-red-500 p-3 rounded-2xl text-xs text-slate-800 focus:outline-none transition-all shadow-xs"
                  />
                </div>

                <button
                  id="reg-step1-btn"
                  type="button"
                  onClick={handleNextStep1}
                  className="w-full py-3 bg-red-500 hover:bg-red-650 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 mt-4"
                >
                  <span>Lanjut (Alergi Makanan)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {registerStep === 2 && (
              /* STEP 2: ALERGI MAKANAN */
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-slate-700 block mb-1">
                    Pilih Alergi Makanan Anda (Bisa Lebih dari Satu):
                  </span>
                  
                  {/* Allergen Interactive grid pills wrapper */}
                  <div className="flex flex-wrap gap-2">
                    {COMMON_ALLERGENS.map((allergen, idx) => {
                      const isSelected = selectedAllergens.includes(allergen);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleAllergen(allergen)}
                          className={`px-3 py-2 text-xs font-bold rounded-2xl border transition-all text-left flex items-center gap-1.5 ${
                            isSelected 
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-700' 
                              : 'bg-white/50 border-slate-200 text-slate-650 hover:bg-slate-100/50'
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                          </span>
                          <span>{allergen}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1">
                    Alergi Lainnya (Pisahkan dengan koma)
                  </label>
                  <input
                    id="reg-custom-allergen"
                    type="text"
                    value={customAllergy}
                    onChange={e => setCustomAllergy(e.target.value)}
                    placeholder="Contoh: Kacang mede, Ikan tongkol basah"
                    className="w-full bg-white/60 border border-slate-200 focus:border-red-500 p-3 rounded-2xl text-xs text-slate-800 focus:outline-none transition-all shadow-xs"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                    *Alergi yang terdaftar akan otomatis disandingkan & dideteksi ketika Anda memindai atau membaca agenda makan.
                  </p>
                </div>

                {/* Navigation Buttons for Step 2 */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegisterStep(1)}
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                  <button
                    id="reg-step2-btn"
                    type="button"
                    onClick={handleNextStep2}
                    className="py-3 bg-red-500 hover:bg-red-650 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>Lanjut (Diagnosa)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {registerStep === 3 && (
              /* STEP 3: DIAGNOSIS KESEHATAN */
              <form onSubmit={handleRegisterFinalSubmit} className="space-y-4">
                <span className="text-[11px] font-extrabold text-slate-700 block mb-1">
                  Pilih Diagnosis Kesehatan Utama Anda:
                </span>

                {/* Grid of Diagnoses choices with detailed summary cards */}
                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDiagnosis('Diabetes')}
                    className={`p-3 text-left rounded-2xl border transition-all flex items-start gap-3 h-auto ${
                      diagnosis === 'Diabetes'
                        ? 'bg-rose-500/10 border-rose-500/40 text-slate-800 shadow-xs'
                        : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-slate-100/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold ${diagnosis === 'Diabetes' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-550'}`}>
                      D
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-none">Diabetes Melitus</h4>
                      <p className="text-[10px] text-slate-500 leading-normal font-semibold mt-1">
                        Memantau ketat kandungan gula sederhana, karbohidrat olahan tinggi, serta nasi putih berlebih agar gula darah stabil.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiagnosis('Kolesterol')}
                    className={`p-3 text-left rounded-2xl border transition-all flex items-start gap-3 h-auto ${
                      diagnosis === 'Kolesterol'
                        ? 'bg-rose-500/10 border-rose-500/40 text-slate-800 shadow-xs'
                        : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-slate-100/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold ${diagnosis === 'Kolesterol' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-550'}`}>
                      K
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-none">Hiperkolesterolemia</h4>
                      <p className="text-[10px] text-slate-500 leading-normal font-semibold mt-1">
                        Mengurangi konsumsi masakan bersantan pekat, daging berlemak ekstrem, olahan kikil kenyal, serta gorengan minyak jenuh.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiagnosis('Asam Urat')}
                    className={`p-3 text-left rounded-2xl border transition-all flex items-start gap-3 h-auto ${
                      diagnosis === 'Asam Urat'
                        ? 'bg-rose-500/10 border-rose-500/40 text-slate-800 shadow-xs'
                        : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-slate-100/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold ${diagnosis === 'Asam Urat' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-550'}`}>
                      A
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-none">Asam Urat (Gout)</h4>
                      <p className="text-[10px] text-slate-500 leading-normal font-semibold mt-1">
                        Membatasi asupan kaya purin tinggi seperti jeroan sapi, kerang laut mentah, kerupuk emping melinjo, dan daun daun melinjo.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiagnosis('Obesitas')}
                    className={`p-3 text-left rounded-2xl border transition-all flex items-start gap-3 h-auto ${
                      diagnosis === 'Obesitas'
                        ? 'bg-rose-500/10 border-rose-500/40 text-slate-800 shadow-xs'
                        : 'bg-white/50 border-slate-200 text-slate-600 hover:bg-slate-100/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold ${diagnosis === 'Obesitas' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-550'}`}>
                      O
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-none">Obesitas / Defisit Energi</h4>
                      <p className="text-[10px] text-slate-500 leading-normal font-semibold mt-1">
                        Fokus pada defisit kalori harian yang seimbang dengan mengoptimalkan asupan masakan berserat, dada ayam rebus, dan lalapan segar.
                      </p>
                    </div>
                  </button>
                </div>
                {/* Navigation Buttons for Step 3 */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRegisterStep(2)}
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                  <button
                    id="reg-submit-btn"
                    type="submit"
                    className="py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>Daftar & Masuk</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

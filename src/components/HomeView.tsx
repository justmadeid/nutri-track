import React, { useState, useEffect, useMemo } from 'react';
import { HealthProfile, ScanHistoryItem, DietPlanDay, MealSlot } from '../types';
import { 
  Sparkles, CheckCircle, Flame, Heart, AlertCircle, Play, 
  Download, Smartphone, Apple, Share, Compass, Plus, Award, ShieldAlert
} from 'lucide-react';

interface HomeViewProps {
  currentProfile: HealthProfile;
  currentUser: { fullName: string; username: string };
  onSaveToHistory: (item: ScanHistoryItem) => void;
  setActiveTab: (tab: 'profile' | 'scan' | 'dashboard' | 'planner') => void;
}

const PLAN_STORAGE_KEY = 'nutri_track_diet_planner_v1';

// Daily Default Meal Plans to read initial status if not customized in local storage
const CLINICAL_TEMPLATES: Record<string, DietPlanDay[]> = {
  Diabetes: [
    { day: 'Senin', pagi: { name: 'Telur Rebus 2 Butir & Teh Tawar Hangat', isAman: true, isEaten: false }, siang: { name: 'Nasi Merah + Ayam Bakar Padang Dada + Daun Singkong Rebus', isAman: true, isEaten: false }, malam: { name: 'Cap Cay Kuah Sayur + Tahu Bacem Kudus', isAman: true, isEaten: false } },
    { day: 'Selasa', pagi: { name: 'Nasi Uduk Komplit Jeroan Gunting Kulit', isAman: false, isEaten: false }, siang: { name: 'Soto Ayam Kuah Bening Kediri + Tempe Kukus', isAman: true, isEaten: false }, malam: { name: 'Tumis Buncis Bawang Putih + Telur Dadar Air', isAman: true, isEaten: false } },
    { day: 'Rabu', pagi: { name: 'Roti Gandum Panggang Alpukat Kupas', isAman: true, isEaten: false }, siang: { name: 'Nasi Padang Rendang (Tanpa siraman kuah gulai kental)', isAman: true, isEaten: false }, malam: { name: 'Sayur Sop Wortel Jamur Kuping + Pepes Tahu', isAman: true, isEaten: false } },
    { day: 'Kamis', pagi: { name: 'Bubur Ayam Polos tanpa kuah kuning berminyak', isAman: true, isEaten: false }, siang: { name: 'Mie Instan Kuah Spesial Sosis Bakso', isAman: false, isEaten: false }, malam: { name: 'Gado-gado Komplit Saus Kacang Pisah', isAman: true, isEaten: false } },
    { day: 'Jumat', pagi: { name: 'Oatmeal Keju parut tipis + Pisang Ambon', isAman: true, isEaten: false }, siang: { name: 'Soto Bening Warteg + Ikan Kembung Kuning Kukus', isAman: true, isEaten: false }, malam: { name: 'Nasi Putih setengah porsi + Orek Tempe kering manis', isAman: false, isEaten: false } },
    { day: 'Sabtu', pagi: { name: 'Telur Orak Arik Mentega sedikit + Sayuran', isAman: true, isEaten: false }, siang: { name: 'Sate Ayam Tanpa Bumbu Kacang kental manis', isAman: true, isEaten: false }, malam: { name: 'Sayur Sop Ayam kampung bening herbal', isAman: true, isEaten: false } },
    { day: 'Minggu', pagi: { name: 'Kopi Hitam Tanpa Gula + Singkong Rebus', isAman: true, isEaten: false }, siang: { name: 'Nasi Goreng Warteg Kambing penuh lemak', isAman: false, isEaten: false }, malam: { name: 'Tumis Labu Siam + Pepes Ikan Mas segar', isAman: true, isEaten: false } }
  ],
  Kolesterol: [
    { day: 'Senin', pagi: { name: 'Bubur Ayam Kuah Kuning Tanpa Ati Ampela Kulit', isAman: true, isEaten: false }, siang: { name: 'Soto Ayam Kuah bening + Ikan Kembung bakar sambal', isAman: true, isEaten: false }, malam: { name: 'Pepes Tahu Kemangi + Cah Sayur Sawi Bawang Putih', isAman: true, isEaten: false } },
    { day: 'Selasa', pagi: { name: 'Telur Rebus Bulat 2 Butir (Makan putihnya saja)', isAman: true, isEaten: false }, siang: { name: 'Gulai Kikil Tunjang bersantan kenyal', isAman: false, isEaten: false }, malam: { name: 'Cap Cay Rebus Bakso Sayur Warteg', isAman: true, isEaten: false } },
    { day: 'Rabu', pagi: { name: 'Oatmeal Polos + Potongan Buah Naga segar', isAman: true, isEaten: false }, siang: { name: 'Ayam Pop Padang kupas Kulit + Sayur rebus', isAman: true, isEaten: false }, malam: { name: 'Tumis Tempe & Kacang Panjang kuah sedikit', isAman: true, isEaten: false } },
    { day: 'Kamis', pagi: { name: 'Roti Panggang Oles Selai Kacang murni', isAman: true, isEaten: false }, siang: { name: 'Nasi Bakar Tongkol suwir non-santan', isAman: true, isEaten: false }, malam: { name: 'Cumi Goreng Tepung Crispy berminyak', isAman: false, isEaten: false } },
    { day: 'Jumat', pagi: { name: 'Teh Hijau hangat + Kentang Kukus kulit', isAman: true, isEaten: false }, siang: { name: 'Pecel Sayur Madiun bumbu kacang encer', isAman: true, isEaten: false }, malam: { name: 'Dendeng Sapi Balado Kering berminyak hitam', isAman: false, isEaten: false } },
    { day: 'Sabtu', pagi: { name: 'Roti Gandum isi Selada Tomat Timun', isAman: true, isEaten: false }, siang: { name: 'Sate Padang saus gulai organ Lidah Jeroan', isAman: false, isEaten: false }, malam: { name: 'Pepes Ikan Nila kemangi kukus hangat', isAman: true, isEaten: false } },
    { day: 'Minggu', pagi: { name: 'Susu Kedelai Murni tanpa pemanis + Roti', isAman: true, isEaten: false }, siang: { name: 'Sup Ikan Tomat segar kuah bening asam pedas', isAman: true, isEaten: false }, malam: { name: 'Ayam Goreng Tepung Crispy Double Dada', isAman: false, isEaten: false } }
  ],
  'Asam Urat': [
    { day: 'Senin', pagi: { name: 'Telur Mata Sapi minimal minyak + Roti Tawar', isAman: true, isEaten: false }, siang: { name: 'Sayur Sop Wortel Kentang Bakso + Tempe Goreng', isAman: true, isEaten: false }, malam: { name: 'Pepes Nila Kukus Kemangi bumbu kunir', isAman: true, isEaten: false } },
    { day: 'Selasa', pagi: { name: 'Roti Tawar Gandum + Selai Stroberi tipis', isAman: true, isEaten: false }, siang: { name: 'Tumis Daun Melinjo teri medan garing pekat', isAman: false, isEaten: false }, malam: { name: 'Sup Bening Sayur Gambas Oyong + Tahu Kukus', isAman: true, isEaten: false } },
    { day: 'Rabu', pagi: { name: 'Singkong Rebus Gurih Kelapa parut dikit', isAman: true, isEaten: false }, siang: { name: 'Dendeng Balado Daging Sapi Kering Padang', isAman: true, isEaten: false }, malam: { name: 'Tumis Kangkung minyak cabe + Kerupuk Udang', isAman: false, isEaten: false } },
    { day: 'Kamis', pagi: { name: 'Susu Rendah Lemak Segelas + Pisang Ambon', isAman: true, isEaten: false }, siang: { name: 'Ayam Bakar Padang Dada + Tumis Labu Siam jernih', isAman: true, isEaten: false }, malam: { name: 'Tumis Oyong Soun kuah kaldu jamur bening', isAman: true, isEaten: false } },
    { day: 'Jumat', pagi: { name: 'Telur Rebus 2 Butir + Kacang Hijau kental susu', isAman: false, isEaten: false }, siang: { name: 'Sop Buntut Sapi kuah gurih bumbu rempah', isAman: true, isEaten: false }, malam: { name: 'Pepes Tahu Telur Mas asin hancur kukus', isAman: true, isEaten: false } },
    { day: 'Sabtu', pagi: { name: 'Roti Tawar Panggang polos margarin tipis', isAman: true, isEaten: false }, siang: { name: 'Sayur Asem Jakarta Warteg (Singkirkan Melinjonya)', isAman: true, isEaten: false }, malam: { name: 'Martabak Telor Gurih dengan acar timun pekat', isAman: false, isEaten: false } },
    { day: 'Minggu', pagi: { name: 'Teh Hangat + Ubi Cilembu Madu bakar', isAman: true, isEaten: false }, siang: { name: 'Gulai Babat Usus ragi Padang pedas kental', isAman: false, isEaten: false }, malam: { name: 'Nasi Putih setengah + Pepes Ikan Mas lezat', isAman: true, isEaten: false } }
  ],
  Obesitas: [
    { day: 'Senin', pagi: { name: 'Roti Panggang Telur Ceplok air + Apel Merah', isAman: true, isEaten: false }, siang: { name: 'Soto Dada Ayam tanpa soun + Pepes Tahu hangat', isAman: true, isEaten: false }, malam: { name: 'Sup Bening Bakso Sapi + Brokoli Wortel Kukus', isAman: true, isEaten: false } },
    { day: 'Selasa', pagi: { name: 'Lontong Sayur Betawi Kuah Gulai Santan Pekat', isAman: false, isEaten: false }, siang: { name: 'Nasi Merah setengah + Ayam Bakar kupas kulit + Lalapan', isAman: true, isEaten: false }, malam: { name: 'Tumis Buncis Tahu + Orek Tempe non-minyak jenuh', isAman: true, isEaten: false } },
    { day: 'Rabu', pagi: { name: 'Bubur Kacang Hijau non-Santan pakai susu krim', isAman: true, isEaten: false }, siang: { name: 'Gado-gado Sayur Komplit bumbu kacang encer sedikit', isAman: true, isEaten: false }, malam: { name: 'Nasi Goreng Gila Margarin penuh minyak', isAman: false, isEaten: false } },
    { day: 'Kamis', pagi: { name: 'Oatmeal Air hangat + 1 Sendok Madu murni', isAman: true, isEaten: false }, siang: { name: 'Cap Cay Rebus kuah kental sayuran campur dada ayam', isAman: true, isEaten: false }, malam: { name: 'Sate Kambing gajih lemak bakar pedas manis', isAman: false, isEaten: false } },
    { day: 'Jumat', pagi: { name: 'Pisang Mas Kukas 2 buah + Teh Tawar hangat', isAman: true, isEaten: false }, siang: { name: 'Ikan Mas Bakar bumbu jeruk nipis tanpa santan', isAman: true, isEaten: false }, malam: { name: 'Fried Chicken Renyah Paha Bawah Kulit renyah', isAman: false, isEaten: false } },
    { day: 'Sabtu', pagi: { name: 'Putih Telur dadar teflon anti lengket daun bawang', isAman: true, isEaten: false }, siang: { name: 'Sop Ikan Gurame kuah bening daun kemangi pedas', isAman: true, isEaten: false }, malam: { name: 'Pepes Jamur Merang + Tempe Bacem Kukus hangat', isAman: true, isEaten: false } },
    { day: 'Minggu', pagi: { name: 'Roti Gandum Bakar + Selada Air + Daging Dada Asap', isAman: true, isEaten: false }, siang: { name: 'Nasi Padang Kikil Tunjang + Perkedel goreng tepung', isAman: false, isEaten: false }, malam: { name: 'Tumis Labu Siam iris tipis + Tahu Kukus kuah bumbu', isAman: true, isEaten: false } }
  ]
};

// Recommended Clinical Food & Warteg Tips base of Diagnosis
const RECOMMENDED_FOOD_CARDS: Record<string, { title: string; desc: string; image: string; tag: string }[]> = {
  Diabetes: [
    { title: 'Iwak Bakar Bumbu Jahe', desc: 'Protein istimewa pendukung kestabilan glukosa darah alami.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60', tag: 'Aman Gula' },
    { title: 'Daun Singkong Rebus', desc: 'Menu sayur warteg kaya serat tinggi memperlambat glikemik.', image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&auto=format&fit=crop&q=60', tag: 'Serat Tinggi' },
    { title: 'Sop Bening Ayam Kampung', desc: 'Asupan cairan alami rendah karbohidrat olahan tepung.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=60', tag: 'Sup Rendah Gula' }
  ],
  Kolesterol: [
    { title: 'Pepes Tahu Kemangi', desc: 'Protein kedelai kukus bebas kolesterol hewani & lemak jenuh santan.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60', tag: 'Bebas Kolesterol' },
    { title: 'Ikan Kembung Panggang', desc: 'Memiliki kandungan Omega-3 melimpah penurun LDL & Trigliserida.', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=60', tag: 'Omega-3 Tinggi' },
    { title: 'Gado-Gado (Saus Sedikit)', desc: 'Penghalang kolesterol lemak trans berkat fitosterol alami.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=60', tag: 'Fitosterol Sayur' }
  ],
  'Asam Urat': [
    { title: 'Sup Oyong Gambas Soun', desc: 'Aman dikonsumsi harian karena memiliki kadar purin sangat rendah.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&auto=format&fit=crop&q=60', tag: 'Rendah Purin' },
    { title: 'Ubi Cilembu Panggang', desc: 'Karbohidrat kompleks ramah ekskresi purin melalui ginjal.', image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&auto=format&fit=crop&q=60', tag: 'Bebas Purin' },
    { title: 'Telur Rebus Organik', desc: 'Pilihan protein utama pengganti protein jeroan & daging merah.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=60', tag: 'Protein Terbaik' }
  ],
  Obesitas: [
    { title: 'Tumis Buncis Tahu Kupas', desc: 'Membantu pembakaran lipid tubuh dengan kalori seminimal mugkin.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=60', tag: 'Rendah Kalori' },
    { title: 'Pecel Madiun Tanpa Gorengan', desc: 'Volume sayur mengenyangkan lambung tanpa lemak jenuh ekstra.', image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&auto=format&fit=crop&q=60', tag: 'Defisit Kalori' },
    { title: 'Dada Ayam Panggang', desc: 'Suplai asam amino pembangun massa otot tanpa gajih lemak.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60', tag: 'Kaya Protein' }
  ]
};

export default function HomeView({ currentProfile, currentUser, onSaveToHistory, setActiveTab }: HomeViewProps) {
  const diagnosis = currentProfile.diagnosis;
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [successInstallSim, setSuccessInstallSim] = useState(false);

  // Time Greeting Calculation
  const greetingText = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 11) return 'Selamat Pagi';
    if (hours < 15) return 'Selamat Siang';
    if (hours < 19) return 'Selamat Sore';
    return 'Selamat Malam';
  }, []);

  // Day Name Calculation
  const indonesianDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const todayName = useMemo(() => {
    return indonesianDays[new Date().getDay()];
  }, []);

  // Load today's meals from planner state in localStorage or fall back to templates
  const [todayPlan, setTodayPlan] = useState<DietPlanDay>(() => {
    try {
      const stored = localStorage.getItem(`${PLAN_STORAGE_KEY}_${diagnosis}`);
      if (stored) {
        const decoded: DietPlanDay[] = JSON.parse(stored);
        const match = decoded.find(d => d.day === todayName);
        if (match) return match;
      }
    } catch (e) {
      console.error(e);
    }
    const templateList = CLINICAL_TEMPLATES[diagnosis] || CLINICAL_TEMPLATES['Diabetes'];
    return templateList.find(d => d.day === todayName) || templateList[0];
  });

  // Re-run listener on profile/diagnosis load
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${PLAN_STORAGE_KEY}_${diagnosis}`);
      if (stored) {
        const decoded: DietPlanDay[] = JSON.parse(stored);
        const match = decoded.find(d => d.day === todayName);
        if (match) {
          setTodayPlan(match);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const templateList = CLINICAL_TEMPLATES[diagnosis] || CLINICAL_TEMPLATES['Diabetes'];
    setTodayPlan(templateList.find(d => d.day === todayName) || templateList[0]);
  }, [diagnosis, todayName]);

  // Calories and Macronutrients estimates for completed meals
  const mealCalorieDetails = useMemo(() => {
    // Sarapan, makan siang, makan malam standard values
    const config = { 
      pagi: { calories: 320, carbs: 40, protein: 12, fat: 10 }, 
      siang: { calories: 580, carbs: 75, protein: 28, fat: 18 }, 
      malam: { calories: 440, carbs: 55, protein: 22, fat: 12 }
    };
    const maxDayTarget = diagnosis === 'Obesitas' ? 1450 : diagnosis === 'Diabetes' ? 1600 : 1800;

    let totalDone = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let safeCount = 0;

    if (todayPlan.pagi.isEaten) {
      totalDone += config.pagi.calories;
      totalCarbs += config.pagi.carbs;
      totalProtein += config.pagi.protein;
      totalFat += config.pagi.fat;
      if (todayPlan.pagi.isAman) safeCount++;
    }
    if (todayPlan.siang.isEaten) {
      totalDone += config.siang.calories;
      totalCarbs += config.siang.carbs;
      totalProtein += config.siang.protein;
      totalFat += config.siang.fat;
      if (todayPlan.siang.isAman) safeCount++;
    }
    if (todayPlan.malam.isEaten) {
      totalDone += config.malam.calories;
      totalCarbs += config.malam.carbs;
      totalProtein += config.malam.protein;
      totalFat += config.malam.fat;
      if (todayPlan.malam.isAman) safeCount++;
    }

    const percentage = Math.round((totalDone / maxDayTarget) * 100);

    return {
      eatenCalories: totalDone,
      targetCalories: maxDayTarget,
      percentage: percentage > 100 ? 100 : percentage,
      eatenCarbs: totalCarbs,
      eatenProtein: totalProtein,
      eatenFat: totalFat,
      safeCount
    };
  }, [todayPlan, diagnosis]);

  // Quick Action Switch Eaten State
  const handleQuickToggle = (slot: MealSlot) => {
    const updatedPlan = {
      ...todayPlan,
      [slot]: {
        ...todayPlan[slot],
        isEaten: !todayPlan[slot].isEaten
      }
    };

    setTodayPlan(updatedPlan);

    // Save back to master array
    try {
      const stored = localStorage.getItem(`${PLAN_STORAGE_KEY}_${diagnosis}`);
      let masterPlans: DietPlanDay[] = stored 
        ? JSON.parse(stored) 
        : CLINICAL_TEMPLATES[diagnosis] || CLINICAL_TEMPLATES['Diabetes'];

      const index = masterPlans.findIndex(d => d.day === todayName);
      if (index !== -1) {
        masterPlans[index] = updatedPlan;
      } else {
        masterPlans.push(updatedPlan);
      }

      localStorage.setItem(`${PLAN_STORAGE_KEY}_${diagnosis}`, JSON.stringify(masterPlans));

      // Show synchronized alert to notify user that it adds up dynamically to scan history list
      if (updatedPlan[slot].isEaten) {
        onSaveToHistory({
          id: `quick-home-${slot}-${Date.now()}`,
          food_name: updatedPlan[slot].name.split(' + ')[0],
          detected_ingredients: [updatedPlan[slot].name, 'Saran Menu Hari Ini'],
          risk_status: updatedPlan[slot].isAman ? 'Aman' : 'Berisiko Tinggi',
          risk_score: updatedPlan[slot].isAman ? 12 : 80,
          xai_explanation: `Menu terdaftar otomatis melalui penandaan kilat layar utama pada hari ${todayName} Anda.`,
          alternative_suggestion: 'Saran nutrisi disesuaikan penuh.',
          timestamp: new Date().toISOString(),
          imageUrl: updatedPlan[slot].isAman 
            ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60' 
            : 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=60'
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateInstall = () => {
    setSuccessInstallSim(true);
    setTimeout(() => {
      setShowPwaModal(false);
      setSuccessInstallSim(false);
      alert('Selamat! Nutri Track berhasil dipasang di layar utama (home screen) gawai Anda.');
    }, 2000);
  };

  return (
    <div id="overview-home-tab" className="px-5 py-4 animate-fade-in space-y-5">
      
      {/* Dynamic Welcoming Greeting Card */}
      <div className="glass p-5 rounded-3xl relative overflow-hidden shadow-sm flex items-center justify-between bg-gradient-to-tr from-rose-500/10 via-white/40 to-amber-500/5 border border-white/60">
        <div className="space-y-1.5 z-10">
          <span className="text-[10px] font-extrabold text-brand-danger bg-red-100/50 px-2.5 py-1 rounded-full border border-red-500/10 inline-block uppercase tracking-wider">
            {todayName}, {new Date().toLocaleDateString('id-ID', { month: 'long', day: 'numeric' })}
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight pt-1">
            Halo, {currentUser?.fullName || 'Sobat Sehat'}!
          </h2>
          <p className="text-xs text-slate-500 leading-snug font-medium max-w-[210px]">
            {greetingText}. Mari pantau terus asupan nutrisi lokal Anda agar tetap seimbang dengan diagnosa <span className="font-bold text-[#eb4d4b]">{diagnosis}</span>.
          </p>
        </div>
      </div>

      {/* Calories Overview Widget */}
      <div className="glass p-5 rounded-3xl shadow-md border border-white/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase">PENCAPAIAN NUTRISI HARI INI</span>
            <h3 className="text-sm font-black text-slate-800 tracking-tight">Capaian Kalori & Asupan</h3>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold">
            <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
            <span>Target: {mealCalorieDetails.targetCalories} kkal</span>
          </div>
        </div>

        {/* Energy bar visualizer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
            <span>{mealCalorieDetails.eatenCalories} kkal Berhasil Terpenuhi</span>
            <span className="text-[#eb4d4b]">{mealCalorieDetails.percentage}%</span>
          </div>
          <div className="w-full bg-slate-200/60 rounded-full h-3 overflow-hidden border border-white/20 p-0.5">
            <div 
              className="bg-gradient-to-r from-orange-400 via-[#eb4d4b] to-red-600 h-2 rounded-full transition-all duration-700 relative overflow-hidden"
              style={{ width: `${mealCalorieDetails.percentage}%` }}
            >
              <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            </div>
          </div>
          <p className="text-[10px] font-semibold text-slate-500 leading-normal">
            *Asumsi perkiraan didasarkan pada riwayat porsi makan warteg standar. Tandai makan di bawah ini untuk melihat update persentase.
          </p>
        </div>

        {/* Macro achievements today */}
        <div className="grid grid-cols-3 gap-2 py-2 px-1 bg-slate-50/50 border border-slate-200/30 rounded-2xl">
          <div className="text-center">
            <span className="text-[8px] font-black text-slate-400 block tracking-wider uppercase">Karbohidrat</span>
            <span className="text-xs font-black text-amber-700 mt-1 inline-block">{mealCalorieDetails.eatenCarbs}g</span>
          </div>
          <div className="text-center border-x border-slate-200/50">
            <span className="text-[8px] font-black text-slate-400 block tracking-wider uppercase">Protein</span>
            <span className="text-xs font-black text-blue-600 mt-1 inline-block">{mealCalorieDetails.eatenProtein}g</span>
          </div>
          <div className="text-center">
            <span className="text-[8px] font-black text-slate-400 block tracking-wider uppercase">Lemak</span>
            <span className="text-xs font-black text-[#eb4d4b] mt-1 inline-block">{mealCalorieDetails.eatenFat}g</span>
          </div>
        </div>

        {/* Quick checkoff checklist for today */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={() => handleQuickToggle('pagi')}
            className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-[86px] ${
              todayPlan.pagi.isEaten 
                ? 'bg-emerald-50 border-emerald-200 text-slate-800' 
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-[9px] font-semibold text-slate-400 block tracking-wider uppercase">Sarapan</span>
            <span className="text-[11px] font-semibold text-slate-900 leading-snug truncate w-full pt-1">
              {todayPlan.pagi.name.split(' + ')[0]}
            </span>
            <div className="flex justify-between items-end w-full mt-2">
              <span className="text-[9px] font-semibold text-slate-500">320 kkal</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                todayPlan.pagi.isEaten ? 'bg-emerald-500' : 'border border-slate-300'
              }`}>
                <CheckCircle className={`h-3.5 w-3.5 ${
                  todayPlan.pagi.isEaten ? 'text-white' : 'text-slate-300'
                }`} />
              </span>
            </div>
          </button>

          <button
            onClick={() => handleQuickToggle('siang')}
            className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-[86px] ${
              todayPlan.siang.isEaten 
                ? 'bg-emerald-50 border-emerald-200 text-slate-800' 
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-[9px] font-semibold text-slate-400 block tracking-wider uppercase">Siang</span>
            <span className="text-[11px] font-semibold text-slate-900 leading-snug truncate w-full pt-1">
              {todayPlan.siang.name.split(' + ')[0]}
            </span>
            <div className="flex justify-between items-end w-full mt-2">
              <span className="text-[9px] font-semibold text-slate-500">580 kkal</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                todayPlan.siang.isEaten ? 'bg-emerald-500' : 'border border-slate-300'
              }`}>
                <CheckCircle className={`h-3.5 w-3.5 ${
                  todayPlan.siang.isEaten ? 'text-white' : 'text-slate-300'
                }`} />
              </span>
            </div>
          </button>

          <button
            onClick={() => handleQuickToggle('malam')}
            className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between h-[86px] ${
              todayPlan.malam.isEaten 
                ? 'bg-emerald-50 border-emerald-200 text-slate-800' 
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="text-[9px] font-semibold text-slate-400 block tracking-wider uppercase">Malam</span>
            <span className="text-[11px] font-semibold text-slate-900 leading-snug truncate w-full pt-1">
              {todayPlan.malam.name.split(' + ')[0]}
            </span>
            <div className="flex justify-between items-end w-full mt-2">
              <span className="text-[9px] font-semibold text-slate-500">440 kkal</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full transition-all ${
                todayPlan.malam.isEaten ? 'bg-emerald-500' : 'border border-slate-300'
              }`}>
                <CheckCircle className={`h-3.5 w-3.5 ${
                  todayPlan.malam.isEaten ? 'text-white' : 'text-slate-300'
                }`} />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Clinical Food Recommendation Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-semibold text-slate-900">
              Rekomendasi Kuliner ({diagnosis})
            </h4>
          </div>
          <button 
            onClick={() => setActiveTab('planner')}
            className="text-[10px] font-semibold text-slate-500 hover:text-slate-700"
          >
            Lihat Agenda
          </button>
        </div>

        {/* Dynamic Horizontal Scroll list for recommended food items */}
        <div className="flex gap-3 overflow-x-auto py-1 no-scrollbar scroll-smooth px-1">
          {RECOMMENDED_FOOD_CARDS[diagnosis]?.map((item, id) => (
            <div 
              key={id}
              className="bg-white rounded-2xl w-[190px] border border-slate-200 overflow-hidden shrink-0 shadow-sm flex flex-col"
            >
              <div className="w-full h-24 overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-semibold uppercase text-emerald-700 bg-white/90 border border-emerald-200 leading-none">
                  {item.tag}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between space-y-1">
                <h5 className="text-[12px] font-semibold text-slate-900">{item.title}</h5>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium flex-1">
                  {item.desc}
                </p>
                <button 
                  onClick={() => setActiveTab('planner')}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Clinical Tip Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-rose-600 block tracking-wide">Pemberitahuan Proteksi Medis</span>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Pastikan untuk selalu melakukan cross-check dengan dokter gizi utama Anda. Nutri Track dirancang berbasis rekomendasi umum kuliner warteg di Indonesia agar risiko kambuhnya penyakit Anda tetap terkontrol.
          </p>
        </div>
      </div>

      {/* MODAL: PWA Install Tutorial */}
      {showPwaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl w-full max-w-[360px] max-h-[580px] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-fade-in text-slate-800">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-950 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-red-400" />
                <h4 className="text-sm font-extrabold">Pasang Aplikasi Nutri Track</h4>
              </div>
              <button
                onClick={() => setShowPwaModal(false)}
                className="text-xs font-bold text-slate-350 hover:text-white px-2.5 py-1 bg-white/10 hover:bg-white/15 rounded-xl transition"
              >
                Tutup
              </button>
            </div>

            {/* Modal Guide Area */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-semibold no-scrollbar">
              <p className="text-slate-500 leading-relaxed font-medium">
                Sistem pendeteksi nutrisi lokal dapat bekerja penuh layaknya aplikasi native smartphone dengan memasangkannya ke Home Screen Anda:
              </p>

              {/* Simulation State */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-brand-danger flex items-center justify-center text-white text-lg font-black shrink-0 relative shadow-sm">
                  NT
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-black">Nutri Track Lite</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">V1.5 (PWA-Optimized)</span>
                </div>

                {!successInstallSim ? (
                  <button
                    onClick={handleSimulateInstall}
                    className="w-full py-2.5 bg-brand-danger hover:bg-red-650 text-white text-[10px] font-extrabold rounded-xl transition-all shadow-md active:scale-95"
                  >
                    Pasang Sekarang (Instan)
                  </button>
                ) : (
                  <div className="w-full py-2.5 bg-slate-200 text-slate-600 text-[10px] font-extrabold rounded-xl text-center flex items-center justify-center gap-1.5 animate-pulse">
                    <span>Memasang Pintasan Screen...</span>
                  </div>
                )}
              </div>

              {/* Guide for iOS */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black text-rose-600 flex items-center gap-1 uppercase tracking-wider">
                  <Apple className="w-3.5 h-3.5" /> Untuk Pengguna iOS (Safari iPhone/iPad):
                </span>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-550 font-medium leading-relaxed">
                  <li>Buka aplikasi Safari Anda lalu kunjungi web ini.</li>
                  <li>Tap tombol <Share className="w-3 h-3 text-blue-500 inline mx-0.5" /> <strong>"Share / Bagikan"</strong> di navigasi layar bawah Safari.</li>
                  <li>Scroll sedikit ke bawah, pilih opsi <strong>"Tambahkan ke Layar Utama / Add to Home Screen"</strong>.</li>
                  <li>Tap <strong>"Tambahkan"</strong> di pojok kanan atas untuk mengonfirmasi.</li>
                </ol>
              </div>

              {/* Guide for Android */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 uppercase tracking-wider">
                  <Smartphone className="w-3.5 h-3.5" /> Untuk Pengguna Android (Chrome):
                </span>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-550 font-medium leading-relaxed">
                  <li>Ketuk tombol opsi berlambang <strong>titik tiga (⋮)</strong> di kanan atas browser Chrome.</li>
                  <li>Pilih menu <strong>"Instal Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                  <li>Konfirmasi dialog yang muncul untuk memasangnya secara native.</li>
                </ol>
              </div>

            </div>

            {/* Bottom confirmation details */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center shrink-0">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wide flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-400" /> Sandboxed Applet Installation Shielded
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { HealthProfile, ScanHistoryItem, DietPlanDay, MealSlot, PlanMeal } from '../types';
import { 
  Calendar, Check, Plus, AlertCircle, RefreshCw, Sparkles, 
  UtensilsCrossed, AlertTriangle, Salad, Sunrise, Sun, Sunset, Soup
} from 'lucide-react';

interface DietPlannerViewProps {
  currentProfile: HealthProfile;
  onSaveToHistory: (item: ScanHistoryItem) => void;
  historyList: ScanHistoryItem[];
}

// Indonesian clinical recommendation meal options for local warteg & Padang joints
const INDONESIAN_RECOMMENDATION_DATABASE = {
  Diabetes: [
    { name: 'Nasi Merah setengah + Ayam Pop tanpa kulit + Lalap daun singkong', isAman: true, reason: 'Porsi karbohidrat terkontrol, kaya serat, dan protein tanpa lemak jenuh berlebih.' },
    { name: 'Soto Ayam Kuah Bening + Tempe Bacem Kukus', isAman: true, reason: 'Kuah bening rendah gula, tempe ragi mengoptimalkan resistensi insulin secara alami.' },
    { name: 'Gado-gado Tanpa Lontong (Saus bumbu kacang sedikit saja)', isAman: true, reason: 'Kaya sayuran tinggi serat memperlambat penyerapan karbohidrat dalam pencernaan.' },
    { name: 'Cap Cay Rebus Bakso Sapi Warteg', isAman: true, reason: 'Kombinasi brokoli, wortel, sawi kaya serat pangan penstabil indeks glikemik.' },
    { name: 'Bubur Ayam Lengkap kuah gulai kental & Sate usus melimpah', isAman: false, reason: 'Tepung bubur memicu lonjakan gula mendadak ditambah purin jeroan.' },
    { name: 'Nasi Padang Siram Kuah Gulai Pekat + Telur Dadar tebal bertepung', isAman: false, reason: 'Kuah bersantan pekat berpemanis mempercepat penumpukan plak insulin.' },
    { name: 'Es Teh Manis Jumbo + Kerupuk Kaleng Warteg 3 buah', isAman: false, reason: 'Gula cair murni dan kalori kosong karbohidrat olahan pemicu hiperglikemia.' }
  ],
  Kolesterol: [
    { name: 'Ikan Kembung Bakar rempah + Sambal Tomat matang + Sayur Sop bening', isAman: true, reason: 'Ikan kembung kaya lemak tak jenuh Omega-3 penurun trigliserida & LDL.' },
    { name: 'Ayam Pop Padang tanpa kulit + Sayur Rebusan', isAman: true, reason: 'Menyajikan dada unggas tanpa kulit yang direbus kukus memangkas lemak trans jenuh.' },
    { name: 'Pepes Tahu Kemangi Kukus + Tumis Buncis minyak sedikit', isAman: true, reason: 'Protein nabati tahu kedelai mengandung fitosterol yang menurunkan penyerapan kolesterol.' },
    { name: 'Soto Daging Sapi jeroan santan Babat Paru', isAman: false, reason: 'Merupakan tumpukan asam lemak jenuh berbahaya pemicu penyumbatan arteri.' },
    { name: 'Cumi Saus Padang kental + Kerupuk Udang garing goreng', isAman: false, reason: 'Seafood kepala lunak berminyak melipatgandakan kolesterol LDL seketika.' },
    { name: 'Gulai Kikil Tunjang kenyal Padang porsi berlebih', isAman: false, reason: 'Kandungan kolagen tebal berpadu santan jenuh meningkatkan risiko arterosklerosis.' }
  ],
  'Asam Urat': [
    { name: 'Sayur Sop Wortel Kentang bening + Telur Rebus Ceplok minimal minyak', isAman: true, reason: 'Bahan wortel purin rendah dan telur adalah sumber protein paling aman bebas purin.' },
    { name: 'Pepes Nila Kukus Kemangi + Nasi Putih porsi wajar', isAman: true, reason: 'Sajian ikan air tawar pepes kukus memiliki toleransi zat purin yang relatif ramah tubuh.' },
    { name: 'Tumis Labu Siam iris + Tempe goreng garing tipis', isAman: true, reason: 'Labu siam melancarkan hidrasi ginjal guna mempermudah pembuangan kristal asam urat.' },
    { name: 'Tumis Daun Melinjo + Keripik Emping goreng renyah', isAman: false, reason: 'Sangat padat purin jenuh tinggi pemicu kekambuhan arthritis gout parah mendadak.' },
    { name: 'Gulai Kikil / Jeroan Sapi Sate Hati Ampela', isAman: false, reason: 'Bahan jeroan adalah pantangan absolut penderita asam urat karena purin tingkat tinggi.' },
    { name: 'Tumis Kangkung & Ikan Teri Asin Medan garing', isAman: false, reason: 'Kangkung dan ikan asin kering memicu penimbunan kristal asam urat tajam di sendi.' }
  ],
  Obesitas: [
    { name: 'Nasi Putih setengah porsi + Dada Ayam Bakar Kupas Kulit + Sayur Sop', isAman: true, reason: 'Memotong asupan kalori secara masif sembari mempertahankan kecukupan protein.' },
    { name: 'Soto Dada Ayam kuah bening tanpa soun + Tempe Bacem', isAman: true, reason: 'Menghindari karbohidrat olahan soun tepung gandum pembuat lonjakan kalori.' },
    { name: 'Tumis Buncis Tahu + Telur Ceplok air sup bening', isAman: true, reason: 'Kaya akan volume serat nabati berkalori rendah menjaga kenyang tahan lama.' },
    { name: 'Nasi Rames Padang porsi penuh siram bumerang minyak cabe + Perkedel Kentang + Bakwan goreng', isAman: false, reason: 'Gabungan kalori karbohidrat ganda berminyak yang melampaui batas harian tubuh.' },
    { name: 'Sate Kambing bagian berlemak + Lontong porsi tebal saus kacang', isAman: false, reason: 'Lemak kambing jenuh berpadu saus kacang minyak tinggi memicu timbunan adiposa.' },
    { name: 'Martabak Manis Cokelat Keju Susu sebagai makan malam', isAman: false, reason: 'Tepung terigu, margarin jenuh, dan gula cair padat energi tinggi pemicu obesitas.' }
  ]
};

// Default recommended weekly menu plans per Medical Diagnosis
const DEFAULT_WEEKLY_PLANS: Record<string, DietPlanDay[]> = {
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

const PLAN_STORAGE_KEY = 'nutri_track_diet_planner_v1';

export default function DietPlannerView({ currentProfile, onSaveToHistory, historyList }: DietPlannerViewProps) {
  const diagnosis = currentProfile.diagnosis;
  
  // Day selected state
  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  const [selectedDay, setSelectedDay] = useState('Senin');

  // Master weekly plans state
  const [weeklyPlans, setWeeklyPlans] = useState<DietPlanDay[]>(() => {
    try {
      const stored = localStorage.getItem(`${PLAN_STORAGE_KEY}_${diagnosis}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse weekly diet plans', e);
    }
    // Fallback to active diagnosis clinical templates
    return DEFAULT_WEEKLY_PLANS[diagnosis] || DEFAULT_WEEKLY_PLANS['Diabetes'];
  });

  // Sync plans when diagnosis profile dynamically changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${PLAN_STORAGE_KEY}_${diagnosis}`);
      if (stored) {
        setWeeklyPlans(JSON.parse(stored));
      } else {
        setWeeklyPlans(DEFAULT_WEEKLY_PLANS[diagnosis] || DEFAULT_WEEKLY_PLANS['Diabetes']);
      }
    } catch (e) {
      setWeeklyPlans(DEFAULT_WEEKLY_PLANS[diagnosis] || DEFAULT_WEEKLY_PLANS['Diabetes']);
    }
  }, [diagnosis]);

  // Save planner master state update
  const savePlans = (updatedPlans: DietPlanDay[]) => {
    setWeeklyPlans(updatedPlans);
    try {
      localStorage.setItem(`${PLAN_STORAGE_KEY}_${diagnosis}`, JSON.stringify(updatedPlans));
    } catch (e) {
      console.error('Failed to write plan to storage', e);
    }
  };

  // State handles details meal selection modal
  const [editingMealSlot, setEditingMealSlot] = useState<{ day: string; slot: MealSlot } | null>(null);

  // Active day plan details selection
  const activeDayPlan = useMemo(() => {
    return weeklyPlans.find(plan => plan.day === selectedDay) || weeklyPlans[0];
  }, [weeklyPlans, selectedDay]);

  // Aggregate safety metrics of current week
  const progressMetrics = useMemo(() => {
    let totalMeals = 0;
    let safeMeals = 0;
    let eatenSafe = 0;
    let eatenUnsafe = 0;

    weeklyPlans.forEach(day => {
      // Pagi
      totalMeals++;
      if (day.pagi.isAman) safeMeals++;
      if (day.pagi.isEaten) {
        if (day.pagi.isAman) eatenSafe++;
        else eatenUnsafe++;
      }
      // Siang
      totalMeals++;
      if (day.siang.isAman) safeMeals++;
      if (day.siang.isEaten) {
        if (day.siang.isAman) eatenSafe++;
        else eatenUnsafe++;
      }
      // Malam
      totalMeals++;
      if (day.malam.isAman) safeMeals++;
      if (day.malam.isEaten) {
        if (day.malam.isAman) eatenSafe++;
        else eatenUnsafe++;
      }
    });

    const scheduledSafePercent = Math.round((safeMeals / totalMeals) * 100);
    const totalEaten = eatenSafe + eatenUnsafe;
    const cleanEatenScore = totalEaten > 0 ? Math.round((eatenSafe / totalEaten) * 100) : 100;

    return {
      scheduledSafePercent,
      eatenSafe,
      eatenUnsafe,
      totalEaten,
      score: cleanEatenScore
    };
  }, [weeklyPlans]);

  // Click handler to mark meal as eaten & dynamically append to global History list!
  const handleToggleEaten = (dayName: string, slot: MealSlot) => {
    const updated = weeklyPlans.map(plan => {
      if (plan.day === dayName) {
        const slotData = plan[slot];
        const nextEatenState = !slotData.isEaten;
        
        // If transitioning to EATEN, auto append a high fidelity item into history!
        if (nextEatenState) {
          const matchedItemFromDb = INDONESIAN_RECOMMENDATION_DATABASE[diagnosis]?.find(
            item => item.name.toLowerCase() === slotData.name.toLowerCase()
          );

          onSaveToHistory({
            id: `plan-sync-${dayName}-${slot}-${Date.now()}`,
            food_name: slotData.name.split(' + ')[0].split(' / ')[0], // clean label
            detected_ingredients: matchedItemFromDb 
              ? [slotData.name, 'Planned Diet Menu'] 
              : ['Diet Menu Planner', slotData.name],
            risk_status: slotData.isAman ? 'Aman' : 'Berisiko Tinggi',
            risk_score: slotData.isAman ? 15 : 85,
            xai_explanation: matchedItemFromDb?.reason || `Sesuai rencana hidangan ${slot} pada hari ${dayName} Anda untuk target diagnosa medis ${diagnosis}.`,
            alternative_suggestion: slotData.isAman 
              ? 'Santapan luar biasa! Pertahankan konsistensi sehat ini.' 
              : 'Dianjurkan berganti ke pangan alternatif hijau atau batasi kuah kental santannya.',
            timestamp: new Date().toISOString(),
            imageUrl: slotData.isAman 
              ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=60' // premium salad / healthy plate image placeholder
              : 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=60' // Padang plate placeholder
          });
        }

        return {
          ...plan,
          [slot]: {
            ...slotData,
            isEaten: nextEatenState
          }
        };
      }
      return plan;
    });

    savePlans(updated);
  };

  // Restores standard clinic suggestions
  const handleResetDefaults = () => {
    if (window.confirm(`Kembalikan rancangan menu mingguan ${diagnosis} Anda ke standar medis klinis awal?`)) {
      const defaults = DEFAULT_WEEKLY_PLANS[diagnosis] || DEFAULT_WEEKLY_PLANS['Diabetes'];
      savePlans(defaults);
    }
  };

  // Change specific meal to pre-curated template
  const handleSelectMeal = (mealOptionName: string, isAman: boolean) => {
    if (!editingMealSlot) return;
    const { day, slot } = editingMealSlot;

    const updated = weeklyPlans.map(plan => {
      if (plan.day === day) {
        return {
          ...plan,
          [slot]: {
            name: mealOptionName,
            isAman,
            isEaten: false // resets eaten state upon swaps
          }
        };
      }
      return plan;
    });

    savePlans(updated);
    setEditingMealSlot(null);
  };

  // Custom text input manual planner
  const [customValue, setCustomValue] = useState('');
  const [customIsAman, setCustomIsAman] = useState(true);

  const handleCustomMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customValue.trim() || !editingMealSlot) return;
    
    handleSelectMeal(customValue.trim(), customIsAman);
    setCustomValue('');
  };

  return (
    <div id="diet-planner-tab" className="animate-fade-in space-y-4">
      
      {/* Weekly Safety Score Progress Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
        <div className="space-y-2 max-w-[190px]">
          <span className="text-[9px] bg-rose-50 text-rose-600 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide border border-rose-200">
            Target: {diagnosis}
          </span>
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            Skor Diet Mingguan
          </h3>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            {progressMetrics.totalEaten === 0 
              ? 'Tandai menu harian yang dimakan untuk menilai konsistensi gizi Anda.' 
              : `Hebat! ${progressMetrics.eatenSafe} dari ${progressMetrics.totalEaten} makanan Anda tergolong aman.`}
          </p>
        </div>

        {/* Dynamic percentage circular meter */}
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="40" cy="40" r="30" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
            <circle 
              cx="40" 
              cy="40" 
              r="30" 
              stroke={progressMetrics.score >= 70 ? '#10b981' : progressMetrics.score >= 50 ? '#f59e0b' : '#eb4d4b'} 
              strokeWidth="6" 
              fill="transparent" 
              strokeDasharray={2 * Math.PI * 30}
              strokeDashoffset={2 * Math.PI * 30 * (1 - progressMetrics.score / 100)}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-base font-semibold text-slate-900 leading-none block">{progressMetrics.score}%</span>
            <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-widest">Safe Ratio</span>
          </div>
        </div>
      </div>

      {/* Days of Week Pill Selector */}
      <div className="flex gap-1.5 overflow-x-auto py-1.5 no-scrollbar scroll-smooth px-1">
        {daysOfWeek.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3.5 py-2 text-[11px] font-extrabold rounded-full transition-all shrink-0 ${
              selectedDay === day 
                ? 'bg-slate-900 text-white shadow-md scale-105' 
                : 'bg-white/45 text-slate-600 border border-white/30 hover:bg-white/80 active:scale-95'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Main Day Planner Cards (Breakfast, Lunch, Dinner) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-[#eb4d4b]" />
            <h4 className="text-xs font-black text-slate-900 font-display">
              Rencana Makan Hari {selectedDay}
            </h4>
          </div>
          
          <button
            onClick={handleResetDefaults}
            className="text-[9px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Atur Ulang Default</span>
          </button>
        </div>

        {/* Breakfast Card Slot */}
        <div className="glass p-4 rounded-3xl shadow-sm relative space-y-3 transition-all">
          <div className="flex justify-between items-center border-b border-white/20 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/15">
                <Sunrise className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">SARAPAN</span>
                <span className="text-[11px] font-extrabold text-slate-800">Makan Pagi (07.00 - 09.00)</span>
              </div>
            </div>

            {/* Safety Indicator Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-tight ${
              activeDayPlan.pagi.isAman 
                ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/20' 
                : 'bg-red-500/15 text-[#eb4d4b] border border-red-500/25'
            }`}>
              {activeDayPlan.pagi.isAman ? 'Rekomendasi Aman' : 'Perlu Dibatasi'}
            </span>
          </div>

          <div className="flex justify-between items-start gap-4">
            <p className="text-xs font-bold text-slate-900 leading-normal flex-1">
              {activeDayPlan.pagi.name}
            </p>

            {/* Check/Complete Eaten Controller */}
            <button
              onClick={() => handleToggleEaten(selectedDay, 'pagi')}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all shrink-0 duration-300 ${
                activeDayPlan.pagi.isEaten 
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm ring-4 ring-emerald-500/10' 
                  : 'border-slate-300 hover:border-emerald-500 bg-white/60 hover:bg-emerald-50'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => setEditingMealSlot({ day: selectedDay, slot: 'pagi' })}
              className="text-[10px] font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 py-1 px-2.5 bg-white/50 hover:bg-white rounded-lg border border-white/30 transition-all shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Ganti Menu</span>
            </button>
            
            {activeDayPlan.pagi.isEaten && (
              <span className="text-[9.5px] font-semibold text-emerald-700 flex items-center gap-1 my-auto italic">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Dimakan & Tersinkronisasi ke grafik
              </span>
            )}
          </div>
        </div>

        {/* Lunch Card Slot */}
        <div className="glass p-4 rounded-3xl shadow-sm relative space-y-3 transition-all">
          <div className="flex justify-between items-center border-b border-white/20 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/15">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">MAKAN SIANG</span>
                <span className="text-[11px] font-extrabold text-slate-800">Makan Siang (12.00 - 14.00)</span>
              </div>
            </div>

            {/* Safety Indicator Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-tight ${
              activeDayPlan.siang.isAman 
                ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/20' 
                : 'bg-red-500/15 text-[#eb4d4b] border border-red-500/25'
            }`}>
              {activeDayPlan.siang.isAman ? 'Rekomendasi Aman' : 'Perlu Dibatasi'}
            </span>
          </div>

          <div className="flex justify-between items-start gap-4">
            <p className="text-xs font-bold text-slate-900 leading-normal flex-1">
              {activeDayPlan.siang.name}
            </p>

            {/* Check/Complete Eaten Controller */}
            <button
              onClick={() => handleToggleEaten(selectedDay, 'siang')}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all shrink-0 duration-300 ${
                activeDayPlan.siang.isEaten 
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm ring-4 ring-emerald-500/10' 
                  : 'border-slate-300 hover:border-emerald-500 bg-white/60 hover:bg-emerald-50'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => setEditingMealSlot({ day: selectedDay, slot: 'siang' })}
              className="text-[10px] font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 py-1 px-2.5 bg-white/50 hover:bg-white rounded-lg border border-white/30 transition-all shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Ganti Menu</span>
            </button>
            
            {activeDayPlan.siang.isEaten && (
              <span className="text-[9.5px] font-semibold text-emerald-700 flex items-center gap-1 my-auto italic">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Dimakan & Tersinkronisasi ke grafik
              </span>
            )}
          </div>
        </div>

        {/* Dinner Card Slot */}
        <div className="glass p-4 rounded-3xl shadow-sm relative space-y-3 transition-all">
          <div className="flex justify-between items-center border-b border-white/20 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/15">
                <Sunset className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">MAKAN MALAM</span>
                <span className="text-[11px] font-extrabold text-slate-800">Makan Malam (18.30 - 20.30)</span>
              </div>
            </div>

            {/* Safety Indicator Badge */}
            <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-tight ${
              activeDayPlan.malam.isAman 
                ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/20' 
                : 'bg-red-500/15 text-[#eb4d4b] border border-red-500/25'
            }`}>
              {activeDayPlan.malam.isAman ? 'Rekomendasi Aman' : 'Perlu Dibatasi'}
            </span>
          </div>

          <div className="flex justify-between items-start gap-4">
            <p className="text-xs font-bold text-slate-900 leading-normal flex-1">
              {activeDayPlan.malam.name}
            </p>

            {/* Check/Complete Eaten Controller */}
            <button
              onClick={() => handleToggleEaten(selectedDay, 'malam')}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all shrink-0 duration-300 ${
                activeDayPlan.malam.isEaten 
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm ring-4 ring-emerald-500/10' 
                  : 'border-slate-300 hover:border-emerald-500 bg-white/60 hover:bg-emerald-50'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3px]" />
            </button>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => setEditingMealSlot({ day: selectedDay, slot: 'malam' })}
              className="text-[10px] font-bold text-slate-500 hover:text-red-500 flex items-center gap-1 py-1 px-2.5 bg-white/50 hover:bg-white rounded-lg border border-white/30 transition-all shadow-xs"
            >
              <Plus className="w-3 h-3" />
              <span>Ganti Menu</span>
            </button>
            
            {activeDayPlan.malam.isEaten && (
              <span className="text-[9.5px] font-semibold text-emerald-700 flex items-center gap-1 my-auto italic">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Dimakan & Tersinkronisasi ke grafik
              </span>
            )}
          </div>
        </div>

      </div>

      {/* MODAL: Menu swapper and option provider for Indonesian food */}
      {editingMealSlot && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-5">
          <div className="bg-white rounded-3xl w-full max-w-[360px] max-h-[580px] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-fade-in">
            
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
              <div>
                <h4 className="text-xs font-bold font-mono tracking-widest text-red-400">PILIHAN ALASAN MEDIS</h4>
                <p className="text-sm font-extrabold">Ubah Menu {editingMealSlot.slot === 'pagi' ? 'Sarapan' : editingMealSlot.slot === 'siang' ? 'Makan Siang' : 'Makan Malam'}</p>
              </div>
              <button
                onClick={() => setEditingMealSlot(null)}
                className="text-xs font-bold text-slate-350 hover:text-white px-2.5 py-1 bg-white/10 hover:bg-white/15 rounded-xl transition"
              >
                Tutup
              </button>
            </div>

            {/* Modal Scroll area */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs font-semibold no-scrollbar">
              
              {/* Manual input planner */}
              <form onSubmit={customIsAman ? handleCustomMealSubmit : handleCustomMealSubmit} className="space-y-2.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                  <UtensilsCrossed className="w-3 h-3 text-slate-400" /> Tulis Menu Kustom Warteg:
                </span>
                <input
                  type="text"
                  required
                  value={customValue}
                  onChange={e => setCustomValue(e.target.value)}
                  placeholder="Contoh: Sayur Kangkung + Tempe Bacem Kukus"
                  className="w-full bg-white border border-slate-250 p-2.5 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-red-500 shadow-inner"
                />
                
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-slate-500">Status Keamanan:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomIsAman(true)}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold ${customIsAman ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'}`}
                    >
                      Aman Medis
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomIsAman(false)}
                      className={`px-2 py-1 rounded-lg text-[9px] font-bold ${!customIsAman ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'}`}
                    >
                      Harus Batasi
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg transition-all"
                >
                  Tambahkan Menu Kustom
                </button>
              </form>

              {/* Predefined Indonesian menu recommendation lists */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  🛡️ Rekomendasi Menu (Cocok untuk {diagnosis}):
                </span>
                
                <div className="space-y-2">
                  {INDONESIAN_RECOMMENDATION_DATABASE[diagnosis]?.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectMeal(item.name, item.isAman)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col space-y-1.5 ${
                        item.isAman 
                          ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 text-slate-800' 
                          : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold leading-normal text-slate-900">{item.name}</span>
                        <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-bold shrink-0 leading-none ${
                          item.isAman ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isAman ? 'AMAN' : 'BATASI'}
                        </span>
                      </div>
                      <p className="text-[9.5px] text-slate-500 leading-normal italic font-medium">
                        {item.reason}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom control */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center shrink-0">
              <span className="text-[9.5px] text-slate-400 font-medium">
                Saran disaring otomatis sesuai anjuran klinis medis gizi penderita penyakit {diagnosis}.
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

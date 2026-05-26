export type MedicalDiagnosis = 'Diabetes' | 'Obesitas' | 'Kolesterol' | 'Asam Urat';

export interface HealthProfile {
  diagnosis: MedicalDiagnosis;
  targetWeight: number;
  routineMedication: string;
}

export type RiskStatus = 'Aman' | 'Hati-hati' | 'Berisiko Tinggi';

export interface ScanResult {
  food_name: string;
  detected_ingredients: string[];
  risk_status: RiskStatus;
  risk_score: number;
  xai_explanation: string;
  alternative_suggestion: string;
  calories_est?: number; // kkal
  carbs_est?: number;    // gram
  protein_est?: number;  // gram
  fat_est?: number;      // gram
}

export interface ScanHistoryItem extends ScanResult {
  id: string;
  timestamp: string; // ISO String
  imageUrl: string;
}

export interface FoodAlternative {
  id: string;
  restaurant_type: 'Warteg' | 'Rumah Makan Padang' | 'Fast Food';
  original_item: string;
  alternative_item: string;
  reason: string;
}

export interface UserAccount {
  username: string;
  fullName: string;
  password?: string; // stored credentials
  profile?: HealthProfile;
  email?: string;
  allergies?: string;
}

export type MealSlot = 'pagi' | 'siang' | 'malam';

export interface PlanMeal {
  name: string;
  isAman: boolean;
  isEaten: boolean;
}

export interface DietPlanDay {
  day: string; // e.g. 'Senin', 'Selasa', ...
  pagi: PlanMeal;
  siang: PlanMeal;
  malam: PlanMeal;
}


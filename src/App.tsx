import React, { useState, useEffect } from 'react';
import { HealthProfile, ScanHistoryItem, UserAccount } from './types';
import Layout from './components/Layout';
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import ScanView from './components/ScanView';
import DashboardView from './components/DashboardView';
import DietPlannerView from './components/DietPlannerView';
import OnboardingView from './components/OnboardingView';
import SplashView from './components/SplashView';
import LoginRegisterView from './components/LoginRegisterView';

const CURRENT_USER_SESSION_KEY = 'nutri_track_current_user_v1';
const ONBOARDING_STATUS_KEY = 'nutri_track_onboarding_done_v2';
const USERS_DB_KEY = 'nutri_track_users_db_v1';
const HISTORY_LOCALSTORAGE_KEY = 'nutri_track_scans_v1';

const DEFAULT_PROFILE: HealthProfile = {
  diagnosis: 'Diabetes',
  targetWeight: 70,
  routineMedication: ''
};

export default function App() {
  const [activeTab, setActiveTab ] = useState<'home' | 'profile' | 'scan' | 'dashboard' | 'planner'>('home');

  const [showSplash, setShowSplash] = useState(true);

  // 1. Onboarding Completed State
  const [onboardingDone, setOnboardingDone] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_STATUS_KEY);
      return stored === 'true';
    } catch (e) {
      console.error('Failed to read onboarding state', e);
      return false;
    }
  });

  // 2. Active Logged In User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse current user session', e);
    }
    return null;
  });

  // 3. User Active Health Profile (derived from active user account or default)
  const [currentProfile, setCurrentProfile] = useState<HealthProfile>(() => {
    if (currentUser?.profile) {
      return currentUser.profile;
    }
    return DEFAULT_PROFILE;
  });

  // Update currentProfile state whenever currentUser changes (e.g., on registration/login)
  useEffect(() => {
    if (currentUser?.profile) {
      setCurrentProfile(currentUser.profile);
    } else {
      setCurrentProfile(DEFAULT_PROFILE);
    }
  }, [currentUser]);

  // 4. Initialize Scan History List from LocalStorage
  const [historyList, setHistoryList] = useState<ScanHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_LOCALSTORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to parse stored scan statistics:', err);
    }
    return [];
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const openConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      title: '',
      message: '',
      onConfirm: null
    });
  };

  // Handlers
  const handleOnboardingComplete = () => {
    try {
      localStorage.setItem(ONBOARDING_STATUS_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
    setOnboardingDone(true);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    try {
      localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(user);
    setActiveTab('scan');
  };

  const handleLogout = () => {
    openConfirmDialog('Keluar akun', 'Apakah Anda yakin ingin keluar dari akun?', () => {
      try {
        localStorage.removeItem(CURRENT_USER_SESSION_KEY);
      } catch (e) {
        console.error(e);
      }
      setCurrentUser(null);
      setActiveTab('scan');
      closeConfirmDialog();
    });
  };

  // Save Health Profile on modifications
  const handleProfileChange = (updated: HealthProfile, extraFields?: { email?: string; allergies?: string; fullName?: string }) => {
    setCurrentProfile(updated);
    
    if (currentUser) {
      // 1. Update current session state & storage
      const updatedUser: UserAccount = {
        ...currentUser,
        profile: updated,
        ...extraFields
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(updatedUser));
      } catch (e) {
        console.error('Failed to write profile session:', e);
      }

      // 2. Sync profile updates back into user accounts DB
      try {
        const dbStr = localStorage.getItem(USERS_DB_KEY);
        const allUsers: UserAccount[] = dbStr ? JSON.parse(dbStr) : [];
        const index = allUsers.findIndex(u => u.username.toLowerCase() === currentUser.username.toLowerCase());
        
        if (index !== -1) {
          allUsers[index] = {
            ...allUsers[index],
            profile: updated,
            ...extraFields
          };
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(allUsers));
        }
      } catch (err) {
        console.error('Failed to update credentials database file:', err);
      }
    }
  };

  // Save scan item to LocalStorage state
  const handleSaveToHistory = (item: ScanHistoryItem) => {
    setHistoryList(prev => {
      const newList = [item, ...prev];
      try {
        localStorage.setItem(HISTORY_LOCALSTORAGE_KEY, JSON.stringify(newList));
      } catch (err) {
        console.error('Failed to write scans to storage:', err);
      }
      return newList;
    });
  };

  // Erase history list
  const handleClearHistory = () => {
    openConfirmDialog('Hapus riwayat', 'Apakah Anda yakin ingin menghapus seluruh riwayat scan gizi Anda?', () => {
      setHistoryList([]);
      try {
        localStorage.removeItem(HISTORY_LOCALSTORAGE_KEY);
      } catch (err) {
        console.error('Failed to clear history:', err);
      }
      closeConfirmDialog();
    });
  };

  // Render view conditional state machine
  return (
    <>
      {showSplash ? (
        <Layout hideHeader={true} hideFooter={true} appName="Nutri Track">
          <SplashView onFinish={() => setShowSplash(false)} />
        </Layout>
      ) : !onboardingDone ? (
        <Layout hideHeader={true} hideFooter={true} appName="Nutri Track">
          <OnboardingView onComplete={handleOnboardingComplete} />
        </Layout>
      ) : !currentUser ? (
        <Layout hideHeader={true} hideFooter={true} appName="Nutri Track">
          <LoginRegisterView onLoginSuccess={handleLoginSuccess} />
        </Layout>
      ) : (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} appName="Nutri Track">
          {activeTab === 'home' && (
            <HomeView 
              currentProfile={currentProfile}
              currentUser={currentUser}
              onSaveToHistory={handleSaveToHistory}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              currentProfile={currentProfile}
              onProfileChange={handleProfileChange}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          )}
          
          {activeTab === 'scan' && (
            <ScanView 
              currentProfile={currentProfile}
              onSaveToHistory={handleSaveToHistory}
              historyList={historyList}
              onClearHistory={handleClearHistory}
            />
          )}
          
          {activeTab === 'dashboard' && (
            <DashboardView 
              currentProfile={currentProfile}
              historyList={historyList}
            />
          )}

          {activeTab === 'planner' && (
            <div className="px-5 py-4">
              <DietPlannerView 
                currentProfile={currentProfile}
                onSaveToHistory={handleSaveToHistory}
                historyList={historyList}
              />
            </div>
          )}
        </Layout>
      )}

      {confirmDialog.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-5">
          <div className="w-full max-w-[340px] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900">{confirmDialog.title}</h3>
              <p className="text-xs text-slate-500">{confirmDialog.message}</p>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={closeConfirmDialog}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => confirmDialog.onConfirm?.()}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Ya, lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

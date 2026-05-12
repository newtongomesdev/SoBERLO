import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Goal, Reflection, Mood, MoodLog, Habit, Achievement, AchievementID, Tracker, Challenge } from './types';
import { getTranslator, TranslationKey } from './i18n';

import Auth from './components/Auth';
import Onboarding from './components/Onboarding';
import SobrietyCounter from './components/SobrietyCounter';
import Goals from './components/Goals';
import DailyReflection from './components/DailyReflection';
import WellnessTracker from './components/WellnessTracker';
import MotivationCorner from './components/MotivationCorner';
import Achievements from './components/Achievements';
import { UserIcon, SettingsIcon, LogOutIcon, TrophyIcon, XIcon, AlertTriangleIcon } from './components/icons';
import SOSButton from './components/SOSButton';
import PinLock from './components/PinLock';
import Statistics from './components/Statistics';
import Journal from './components/Journal';
import BreathingExercise from './components/BreathingExercise';
import CravingTracker from './components/CravingTracker';
import SobrietyTree from './components/SobrietyTree';
import DailyChallenges from './components/DailyChallenges';
import WeeklySummary from './components/WeeklySummary';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_ACHIEVEMENTS: Achievement[] = [
    { id: 'oneDay', titleKey: 'ach_oneDay_title', descriptionKey: 'ach_oneDay_desc', check: (days) => days >= 1 },
    { id: 'oneWeek', titleKey: 'ach_oneWeek_title', descriptionKey: 'ach_oneWeek_desc', check: (days) => days >= 7 },
    { id: 'thirtyDays', titleKey: 'ach_thirtyDays_title', descriptionKey: 'ach_thirtyDays_desc', check: (days) => days >= 30 },
    { id: 'ninetyDays', titleKey: 'ach_ninetyDays_title', descriptionKey: 'ach_ninetyDays_desc', check: (days) => days >= 90 },
    { id: 'oneYear', titleKey: 'ach_oneYear_title', descriptionKey: 'ach_oneYear_desc', check: (days) => days >= 365 },
    { id: 'oneGoal', titleKey: 'ach_oneGoal_title', descriptionKey: 'ach_oneGoal_desc', check: (days, goals) => goals >= 1 },
    { id: 'tenGoals', titleKey: 'ach_tenGoals_title', descriptionKey: 'ach_tenGoals_desc', check: (days, goals) => goals >= 10 },
    { id: '25Goals', titleKey: 'ach_25Goals_title', descriptionKey: 'ach_25Goals_desc', check: (days, goals) => goals >= 25 },
    { id: 'firstReflection', titleKey: 'ach_firstReflection_title', descriptionKey: 'ach_firstReflection_desc', check: (d, g, r) => (r || 0) >= 1 },
    { id: 'moodStreak', titleKey: 'ach_moodStreak_title', descriptionKey: 'ach_moodStreak_desc', check: (d, g, r, ms) => (ms || 0) >= 7 },
];

const App: React.FC = () => {
    // --- State Management ---
    const [users, setUsers] = useState<Record<string, any>>(() => JSON.parse(localStorage.getItem('soberlo-users') || '{}'));
    const [currentUser, setCurrentUser] = useState<string>(() => localStorage.getItem('soberlo-currentUser') || 'guest');
    const [lang, setLang] = useState<'en' | 'pt'>('en');
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => (localStorage.getItem('soberlo-theme') as 'light'|'dark'|'system') || 'system');
    const t = useCallback(getTranslator(lang), [lang]);

    // UI State
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const [achievementToast, setAchievementToast] = useState<{title: string, desc: string} | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [mainTab, setMainTab] = useState<'dashboard' | 'statistics'>('dashboard');
    const [isZenMode, setIsZenMode] = useState<boolean>(false);

    // User Data State
    const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [dob, setDob] = useState<string>('');
    const [trackers, setTrackers] = useState<Tracker[]>([]);
    const [selectedTrackerIndex, setSelectedTrackerIndex] = useState(0);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [dailyGoals, setDailyGoals] = useState<Goal[]>([]);
    const [monthlyGoals, setMonthlyGoals] = useState<Goal[]>([]);
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [journal, setJournal] = useState<any[]>([]);
    const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
    const [habits, setHabits] = useState<Habit[]>([
        { id: '1', name: 'Meditate', completedDates: [] },
        { id: '2', name: 'Go for a walk', completedDates: [] },
        { id: '3', name: 'Drink 8 glasses of water', completedDates: [] },
    ]);
    const [cravings, setCravings] = useState<any[]>([]);
    const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
    const [points, setPoints] = useState(0);
    const [unlockedAchievements, setUnlockedAchievements] = useState<Set<AchievementID>>(new Set());
    const [pin, setPin] = useState<string>('');
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

    // Add Tracker Form State
    const [isAddingTracker, setIsAddingTracker] = useState(false);
    const [newTrackerName, setNewTrackerName] = useState('');
    const [newTrackerCost, setNewTrackerCost] = useState('0');
    const [newTrackerDate, setNewTrackerDate] = useState(new Date().toISOString().split('T')[0]);

    const profileRef = useRef<HTMLDivElement>(null);

    // --- Data Persistence ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const lastLoadedUserRef = useRef<string | null>(null);

    const loadUserData = (email: string) => {
        const userData = users[email] || {};
        setLang(userData.lang || 'en');
        setIsOnboardingComplete(userData.isOnboardingComplete || false);
        setUserName(userData.userName || '');
        setDob(userData.dob || '');
        
        // Migration: single tracker to array
        let loadedTrackers: Tracker[] = userData.trackers || [];
        if (loadedTrackers.length === 0 && userData.addictionType) {
            loadedTrackers = [{
                id: 'legacy-1',
                name: userData.addictionType,
                addictionType: userData.addictionType,
                dailyCost: userData.dailyCost || 0,
                startDate: userData.sobrietyStartDate || new Date().toISOString(),
                isActive: true
            }];
        }
        setTrackers(loadedTrackers);
        setChallenges(userData.challenges || []);
        
        const todayStr = new Date().toISOString().split('T')[0];
        const lastActiveDate = userData.lastActiveDate || todayStr;
        
        let loadedDailyGoals = userData.dailyGoals || [];
        if (lastActiveDate !== todayStr) {
            loadedDailyGoals = loadedDailyGoals.map((g: Goal) => ({ ...g, completed: false }));
        }
        
        setDailyGoals(loadedDailyGoals);
        setMonthlyGoals(userData.monthlyGoals || []);
        setReflections(userData.reflections || []);
        setJournal(userData.journal || []);
        setMoodLogs(userData.moodLogs || []);
        setHabits(userData.habits || [
            { id: '1', name: 'Meditate', completedDates: [] },
            { id: '2', name: 'Go for a walk', completedDates: [] },
            { id: '3', name: 'Drink 8 glasses of water', completedDates: [] },
        ]);
        setCravings(userData.cravings || []);
        setEmergencyContacts(userData.emergencyContacts || []);
        setPoints(userData.points || 0);
        setUnlockedAchievements(new Set(userData.unlockedAchievements || []));
        setPin(userData.pin || '');
        setNotificationsEnabled(userData.notificationsEnabled || false);
        if (userData.pin) {
            setIsLocked(true);
        } else {
            setIsLocked(false);
        }
        lastLoadedUserRef.current = email;
    };

    useEffect(() => {
        if (currentUser) {
            if (lastLoadedUserRef.current !== currentUser) {
                loadUserData(currentUser);
            }
        } else {
            setIsOnboardingComplete(false);
            setUserName('');
            setDob('');
            setTrackers([]);
            setDailyGoals([]);
            setMonthlyGoals([]);
            setReflections([]);
            setMoodLogs([]);
            setPoints(0);
            setUnlockedAchievements(new Set());
            lastLoadedUserRef.current = null;
        }
    }, [currentUser]);

    useEffect(() => {
        if(currentUser && lastLoadedUserRef.current === currentUser) {
            const todayStr = new Date().toISOString().split('T')[0];
            const updatedUserData = {
                lang, isOnboardingComplete, userName, dob, trackers, challenges, dailyGoals, monthlyGoals, reflections, journal, moodLogs, habits, cravings, emergencyContacts, points,
                unlockedAchievements: Array.from(unlockedAchievements),
                lastActiveDate: todayStr,
                pin, notificationsEnabled
            };
            setUsers(prevUsers => {
                const newUsers = { ...prevUsers, [currentUser]: updatedUserData };
                localStorage.setItem('soberlo-users', JSON.stringify(newUsers));
                return newUsers;
            });
        }
    }, [currentUser, lang, isOnboardingComplete, userName, dob, trackers, challenges, dailyGoals, monthlyGoals, reflections, journal, moodLogs, habits, cravings, emergencyContacts, points, unlockedAchievements, notificationsEnabled]);

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    useEffect(() => {
        localStorage.setItem('soberlo-theme', theme);
        const applyTheme = () => {
            const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            document.documentElement.classList.toggle('dark', isDark);
        };
        applyTheme();
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (theme === 'system') {
            mediaQuery.addEventListener('change', applyTheme);
        }
        return () => mediaQuery.removeEventListener('change', applyTheme);
    }, [theme]);

    // --- Handlers ---
    const handleOnboardingComplete = (data: { name: string; dob: string; addictionType: string; dailyCost?: number }) => {
        setUserName(data.name);
        setDob(data.dob);
        const newTracker: Tracker = {
            id: crypto.randomUUID(),
            name: data.addictionType,
            addictionType: data.addictionType,
            dailyCost: data.dailyCost || 0,
            startDate: new Date().toISOString(),
            isActive: true
        };
        setTrackers([newTracker]);
        setIsOnboardingComplete(true);
    };

    const handleLogin = (email: string): boolean => {
        if (users[email]) {
            setCurrentUser(email);
            localStorage.setItem('soberlo-currentUser', email);
            return true;
        }
        return false;
    };

    const handleSignup = (email: string): boolean => {
        if (users[email]) return false;
        setCurrentUser(email);
        localStorage.setItem('soberlo-currentUser', email);
        return true;
    };

    const handleLogout = () => {
        setCurrentUser('guest');
        localStorage.setItem('soberlo-currentUser', 'guest');
        setIsProfileOpen(false);
    };

    const awardPoints = (amount: number) => setPoints(p => p + amount);

    const getRank = (p: number) => {
        if (p >= 5000) return { title: lang === 'pt' ? 'Lenda da Liberdade' : 'Freedom Legend', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', emoji: '👑' };
        if (p >= 1500) return { title: lang === 'pt' ? 'Guardião da Sobriedade' : 'Sobriety Guardian', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', emoji: '🛡️' };
        if (p >= 500) return { title: lang === 'pt' ? 'Mestre da Vontade' : 'Will Master', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', emoji: '⚔️' };
        if (p >= 100) return { title: lang === 'pt' ? 'Guerreiro Resiliente' : 'Resilient Warrior', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', emoji: '💪' };
        return { title: lang === 'pt' ? 'Iniciante da Força' : 'Strength Beginner', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', emoji: '🌱' };
    };

    const userRank = getRank(points);

    const handleAddGoal = (type: 'daily' | 'monthly', text: string) => {
        const newGoal: Goal = { id: crypto.randomUUID(), text, completed: false };
        if (type === 'daily') setDailyGoals(prev => [...prev, newGoal]);
        else setMonthlyGoals(prev => [...prev, newGoal]);
    };

    const handleToggleGoal = (type: 'daily' | 'monthly', id: string) => {
        const updater = (goals: Goal[]) => goals.map(g => {
            if (g.id === id) {
                if (!g.completed) {
                    awardPoints(10);
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#10b981', '#3b82f6', '#f59e0b'] });
                } else setPoints(p => Math.max(0, p - 10));
                return { ...g, completed: !g.completed };
            }
            return g;
        });
        if (type === 'daily') setDailyGoals(updater);
        else setMonthlyGoals(updater);
    };
    
    const handleDeleteGoal = (type: 'daily' | 'monthly', id: string) => {
        if (type === 'daily') setDailyGoals(goals => goals.filter(g => g.id !== id));
        else setMonthlyGoals(goals => goals.filter(g => g.id !== id));
    };

    const handleAddReflection = (entry: string) => {
        const newReflection: Reflection = { date: new Date().toISOString(), entry };
        setReflections(prev => [newReflection, ...prev]);
        awardPoints(15);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#3b82f6'] });
    };

    const handleAddJournalEntry = (title: string, content: string, mood?: Mood) => {
        const newEntry = { id: crypto.randomUUID(), date: new Date().toISOString(), title, content, mood };
        setJournal(prev => [newEntry, ...prev]);
        awardPoints(10);
    };

    const handleDeleteJournalEntry = (id: string) => {
        setJournal(prev => prev.filter(e => e.id !== id));
    };

    const handleLogMood = (mood: Mood) => {
        const todayStr = new Date().toISOString().split('T')[0];
        if (!moodLogs.find(l => l.date === todayStr)) awardPoints(5);
        const newLog: MoodLog = { date: todayStr, mood };
        setMoodLogs(prev => [newLog, ...prev.filter(l => l.date !== todayStr)]);
    };

    const handleToggleHabit = (id: string) => {
        const todayStr = new Date().toISOString().split('T')[0];
        setHabits(prev => prev.map(h => {
            if (h.id === id) {
                const completed = h.completedDates.includes(todayStr);
                if (!completed) awardPoints(5);
                else setPoints(p => Math.max(0, p - 5));
                const newDates = completed ? h.completedDates.filter(d => d !== todayStr) : [...h.completedDates, todayStr];
                return { ...h, completedDates: newDates };
            }
            return h;
        }));
    };
    
    const handleAddHabit = (name: string) => {
        const newHabit: Habit = { id: crypto.randomUUID(), name, completedDates: [] };
        setHabits(prev => [...prev, newHabit]);
    };

    const handleDeleteHabit = (id: string) => {
        setHabits(prev => prev.filter(h => h.id !== id));
    };

    const handleLogCraving = (cravingData: { intensity: number; trigger: string }) => {
        const now = new Date();
        const newCraving = {
            id: crypto.randomUUID(),
            date: now.toISOString().split('T')[0], // Standard YYYY-MM-DD for comparison
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // 24h format
            ...cravingData
        };
        setCravings(prev => [newCraving, ...prev]);
        awardPoints(15);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#f97316'] });
    };

    const handleAddEmergencyContact = (name: string, phone: string) => {
        setEmergencyContacts(prev => [...prev, { id: crypto.randomUUID(), name, phone }]);
    };
    
    const handleResetCounter = () => {
        if (trackers[selectedTrackerIndex]) {
            const updatedTrackers = [...trackers];
            updatedTrackers[selectedTrackerIndex] = {
                ...updatedTrackers[selectedTrackerIndex],
                startDate: new Date().toISOString()
            };
            setTrackers(updatedTrackers);
            setPoints(0);
            setUnlockedAchievements(new Set());
            setIsResetConfirmOpen(false);
            setIsSettingsOpen(false);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    };

    const handleCreateTracker = () => {
        if (!newTrackerName.trim()) return;
        const newTracker: Tracker = {
            id: crypto.randomUUID(),
            name: newTrackerName,
            addictionType: newTrackerName.toLowerCase(),
            dailyCost: parseFloat(newTrackerCost) || 0,
            startDate: new Date(newTrackerDate).toISOString(),
            isActive: true
        };
        setTrackers(prev => [...prev, newTracker]);
        setSelectedTrackerIndex(trackers.length);
        setIsAddingTracker(false);
        setNewTrackerName('');
        setNewTrackerCost('0');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    };

    const handleGenerateReport = () => {
        const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 18;
        const contentWidth = pageWidth - margin * 2;
        let y = 0;

        const checkPageBreak = (height: number) => {
            if (y + height > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        };

        const activeTracker = trackers[selectedTrackerIndex] || trackers[0];
        if (!activeTracker) return;

        const sobrietyDaysCount = Math.floor((new Date().getTime() - new Date(activeTracker.startDate).getTime()) / (1000 * 60 * 60 * 24));

        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, pageWidth, 42, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.text('SoBERLO', margin, 18);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Progress Report', margin, 26);
        doc.text(`Generated: ${new Date().toISOString().split('T')[0]}`, pageWidth - margin, 26, { align: 'right' });
        y = 52;

        const statBoxW = contentWidth / 2 - 3;
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(margin, y, statBoxW, 22, 3, 3, 'F');
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('NAME', margin + 5, y + 7);
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(14);
        doc.text(userName || 'Guest', margin + 5, y + 16);

        doc.setFillColor(209, 250, 229);
        doc.roundedRect(margin + statBoxW + 6, y, statBoxW, 22, 3, 3, 'F');
        doc.setTextColor(5, 150, 105);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('SOBRIETY STREAK', margin + statBoxW + 11, y + 7);
        doc.setFontSize(14);
        doc.text(`${sobrietyDaysCount} Days (${activeTracker.name})`, margin + statBoxW + 11, y + 16);
        y += 32;

        if (moodLogs.length > 0) {
            checkPageBreak(20);
            doc.setDrawColor(226, 232, 240);
            doc.line(margin, y, pageWidth - margin, y);
            y += 7;
            doc.setTextColor(51, 65, 85);
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Mood History (Last 30 Days)', margin, y);
            y += 10;

            const colW = contentWidth / 2 - 2;
            moodLogs.slice(0, 30).forEach((log, i) => {
                const col = i % 2;
                const x = margin + col * (colW + 4);
                checkPageBreak(10);
                doc.setFillColor(241, 245, 249);
                doc.roundedRect(x, y, colW, 8, 2, 2, 'F');
                doc.setTextColor(51, 65, 85);
                doc.setFontSize(9);
                doc.text(log.date, x + 3, y + 5.5);
                doc.text(log.mood, x + colW - 3, y + 5.5, { align: 'right' });
                if (col === 1) y += 10;
            });
            if (moodLogs.slice(0, 30).length % 2 !== 0) y += 10;
        }

        const totalPages = (doc.internal as any).getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFillColor(248, 250, 252);
            doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(8);
            doc.text('Generated securely and locally by SoBERLO', pageWidth / 2, pageHeight - 4, { align: 'center' });
        }

        doc.save('soberlo-report.pdf');
    };

    const handleExportData = () => {
        const data = JSON.stringify(users, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        saveAs(blob, 'soberlo-backup.json');
    };

    const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                if (importedData && typeof importedData === 'object') {
                    setUsers(importedData);
                    localStorage.setItem('soberlo-users', JSON.stringify(importedData));
                    window.location.reload();
                }
            } catch (err) { alert('Invalid backup file.'); }
        };
        reader.readAsText(file);
    };

    const handleDeleteAllData = () => {
        localStorage.removeItem('soberlo-users');
        localStorage.removeItem('soberlo-currentUser');
        window.location.reload();
    };

    // --- Gamification Logic ---
    const activeTracker = trackers[selectedTrackerIndex] || trackers[0] || null;
    const sobrietyDays = activeTracker 
        ? Math.floor((new Date().getTime() - new Date(activeTracker.startDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    const totalGoalsCompleted = [...dailyGoals, ...monthlyGoals].filter(g => g.completed).length;

    const calculateMoodStreak = () => {
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            if (moodLogs.find(l => l.date === dateStr)) streak++;
            else break;
        }
        return streak;
    };
    const moodStreak = calculateMoodStreak();

    useEffect(() => {
        ALL_ACHIEVEMENTS.forEach(ach => {
            if (!unlockedAchievements.has(ach.id) && ach.check(sobrietyDays, totalGoalsCompleted, reflections.length, moodStreak)) {
                setUnlockedAchievements(prev => new Set(prev).add(ach.id));
                setAchievementToast({ title: t(ach.titleKey), desc: t(ach.descriptionKey) });
                confetti({ particleCount: 150, spread: 100, origin: { y: 0.3 }, zIndex: 1000 });
                setTimeout(() => setAchievementToast(null), 5000);
            }
        });
    }, [sobrietyDays, totalGoalsCompleted, reflections.length, moodStreak, unlockedAchievements, t]);

    const toggleNotifications = async () => {
        if (!notificationsEnabled) {
            if (!("Notification" in window)) return;
            const permission = await Notification.requestPermission();
            if (permission === "granted") setNotificationsEnabled(true);
        } else setNotificationsEnabled(false);
    };

    // --- Render ---
    if (isLocked) return <PinLock savedPin={pin} onUnlock={() => setIsLocked(false)} lang={lang} t={t} />;
    if (!isOnboardingComplete) return <Onboarding onComplete={handleOnboardingComplete} t={t} />;
    // Removed mandatory Auth gate to allow direct usage without login

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
            <Helmet>
                <title>SoBERLO | {t('sobrietyJourney')}</title>
            </Helmet>

            <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm dark:shadow-slate-900 sticky top-0 z-30 border-b border-transparent dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            <h1 className="text-2xl font-black tracking-tight text-brand-dark dark:text-white">SoBERLO</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 font-bold py-1 px-3 rounded-full">
                                <TrophyIcon className="w-5 h-5" />
                                <span>{points} {t('points')}</span>
                            </div>
                            <div className="relative" ref={profileRef}>
                                <button onClick={() => setIsProfileOpen(o => !o)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-primary">
                                    <UserIcon className="w-6 h-6" />
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl py-2 z-30 border border-slate-100 dark:border-slate-800">
                                        <div className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800">
                                            <p className="font-semibold">{t('profile')}</p>
                                            <p className="truncate font-medium">{userName || (currentUser === 'guest' ? (lang === 'pt' ? 'Convidado' : 'Guest') : currentUser)}</p>
                                        </div>
                                        {currentUser === 'guest' ? (
                                            <button onClick={() => { setIsAuthOpen(true); setIsProfileOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-brand-primary hover:bg-slate-100 dark:hover:bg-slate-800">
                                                <UserIcon className="w-4 h-4 mr-2" /> {t('loginTitle' as any) || (lang === 'pt' ? 'Entrar / Criar Conta' : 'Login / Signup')}
                                            </button>
                                        ) : (
                                            <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                <LogOutIcon className="w-4 h-4 mr-2" /> {t('logout')}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => setIsZenMode(!isZenMode)} 
                                className={`p-1.5 rounded-full transition-all ${isZenMode ? 'bg-emerald-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                <span className="text-xl">🧘</span>
                            </button>
                            <button onClick={() => setIsSettingsOpen(true)} className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                                <SettingsIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl inline-flex shadow-inner">
                        <button onClick={() => setMainTab('dashboard')} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${mainTab === 'dashboard' ? 'bg-white dark:bg-slate-800 text-brand-primary shadow-sm' : 'text-slate-500'}`}>Dashboard</button>
                        <button onClick={() => setMainTab('statistics')} className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${mainTab === 'statistics' ? 'bg-white dark:bg-slate-800 text-brand-primary shadow-sm' : 'text-slate-500'}`}>{lang === 'pt' ? 'Estatísticas' : 'Statistics'}</button>
                    </div>
                </div>

                {mainTab === 'dashboard' ? (
                    <>
                        {!isZenMode && <WeeklySummary sobrietyDays={sobrietyDays} moodLogs={moodLogs} goals={[...dailyGoals, ...monthlyGoals]} t={t} />}
                        <div className={`grid grid-cols-1 ${isZenMode ? 'max-w-2xl mx-auto' : 'lg:grid-cols-3'} gap-6`}>
                            <div className={`${isZenMode ? 'col-span-1' : 'lg:col-span-2'} space-y-6`}>
                                {!isZenMode && <SobrietyTree days={sobrietyDays} lang={lang} />}
                                <SobrietyCounter 
                                    trackers={trackers} 
                                    selectedIndex={selectedTrackerIndex} 
                                    onSelect={setSelectedTrackerIndex} 
                                    onAddTracker={() => setIsAddingTracker(true)}
                                    t={t} 
                                    lang={lang} 
                                    rank={userRank} 
                                    points={points} 
                                />
                                {!isZenMode && (
                                    <>
                                        <Journal entries={journal} onAddEntry={handleAddJournalEntry} onDeleteEntry={handleDeleteJournalEntry} t={t} />
                                        <DailyReflection onAddReflection={handleAddReflection} latestReflection={reflections[0] || null} t={t} lang={lang} />
                                        <Goals dailyGoals={dailyGoals} monthlyGoals={monthlyGoals} onAddGoal={handleAddGoal} onToggleGoal={handleToggleGoal} onDeleteGoal={handleDeleteGoal} t={t} />
                                    </>
                                )}
                            </div>
                            {!isZenMode && (
                                <div className="space-y-6">
                                    <MotivationCorner t={t} lang={lang} />
                                    <DailyChallenges lang={lang} onComplete={awardPoints} challenges={challenges} setChallenges={setChallenges} />
                                    <BreathingExercise t={t} />
                                    <CravingTracker cravings={cravings} onLogCraving={handleLogCraving} t={t} />
                                    <WellnessTracker moodLog={moodLogs} habits={habits} onLogMood={handleLogMood} onToggleHabit={handleToggleHabit} onAddHabit={handleAddHabit} onDeleteHabit={handleDeleteHabit} t={t} />
                                    <Achievements allAchievements={ALL_ACHIEVEMENTS} unlockedAchievements={unlockedAchievements} t={t} />
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <Statistics moodLogs={moodLogs} cravings={cravings} t={t} />
                )}
            </main>

            {isSettingsOpen && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{t('settings')}</h3>
                            <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><XIcon className="w-6 h-6 text-slate-400" /></button>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{t('language')}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setLang('en')} className={`py-3 px-4 rounded-xl font-bold transition-all ${lang === 'en' ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>English</button>
                                    <button onClick={() => setLang('pt')} className={`py-3 px-4 rounded-xl font-bold transition-all ${lang === 'pt' ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>Português</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Theme</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['light', 'dark', 'system'] as const).map(m => (
                                        <button key={m} onClick={() => setTheme(m)} className={`py-3 rounded-xl font-bold text-xs capitalize transition-all ${theme === m ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{m}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                <button onClick={handleGenerateReport} className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors flex items-center space-x-3 text-slate-700 dark:text-slate-300 font-bold"><span>📊</span> <span>{t('generateReport')}</span></button>
                                <button onClick={handleExportData} className="w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-colors flex items-center space-x-3 text-slate-700 dark:text-slate-300 font-bold"><span>📥</span> <span>{t('exportData')}</span></button>
                                <button onClick={() => setIsResetConfirmOpen(true)} className="w-full text-left p-4 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl transition-colors flex items-center space-x-3 text-red-600 font-bold"><span>⚠️</span> <span>{t('restartCounter')}</span></button>
                                <button onClick={handleDeleteAllData} className="w-full text-left p-4 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl transition-colors flex items-center space-x-3 text-red-600 font-bold"><span>🗑️</span> <span>{t('deleteAllData')}</span></button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isResetConfirmOpen && (
                <div className="fixed inset-0 bg-red-950/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl text-center">
                        <AlertTriangleIcon className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-black mb-2">{t('restartConfirmationTitle')}</h3>
                        <p className="text-slate-500 mb-8">{t('restartConfirmationText')}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setIsResetConfirmOpen(false)} className="py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800">{t('cancelButton')}</button>
                            <button onClick={handleResetCounter} className="py-4 rounded-2xl font-black text-white bg-red-600">{t('restartCounter')}</button>
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {achievementToast && (
                    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-24 right-8 w-80 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl z-[100] border border-white/10 flex items-center space-x-4">
                        <div className="bg-amber-400 p-2 rounded-xl text-2xl">🏆</div>
                        <div>
                            <p className="text-[10px] font-black uppercase opacity-60">Novo Desbloqueio!</p>
                            <p className="font-bold">{achievementToast.title}</p>
                            <p className="text-xs opacity-80">{achievementToast.desc}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isAuthOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="relative w-full max-w-md">
                        <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10">
                            <XIcon className="w-6 h-6" />
                        </button>
                        <Auth onLogin={(email) => { handleLogin(email); setIsAuthOpen(false); }} onSignup={(email) => { handleSignup(email); setIsAuthOpen(false); }} isModal t={t} />
                    </div>
                </div>
            )}

            <SOSButton t={t} lang={lang} emergencyContacts={emergencyContacts} onAddContact={handleAddEmergencyContact} />

            {isAddingTracker && (
                <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-black mb-6">{t('addHabitTitle')}</h3>
                        <div className="space-y-4">
                            <input type="text" value={newTrackerName} onChange={(e) => setNewTrackerName(e.target.value)} placeholder="ex: Álcool, Redes Sociais" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" />
                            <input type="number" value={newTrackerCost} onChange={(e) => setNewTrackerCost(e.target.value)} placeholder="Custo diário" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" />
                            <input type="date" value={newTrackerDate} onChange={(e) => setNewTrackerDate(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl" />
                            <button onClick={handleCreateTracker} className="w-full bg-brand-primary text-white font-black py-4 rounded-2xl shadow-lg">Começar Jornada</button>
                            <button onClick={() => setIsAddingTracker(false)} className="w-full py-4 text-slate-500">Cancelar</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default App;

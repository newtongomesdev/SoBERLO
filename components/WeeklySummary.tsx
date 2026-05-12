import React from 'react';
import Card from './Card';
import { TranslationKey } from '../i18n';
import { MoodLog, Goal, Mood } from '../types';

interface WeeklySummaryProps {
    sobrietyDays: number;
    moodLogs: MoodLog[];
    goals: Goal[];
    t: (key: TranslationKey | any) => string;
}

const moodEmojis: Record<Mood, string> = {
    [Mood.Great]: '😊',
    [Mood.Good]: '🙂',
    [Mood.Okay]: '😐',
    [Mood.Bad]: '😔',
    [Mood.Awful]: '😠',
};

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ sobrietyDays, moodLogs, goals, t }) => {
    // Calculate goals completed
    const completedGoalsCount = goals.filter(g => g.completed).length;
    const totalGoals = goals.length;
    
    // Calculate predominant mood in last 7 days
    const last7DaysLogs = moodLogs.slice(0, 7);
    let predominantMoodText = 'N/A';
    
    if (last7DaysLogs.length > 0) {
        const moodCounts = last7DaysLogs.reduce((acc, log) => {
            acc[log.mood] = (acc[log.mood] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        let maxMood = last7DaysLogs[0].mood;
        let maxCount = 0;
        
        (Object.entries(moodCounts) as [string, number][]).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                maxMood = mood as Mood;
            }
        });
        
        predominantMoodText = moodEmojis[maxMood as Mood];
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-brand-primary rounded-xl shadow-md p-4 text-white flex items-center space-x-4">
                <div className="text-4xl bg-white/20 p-3 rounded-full">🔥</div>
                <div>
                    <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">{t('currentStreak' as any)}</p>
                    <p className="text-3xl font-bold">{sobrietyDays} {t('days')}</p>
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-400 to-brand-secondary rounded-xl shadow-md p-4 text-white flex items-center space-x-4">
                <div className="text-4xl bg-white/20 p-3 rounded-full">🎯</div>
                <div>
                    <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">{t('goalsCompleted' as any)}</p>
                    <p className="text-3xl font-bold">{completedGoalsCount} <span className="text-lg font-normal text-emerald-100">/ {totalGoals}</span></p>
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl shadow-md p-4 text-white flex items-center space-x-4">
                <div className="text-4xl bg-white/20 p-3 rounded-full">✨</div>
                <div>
                    <p className="text-purple-100 text-sm font-medium uppercase tracking-wider">{t('predominantMood' as any)}</p>
                    <p className="text-3xl font-bold">{predominantMoodText}</p>
                </div>
            </div>
        </div>
    );
};

export default WeeklySummary;

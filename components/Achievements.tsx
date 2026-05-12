import React from 'react';
import Card from './Card';
import { TranslationKey } from '../i18n';
import { Achievement, AchievementID } from '../types';
import { TrophyIcon } from './icons';

interface AchievementProps {
    allAchievements: Achievement[];
    unlockedAchievements: Set<AchievementID>;
    t: (key: TranslationKey) => string;
}

const AchievementItem: React.FC<{ title: string; unlocked: boolean; description: string }> = ({ title, unlocked, description }) => (
    <div className={`flex items-start space-x-4 p-4 rounded-xl border transition-all duration-300 ${unlocked ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200 dark:border-emerald-800/50 shadow-sm hover:shadow-md' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 grayscale-[0.8] opacity-70'}`}>
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${unlocked ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}`}>
            {unlocked ? '🏆' : '🔒'}
        </div>
        <div>
            <h4 className={`font-bold text-base ${unlocked ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-600 dark:text-slate-400'}`}>{title}</h4>
            <p className={`text-sm mt-1 leading-snug ${unlocked ? 'text-emerald-700/80 dark:text-emerald-300/80' : 'text-slate-500 dark:text-slate-500'}`}>{description}</p>
            {unlocked && <span className="inline-block mt-2 text-xs font-bold bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 py-0.5 px-2 rounded-full">Unlocked</span>}
        </div>
    </div>
);

const Achievements: React.FC<AchievementProps> = ({ allAchievements, unlockedAchievements, t }) => {
    const progressPercentage = Math.round((unlockedAchievements.size / allAchievements.length) * 100) || 0;

    // Sort to show unlocked first
    const sortedAchievements = [...allAchievements].sort((a, b) => {
        const aUnlocked = unlockedAchievements.has(a.id) ? 1 : 0;
        const bUnlocked = unlockedAchievements.has(b.id) ? 1 : 0;
        return bUnlocked - aUnlocked; // Unlocked (1) comes before Locked (0)
    });

    return (
        <Card title={t('achievementsTitle' as any) || "Achievements"} icon={<TrophyIcon className="w-7 h-7" />}>
            <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="text-sm font-bold text-brand-primary">{unlockedAchievements.size} / {allAchievements.length}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                        className="bg-gradient-to-r from-brand-secondary to-brand-primary h-3 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {sortedAchievements.map((ach) => (
                    <AchievementItem 
                        key={ach.id} 
                        title={t(ach.titleKey)} 
                        description={t(ach.descriptionKey)}
                        unlocked={unlockedAchievements.has(ach.id)} 
                    />
                ))}
            </div>
        </Card>
    );
};

export default Achievements;

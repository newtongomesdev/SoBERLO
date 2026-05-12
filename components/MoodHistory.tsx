import React from 'react';
import { MoodLog, Mood } from '../types';
import { TranslationKey } from '../i18n';

interface MoodHistoryProps {
    moodLogs: MoodLog[];
    t: (key: TranslationKey | any) => string;
}

const moodEmojis: Record<Mood, string> = {
    [Mood.Great]: '😊',
    [Mood.Good]: '🙂',
    [Mood.Okay]: '😐',
    [Mood.Bad]: '😔',
    [Mood.Awful]: '😠',
};

const moodColors: Record<Mood, string> = {
    [Mood.Great]: 'bg-green-400',
    [Mood.Good]: 'bg-lime-400',
    [Mood.Okay]: 'bg-yellow-400',
    [Mood.Bad]: 'bg-orange-400',
    [Mood.Awful]: 'bg-red-400',
};

const moodBarHeights: Record<Mood, string> = {
    [Mood.Great]: 'h-full',
    [Mood.Good]: 'h-4/5',
    [Mood.Okay]: 'h-3/5',
    [Mood.Bad]: 'h-2/5',
    [Mood.Awful]: 'h-1/5',
};

const MoodHistory: React.FC<MoodHistoryProps> = ({ moodLogs, t }) => {
    // Get last 7 days
    const last7Days: { date: string; dayLabel: string; mood: Mood | null }[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3);
        const log = moodLogs.find(l => l.date === dateStr);
        last7Days.push({ date: dateStr, dayLabel, mood: log?.mood || null });
    }

    const filledDays = last7Days.filter(d => d.mood !== null).length;

    if (filledDays === 0) {
        return null; // Don't render if no mood history
    }

    return (
        <div className="mt-4 pt-4 border-t dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">{t('moodHistory' as any)}</h4>
            <div className="flex items-end justify-between gap-1 h-24">
                {last7Days.map((day) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center h-full">
                        <div className="flex-1 w-full flex items-end justify-center">
                            {day.mood ? (
                                <div className={`w-full max-w-[32px] ${moodBarHeights[day.mood]} ${moodColors[day.mood]} rounded-t-md transition-all duration-500 relative group`}>
                                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        {moodEmojis[day.mood]}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full max-w-[32px] h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            )}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">{day.dayLabel}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MoodHistory;

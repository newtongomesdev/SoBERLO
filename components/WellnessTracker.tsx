import React, { useState } from 'react';
import Card from './Card';
import { HeartIcon } from './icons';
import { Mood, MoodLog, Habit } from '../types';
import { TranslationKey } from '../i18n';
import MoodHistory from './MoodHistory';

interface WellnessTrackerProps {
  moodLog: MoodLog[];
  habits: Habit[];
  onLogMood: (mood: Mood) => void;
  onToggleHabit: (id: string) => void;
  onAddHabit: (name: string) => void;
  onDeleteHabit: (id: string) => void;
  t: (key: TranslationKey | any) => string;
}

const moodOptions: { mood: Mood; emoji: string; color: string }[] = [
  { mood: Mood.Great, emoji: '😊', color: 'text-green-500' },
  { mood: Mood.Good, emoji: '🙂', color: 'text-lime-500' },
  { mood: Mood.Okay, emoji: '😐', color: 'text-yellow-500' },
  { mood: Mood.Bad, emoji: '😔', color: 'text-orange-500' },
  { mood: Mood.Awful, emoji: '😠', color: 'text-red-500' },
];

const WellnessTracker: React.FC<WellnessTrackerProps> = ({ moodLog, habits, onLogMood, onToggleHabit, onAddHabit, onDeleteHabit, t }) => {
  const [newHabitName, setNewHabitName] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysMood = moodLog.find(log => log.date === todayStr);

  const getHabitName = (habit: Habit) => {
    const habitKeys: Record<string, TranslationKey> = {
      'Meditate': 'habitMeditate',
      'Go': 'habitWalk',
      'Drink': 'habitWater'
    };
    const transKey = habitKeys[habit.name.split(' ')[0]];
    return transKey ? t(transKey) : habit.name;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  return (
    <Card title={t('wellnessCheckin')} icon={<HeartIcon className="w-7 h-7" />}>
      <div className="space-y-6">
        {/* Mood Tracker */}
        <div>
          <h3 className="font-semibold text-brand-dark dark:text-slate-100 mb-3">{t('moodPrompt')}</h3>
          <div className="flex justify-around bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
            {moodOptions.map(({ mood, emoji, color }) => (
              <button
                key={mood}
                onClick={() => onLogMood(mood)}
                className={`text-4xl transition-transform duration-200 ease-in-out hover:scale-125 ${todaysMood?.mood === mood ? `scale-125 ring-2 ring-brand-primary rounded-full p-1` : 'opacity-60'}`}
                aria-label={`Select mood: ${mood}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {/* Mood History Chart */}
          <MoodHistory moodLogs={moodLog} t={t} />
        </div>

        {/* Habit Tracker */}
        <div>
          <h3 className="font-semibold text-brand-dark dark:text-slate-100 mb-3">{t('healthyHabits')}</h3>
          <div className="space-y-2">
            {habits.map(habit => {
              const isCompletedToday = habit.completedDates.includes(todayStr);
              return (
                <div key={habit.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg group">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`habit-${habit.id}`}
                      checked={isCompletedToday}
                      onChange={() => onToggleHabit(habit.id)}
                      className="h-5 w-5 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
                    />
                    <label htmlFor={`habit-${habit.id}`} className={`ml-3 text-slate-700 dark:text-slate-200 ${isCompletedToday ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                      {getHabitName(habit)}
                    </label>
                  </div>
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete habit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              );
            })}
          </div>
          
          <form onSubmit={handleAddSubmit} className="flex space-x-2 mt-3">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder={t('newHabitPlaceholder' as any)}
              className="flex-grow p-2 text-sm border dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md focus:ring-brand-secondary focus:border-brand-secondary"
            />
            <button type="submit" className="bg-brand-secondary text-white px-3 py-2 rounded-md hover:bg-emerald-600 transition-colors text-sm font-medium">
              {t('addHabit' as any)}
            </button>
          </form>
        </div>
      </div>
    </Card>
  );
};

export default WellnessTracker;

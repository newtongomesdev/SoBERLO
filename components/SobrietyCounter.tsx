import React, { useState, useEffect } from 'react';
import Card from './Card';
import { SunIcon } from './icons';
import { TranslationKey } from '../i18n';
import { Tracker } from '../types';

interface SobrietyCounterProps {
  trackers: Tracker[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onAddTracker: () => void;
  t: (key: TranslationKey) => string;
  lang: string;
  rank: { title: string; color: string; bg: string; emoji: string };
  points: number;
}

const SobrietyCounter: React.FC<SobrietyCounterProps> = ({ trackers, selectedIndex, onSelect, onAddTracker, t, lang, rank, points }) => {
  const activeTracker = trackers[selectedIndex] || trackers[0];

  const getNextLevelPoints = () => {
    if (points < 100) return 100 - points;
    if (points < 500) return 500 - points;
    if (points < 1500) return 1500 - points;
    if (points < 5000) return 5000 - points;
    return 0;
  };
  
  const nextLevelPts = getNextLevelPoints();

  const calculateDuration = () => {
    if (!activeTracker) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const start = new Date(activeTracker.startDate).getTime();
    const now = new Date().getTime();
    const difference = now - start;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [duration, setDuration] = useState(calculateDuration());

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(calculateDuration());
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTracker]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center bg-brand-light dark:bg-slate-900 p-4 rounded-lg shadow-inner transition-colors">
      <p className="text-4xl font-bold text-brand-primary">{value.toString().padStart(2, '0')}</p>
      <p className="text-xs uppercase text-slate-500 dark:text-slate-400 tracking-wider">{label}</p>
    </div>
  );

  if (!activeTracker) return null;

  return (
    <Card title={t('sobrietyJourney')} icon={<SunIcon className="w-7 h-7" />}>
      {/* Tracker Switcher */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2 custom-scrollbar">
        {trackers.map((tracker, idx) => (
          <button
            key={tracker.id}
            onClick={() => onSelect(idx)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-black transition-all ${
              idx === selectedIndex 
                ? 'bg-brand-primary text-white shadow-md transform scale-105' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {tracker.name}
          </button>
        ))}
        <button
          onClick={onAddTracker}
          className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-black bg-slate-100 dark:bg-slate-800 text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-200 transition-all"
        >
          + {lang === 'pt' ? 'Novo' : 'New'}
        </button>
      </div>

      {/* Rank Badge */}
      <div className={`mb-6 p-3 rounded-2xl ${rank.bg} flex items-center justify-between border border-transparent hover:border-current/20 transition-all duration-500`}>
        <div className="flex items-center space-x-3">
          <span className="text-2xl animate-bounce-slow">{rank.emoji}</span>
          <div>
            <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-100/50 tracking-widest">{lang === 'pt' ? 'Seu Ranking' : 'Your Rank'}</p>
            <p className={`text-lg font-black ${rank.color}`}>{rank.title}</p>
          </div>
        </div>
        {nextLevelPts > 0 && (
          <div className="bg-white/50 dark:bg-black/40 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 dark:text-slate-300">
            {lang === 'pt' ? 'PRÓXIMO NÍVEL EM' : 'LEVEL UP IN'} {nextLevelPts} pts
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-4">
        <TimeBlock value={duration.days} label={t('days')} />
        <TimeBlock value={duration.hours} label={t('hours')} />
        <TimeBlock value={duration.minutes} label={t('minutes')} />
        <TimeBlock value={duration.seconds} label={t('seconds')} />
      </div>
      
      {activeTracker.dailyCost > 0 && (
        <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">{lang === 'pt' ? 'Dinheiro Economizado' : 'Money Saved'}</p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {lang === 'pt' ? 'R$ ' : '$'} {(duration.days * activeTracker.dailyCost).toLocaleString(lang, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-3xl">💰</div>
        </div>
      )}

      <p className="text-center text-sm text-slate-500 mt-4">
        {t('startedOn')} {new Date(activeTracker.startDate).toLocaleDateString(lang)}. {t('keepGoing')}
      </p>
    </Card>
  );
};

export default SobrietyCounter;

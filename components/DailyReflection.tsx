import React, { useState } from 'react';
import Card from './Card';
import { BookOpenIcon } from './icons';
import { Reflection } from '../types';
import { TranslationKey } from '../i18n';

interface DailyReflectionProps {
  onAddReflection: (entry: string) => void;
  latestReflection: Reflection | null;
  t: (key: TranslationKey) => string;
  lang: string;
}

const DailyReflection: React.FC<DailyReflectionProps> = ({ onAddReflection, latestReflection, t, lang }) => {
  const [entry, setEntry] = useState('');

  const today = new Date().toLocaleDateString(lang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hasReflectedToday = latestReflection?.date && new Date(new Date(latestReflection.date).toLocaleDateString()).getTime() === new Date(new Date().toLocaleDateString()).getTime();

  const handleSubmit = () => {
    if (!entry.trim()) return;
    onAddReflection(entry);
    setEntry('');
  };

  return (
    <Card title={lang === 'pt' ? 'Reflexão Diária' : 'Daily Self-Reflection'} icon={<BookOpenIcon className="w-7 h-7" />}>
      <p className="text-xs text-slate-500 mb-4 -mt-2">{lang === 'pt' ? 'Registre seus pensamentos e vitórias do dia.' : 'Log your thoughts and victories for the day.'}</p>
      {hasReflectedToday && latestReflection ? (
         <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-3">{t('yourReflectionFor')} {today}</p>
              <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed text-lg">"{latestReflection.entry}"</p>
            </div>
         </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {[
              { id: 'victory', emoji: '🏆', key: 'victory' },
              { id: 'challenge', emoji: '🚧', key: 'challenge' },
              { id: 'feeling', emoji: '🧘', key: 'feeling' }
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => setEntry(prev => prev + (prev ? ' ' : '') + `${cat.emoji} ${t(cat.key as any)}: `)}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-brand-light dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full font-bold transition-all border border-transparent hover:border-brand-primary/30"
              >
                {cat.emoji} {t(cat.key as any)}
              </button>
            ))}
          </div>
          
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder={t('reflectionPlaceholder')}
            className="w-full p-4 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all min-h-[150px] text-sm leading-relaxed"
            rows={5}
          />
          
          <button
            onClick={handleSubmit}
            disabled={!entry.trim()}
            className="w-full bg-brand-primary hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none flex items-center justify-center"
          >
            <span className="flex items-center space-x-2">
              <span>💾</span>
              <span>{lang === 'pt' ? 'Salvar Reflexão' : 'Save Reflection'}</span>
            </span>
          </button>
        </div>
      )}
    </Card>
  );
};

export default DailyReflection;

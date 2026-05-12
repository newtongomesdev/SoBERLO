import React, { useState, useEffect } from 'react';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge } from '../types';

interface DailyChallengesProps {
  lang: string;
  onComplete: (points: number) => void;
  challenges: Challenge[];
  setChallenges: (challenges: Challenge[]) => void;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({ lang, onComplete, challenges, setChallenges }) => {
  const getDailyPool = () => [
    { id: '1', textEn: 'Drink 2L of water', textPt: 'Beba 2L de água', points: 10, category: 'health' },
    { id: '2', textEn: '10 mins of deep breathing', textPt: '10 min de respiração profunda', points: 15, category: 'mind' },
    { id: '3', textEn: 'No screens 1h before bed', textPt: 'Sem telas 1h antes de dormir', points: 20, category: 'mind' },
    { id: '4', textEn: 'Walk for 15 minutes', textPt: 'Caminhe por 15 minutos', points: 15, category: 'health' },
    { id: '5', textEn: 'Write down 3 things you are grateful for', textPt: 'Escreva 3 coisas pelas quais você é grato', points: 15, category: 'mind' },
    { id: '6', textEn: 'Call a supportive friend', textPt: 'Ligue para um amigo que te apoia', points: 25, category: 'social' },
    { id: '7', textEn: 'Read 5 pages of a book', textPt: 'Leia 5 páginas de um livro', points: 10, category: 'mind' },
  ];

  useEffect(() => {
    // Generate challenges if none for today
    if (challenges.length === 0) {
      const pool = getDailyPool();
      const shuffled = pool.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3).map(c => ({
        id: c.id,
        text: lang === 'pt' ? c.textPt : c.textEn,
        completed: false,
        points: c.points,
        category: c.category as any
      }));
      setChallenges(selected);
    }
  }, [lang]);

  const toggleChallenge = (id: string) => {
    setChallenges(challenges.map(c => {
      if (c.id === id && !c.completed) {
        onComplete(c.points);
        return { ...c, completed: true };
      }
      return c;
    }));
  };

  const allCompleted = challenges.length > 0 && challenges.every(c => c.completed);

  return (
    <Card title={lang === 'pt' ? 'Missões Diárias' : 'Daily Missions'} icon={<span>🎯</span>}>
      <div className="space-y-3">
        <AnimatePresence>
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                challenge.completed 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 opacity-60' 
                : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-brand-primary/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => toggleChallenge(challenge.id)}
                  disabled={challenge.completed}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    challenge.completed 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {challenge.completed && <span className="text-xs">✓</span>}
                </button>
                <span className={`text-sm font-bold ${challenge.completed ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                  {challenge.text}
                </span>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                challenge.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                +{challenge.points} XP
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {allCompleted && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 p-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl text-center shadow-lg"
          >
            <p className="text-white font-black text-sm uppercase tracking-widest">{lang === 'pt' ? 'Todas as Missões Concluídas!' : 'All Missions Completed!'}</p>
            <p className="text-white/80 text-xs">{lang === 'pt' ? 'Você é uma lenda!' : 'You are a legend!'}</p>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default DailyChallenges;

import React, { useState, useEffect } from 'react';
import Card from './Card';

interface BreathingExerciseProps {
  t: (key: string | any) => string;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ t }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            if (phase === 'inhale') {
              setPhase('hold');
              return 4;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 4;
            } else {
              setPhase('inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return t('inhale' as any) || 'Inhale';
      case 'hold': return t('hold' as any) || 'Hold';
      case 'exhale': return t('exhale' as any) || 'Exhale';
      default: return '';
    }
  };

  return (
    <Card title={t('breathingTitle' as any) || 'Zen Breathing'} icon={<span className="text-2xl">🧘</span>}>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Animated Circles */}
          <div className={`absolute inset-0 bg-brand-primary/10 rounded-full transition-all duration-[4000ms] ease-in-out ${isActive && phase === 'inhale' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}></div>
          <div className={`absolute inset-0 border-4 border-brand-primary/30 rounded-full transition-all duration-[4000ms] ease-in-out ${isActive && phase === 'inhale' ? 'scale-110' : 'scale-75'}`}></div>
          
          <div className="z-10 text-center">
            <p className="text-4xl font-black text-brand-primary transition-all duration-500">{seconds}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{getPhaseText()}</p>
          </div>
        </div>

        <button 
          onClick={() => { setIsActive(!isActive); if(!isActive) { setPhase('inhale'); setSeconds(4); } }}
          className={`mt-8 px-8 py-3 rounded-full font-black transition-all ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30 hover:scale-105'}`}
        >
          {isActive ? t('stop' as any) || 'Stop' : t('startBreathing' as any) || 'Start Breathing'}
        </button>
        
        <p className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 italic text-center max-w-[200px]">
          {t('breathingHelp' as any) || '4-4-4 Technique: Focus on your breath to calm your mind during cravings.'}
        </p>
      </div>
    </Card>
  );
};

export default BreathingExercise;

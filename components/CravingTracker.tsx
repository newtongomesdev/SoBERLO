import React, { useState } from 'react';
import Card from './Card';
import { CravingLog } from '../types';
import { TranslationKey } from '../i18n';

interface CravingTrackerProps {
    cravings: CravingLog[];
    onLogCraving: (craving: Omit<CravingLog, 'id' | 'date' | 'time'>) => void;
    t: (key: TranslationKey | any) => string;
}

const TRIGGERS = [
    { id: 'stress', label: 'Stress', emoji: '😫' },
    { id: 'boredom', label: 'Boredom', emoji: '🥱' },
    { id: 'social', label: 'Social Situation', emoji: '👥' },
    { id: 'sadness', label: 'Sadness', emoji: '😢' },
    { id: 'routine', label: 'Routine/Habit', emoji: '🔄' },
    { id: 'other', label: 'Other', emoji: '🧩' },
];

const CravingTracker: React.FC<CravingTrackerProps> = ({ cravings, onLogCraving, t }) => {
    const [isLogging, setIsLogging] = useState(false);
    const [intensity, setIntensity] = useState<number>(5);
    const [selectedTrigger, setSelectedTrigger] = useState<string>('');
    const [customTrigger, setCustomTrigger] = useState<string>('');

    const handleLog = () => {
        if (!selectedTrigger) return;
        const finalTrigger = selectedTrigger === 'other' && customTrigger.trim() ? customTrigger.trim() : selectedTrigger;
        onLogCraving({ intensity, trigger: finalTrigger });
        setIsLogging(false);
        setIntensity(5);
        setSelectedTrigger('');
        setCustomTrigger('');
    };

    return (
        <Card title={t('cravingsTitle' as any) || "Craving Tracker"} icon={<span className="text-2xl">🔥</span>}>
            {!isLogging ? (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-slate-500">
                            {t('cravingsDesc' as any) || "Track your urges to better understand your triggers."}
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsLogging(true)}
                        className="w-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 py-3 rounded-xl font-bold border border-orange-200 dark:border-orange-800/50 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors flex justify-center items-center space-x-2"
                    >
                        <span className="text-xl">⚡</span>
                        <span>{t('logCraving' as any) || "Log a Craving"}</span>
                    </button>
                    
                    {cravings.length > 0 && (
                        <div className="mt-6 space-y-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('recentLogs' as any)}</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {cravings.slice(0, 5).map(c => (
                                    <div key={c.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xl">{TRIGGERS.find(t => t.id === c.trigger)?.emoji || '🧩'}</span>
                                            <div>
                                                <span className="font-semibold text-slate-700 dark:text-slate-200 block">{t(c.trigger as any) || TRIGGERS.find(t => t.id === c.trigger)?.label || c.trigger}</span>
                                                <span className="text-xs text-slate-400">{c.date} at {c.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`font-bold ${c.intensity > 7 ? 'text-red-500' : c.intensity > 4 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                                Level {c.intensity}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in-down">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('intensityLabel' as any)}</label>
                        <input 
                            type="range" min="1" max="10" value={intensity} 
                            onChange={e => setIntensity(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>{t('mild' as any)}</span>
                            <span className="font-bold text-orange-600">{intensity}</span>
                            <span>{t('severe' as any)}</span>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">{t('whatTriggeredIt' as any)}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {TRIGGERS.map(triggerItem => (
                                <button 
                                    key={triggerItem.id}
                                    onClick={() => setSelectedTrigger(triggerItem.id)}
                                    className={`py-2 px-2 text-sm rounded-lg border flex items-center justify-center space-x-1 transition-all ${
                                        selectedTrigger === triggerItem.id ? 'bg-orange-100 dark:bg-orange-900/50 border-orange-500 text-orange-800 dark:text-orange-100 font-bold' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <span>{triggerItem.emoji}</span>
                                    <span>{t(triggerItem.id as any) || triggerItem.label}</span>
                                </button>
                            ))}
                        </div>
                        {selectedTrigger === 'other' && (
                            <div className="mt-3 animate-fade-in-down">
                                <input 
                                    type="text" 
                                    value={customTrigger}
                                    onChange={e => setCustomTrigger(e.target.value)}
                                    placeholder={t('customTriggerPlaceholder' as any) || "What is triggering you?"}
                                    className="w-full px-3 py-2 border border-orange-300 dark:border-orange-800 dark:bg-slate-800 dark:text-white rounded-md text-sm focus:ring-orange-500 focus:border-orange-500"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex space-x-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button 
                            onClick={() => setIsLogging(false)}
                            className="flex-1 py-2 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            {t('cancelBtn' as any)}
                        </button>
                        <button 
                            onClick={handleLog}
                            disabled={!selectedTrigger}
                            className="flex-1 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                        >
                            {t('saveLogBtn' as any)}
                        </button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default CravingTracker;

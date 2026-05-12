import React, { useState } from 'react';
import { TranslationKey } from '../i18n';

interface OnboardingProps {
    onComplete: (data: { name: string; dob: string; addictionType: string; dailyCost: number }) => void;
    t: (key: TranslationKey | any) => string;
}

const ADDICTION_TYPES = [
    { id: 'alcohol', labelKey: 'addictionAlcohol', icon: '🍺' },
    { id: 'smoking', labelKey: 'addictionSmoking', icon: '🚬' },
    { id: 'drugs', labelKey: 'addictionDrugs', icon: '💊' },
    { id: 'gambling', labelKey: 'addictionGambling', icon: '🎰' },
    { id: 'gaming', labelKey: 'addictionGaming', icon: '🎮' },
    { id: 'screens', labelKey: 'addictionScreens', icon: '📱' },
    { id: 'other', labelKey: 'addictionOther', icon: '🧩' },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, t }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [addictionType, setAddictionType] = useState('');
    const [dailyCost, setDailyCost] = useState<string>('');
    const [error, setError] = useState('');

    const handleNext = () => {
        setError('');
        if (step === 1) {
            if (!name.trim()) {
                setError(t('errorNameRequired' as any));
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!dob) {
                setError(t('errorDobRequired' as any));
                return;
            }
            setStep(3);
        } else if (step === 3) {
            if (!addictionType) {
                setError(t('errorAddictionRequired' as any));
                return;
            }
            setStep(4);
        } else if (step === 4) {
            onComplete({ name, dob, addictionType, dailyCost: parseFloat(dailyCost) || 0 });
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 flex items-center justify-center z-50 p-4 transition-colors duration-500">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg p-8 relative overflow-hidden border border-transparent dark:border-slate-800 transition-all">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 dark:bg-slate-800">
                    <div 
                        className="h-full bg-brand-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                </div>

                <div className="text-center mb-8 mt-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <h1 className="text-3xl font-black tracking-tight text-brand-dark dark:text-white">SoBERLO</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('onboardingWelcome' as any)}</p>
                </div>

                <div className="animate-fade-in-down">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">{t('whatsYourName' as any)}</h2>
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t('namePlaceholder' as any)}
                                    className="w-full px-4 py-3 text-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">{t('whatsYourDob' as any)}</h2>
                            <div>
                                <input
                                    type="date"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="w-full px-4 py-3 text-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">{t('whatAreYouQuitting' as any)}</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {ADDICTION_TYPES.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setAddictionType(type.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                            addictionType === type.id 
                                            ? 'border-brand-primary bg-blue-50 dark:bg-blue-900/20 text-brand-primary dark:text-blue-300 shadow-md transform scale-105' 
                                            : 'border-slate-200 dark:border-slate-700 hover:border-brand-primary dark:hover:border-blue-900/30 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                        }`}
                                    >
                                        <span className="text-3xl mb-2">{type.icon}</span>
                                        <span className="font-bold text-xs uppercase tracking-wider">{t(type.labelKey as any)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">{t('dailyCostTitle' as any) || "How much did you spend daily?"}</h2>
                            <p className="text-center text-slate-500 dark:text-slate-400 text-sm font-medium">{t('dailyCostSubtitle' as any) || "We'll help you track how much you've saved."}</p>
                            <div>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        value={dailyCost}
                                        onChange={(e) => setDailyCost(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-3 text-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {error && <p className="text-red-500 text-sm font-bold text-center mt-4 animate-fade-in-down">{error}</p>}

                <div className="mt-10 flex justify-between items-center">
                    {step > 1 ? (
                        <button 
                            onClick={() => setStep(s => s - 1)}
                            className="px-6 py-3 text-slate-600 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                            {t('backButton' as any)}
                        </button>
                    ) : <div></div>}
                    <button 
                        onClick={handleNext}
                        className="px-8 py-3 bg-brand-primary text-white font-black rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        {step === 4 ? t('finishButton' as any) : t('nextButton' as any)}
                    </button>
                </div>

                {/* Privacy Notice */}
                <div className="mt-8 text-center bg-green-50 dark:bg-green-950/20 p-3 rounded-xl flex items-center justify-center space-x-2 border border-green-100 dark:border-green-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[10px] text-green-700 dark:text-green-400 font-bold uppercase tracking-wider">{t('privacyNotice' as any)}</p>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;

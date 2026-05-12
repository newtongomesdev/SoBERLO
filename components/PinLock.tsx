import React, { useState } from 'react';
import { TranslationKey } from '../i18n';

interface PinLockProps {
    onUnlock: () => void;
    correctPin: string;
    t: (key: TranslationKey | any) => string;
}

const PinLock: React.FC<PinLockProps> = ({ onUnlock, correctPin, t }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleKeyPress = (num: number) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError(false);
            
            if (newPin.length === 4) {
                if (newPin === correctPin) {
                    onUnlock();
                } else {
                    setError(true);
                    setTimeout(() => setPin(''), 500); // Clear after delay
                }
            }
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError(false);
    };

    return (
        <div className="fixed inset-0 bg-brand-light flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center animate-fade-in-down">
                <div className="text-5xl text-brand-primary mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-brand-dark mb-2">{t('appLocked')}</h2>
                <p className="text-slate-500 mb-8 text-center">{t('enterPin')}</p>

                {/* PIN Dots */}
                <div className="flex space-x-4 mb-8">
                    {[0, 1, 2, 3].map(i => (
                        <div 
                            key={i} 
                            className={`w-4 h-4 rounded-full transition-all ${
                                pin.length > i 
                                    ? 'bg-brand-primary scale-110' 
                                    : 'bg-slate-200'
                            } ${error ? 'bg-red-500 animate-pulse' : ''}`}
                        />
                    ))}
                </div>
                
                {error && <p className="text-red-500 text-sm mb-4 animate-fade-in-up">{t('wrongPin')}</p>}

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-4 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handleKeyPress(num)}
                            className="bg-slate-50 hover:bg-slate-100 text-brand-dark text-xl font-semibold py-4 rounded-xl transition-colors"
                        >
                            {num}
                        </button>
                    ))}
                    <div className="col-start-2">
                        <button
                            onClick={() => handleKeyPress(0)}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-brand-dark text-xl font-semibold py-4 rounded-xl transition-colors"
                        >
                            0
                        </button>
                    </div>
                    <div className="col-start-3">
                        <button
                            onClick={handleDelete}
                            className="w-full h-full flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
                        >
                            ⌫
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PinLock;

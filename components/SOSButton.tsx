import React, { useState } from 'react';
import { TranslationKey } from '../i18n';
import { EmergencyContact } from '../types';
import BreathingExercise from './BreathingExercise';

interface SOSButtonProps {
    t: (key: TranslationKey | any) => string;
    lang: string;
    emergencyContacts?: EmergencyContact[];
    onAddContact?: (name: string, phone: string) => void;
}

const groundingSteps = {
    en: [
        { title: '5 things you can SEE', desc: 'Look around and name 5 things you can see right now (e.g., a pen, a spot on the ceiling).' },
        { title: '4 things you can TOUCH', desc: 'Pay attention to your body and think of 4 things you can feel (e.g., your shirt on your back, the chair you are sitting on).' },
        { title: '3 things you can HEAR', desc: 'Listen for 3 sounds. It could be the hum of a refrigerator, birds outside, or your own breathing.' },
        { title: '2 things you can SMELL', desc: 'Identify 2 smells. If you can\'t smell anything, try to remember your favorite smells.' },
        { title: '1 thing you can TASTE', desc: 'Focus on 1 thing you can taste right now, like toothpaste or a sip of water.' }
    ],
    pt: [
        { title: '5 coisas que você pode VER', desc: 'Olhe ao redor e identifique 5 coisas (ex: uma caneta, uma textura na parede, um quadro).' },
        { title: '4 coisas que você pode TOCAR', desc: 'Preste atenção ao toque físico e sinta 4 coisas (ex: o tecido da sua roupa, o peso do corpo na cadeira, o chão sob os pés).' },
        { title: '3 coisas que você pode OUVIR', desc: 'Concentre-se em 3 sons diferentes. Pode ser o barulho da rua, o vento ou a sua própria respiração.' },
        { title: '2 coisas que você pode CHEIRAR', desc: 'Identifique 2 odores. Se não sentir nenhum, feche os olhos e tente lembrar de cheiros que te trazem paz (café, chuva, terra molhada).' },
        { title: '1 coisa que você pode PROVAR', desc: 'Foque em 1 sabor que está na sua boca agora, ou imagine o sabor da sua comida favorita.' }
    ],
};

const SOSButton: React.FC<SOSButtonProps> = ({ t, lang, emergencyContacts = [], onAddContact }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'breathe' | 'ground' | 'help'>('breathe');
    const grounding = groundingSteps[lang as keyof typeof groundingSteps] || groundingSteps.en;
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');
    const [isAddingContact, setIsAddingContact] = useState(false);


    const handleSaveContact = () => {
        if (newContactName.trim() && newContactPhone.trim() && onAddContact) {
            onAddContact(newContactName, newContactPhone);
            setNewContactName('');
            setNewContactPhone('');
            setIsAddingContact(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-red-500 hover:bg-red-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 animate-pulse-slow"
                aria-label="SOS - Emergency Help"
            >
                <span className="text-2xl font-bold">SOS</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up overflow-hidden border border-transparent dark:border-slate-800">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center space-x-2">
                            <span className="text-2xl">🆘</span>
                            <span>{t('sosTitle' as any)}</span>
                        </h2>
                        <button onClick={() => { setIsOpen(false); }} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
                    </div>
                    <p className="text-red-100 text-sm mt-1">{t('sosSubtitle' as any)}</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b dark:border-slate-800">
                    {[
                        { id: 'breathe' as const, label: t('sosBreathe' as any), icon: '🌬️' },
                        { id: 'ground' as const, label: t('sosGround' as any), icon: '🌍' },
                        { id: 'help' as const, label: t('sosHelp' as any), icon: '📞' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-2 text-sm font-black flex items-center justify-center space-x-1 transition-all ${
                                activeTab === tab.id
                                    ? 'text-red-600 border-b-2 border-red-600 bg-red-50 dark:bg-red-900/10'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 min-h-[250px] max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {activeTab === 'breathe' && (
                        <div className="animate-fade-in">
                            <BreathingExercise t={t} />
                        </div>
                    )}

                    {activeTab === 'ground' && (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 font-medium bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">{t('sosGroundingDesc' as any)}</p>
                            {grounding.map((step, i) => (
                                <div key={i} className="flex items-start space-x-3 p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-sm transition-all">
                                    <span className="text-3xl mt-1">{['👁️', '✋', '👂', '👃', '👅'][i]}</span>
                                    <div>
                                        <span className="text-slate-800 dark:text-slate-100 font-black block">{step.title}</span>
                                        <span className="text-slate-500 dark:text-slate-400 text-sm leading-tight block mt-1">{step.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'help' && (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t('sosHelpDesc' as any)}</p>
                            <a href="tel:188" className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-200 dark:border-green-900/30 hover:bg-green-100 dark:hover:bg-green-950/40 transition-colors">
                                <span className="text-3xl">📞</span>
                                <div>
                                    <p className="font-black text-green-800 dark:text-green-400">CVV - Centro de Valorização da Vida</p>
                                    <p className="text-green-600 dark:text-green-300 text-lg font-black">188</p>
                                    <p className="text-green-700/60 dark:text-green-400/60 text-xs font-bold uppercase tracking-wider">{t('sosAvailable' as any)}</p>
                                </div>
                            </a>
                            <a href="https://www.cvv.org.br" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-200 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors">
                                <span className="text-3xl">💬</span>
                                <div>
                                    <p className="font-black text-blue-800 dark:text-blue-400">{t('sosOnlineChat' as any)}</p>
                                    <p className="text-blue-600 dark:text-blue-300 text-sm font-bold">www.cvv.org.br</p>
                                </div>
                            </a>
                            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900/30">
                                <p className="text-sm text-amber-800 dark:text-amber-300 font-bold leading-tight">{t('sosReminder' as any)}</p>
                            </div>

                            {/* Custom Contacts */}
                            {emergencyContacts.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">{lang === 'pt' ? 'Meus Contatos' : 'My Contacts'}</h4>
                                    {emergencyContacts.map(contact => (
                                        <a key={contact.id} href={`tel:${contact.phone}`} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all">
                                            <div>
                                                <p className="font-black text-slate-800 dark:text-slate-100">{contact.name}</p>
                                                <p className="text-brand-primary dark:text-blue-400 font-bold text-sm">{contact.phone}</p>
                                            </div>
                                            <span className="text-2xl bg-white dark:bg-slate-700 p-2 rounded-xl shadow-sm">☎️</span>
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Add Contact Form */}
                            <div className="mt-6 border-t dark:border-slate-800 pt-4 px-1">
                                {!isAddingContact ? (
                                    <button 
                                        onClick={() => setIsAddingContact(true)}
                                        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                                    >
                                        + {lang === 'pt' ? 'Adicionar Contato de Emergência' : 'Add Emergency Contact'}
                                    </button>
                                ) : (
                                    <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 animate-fade-in-down">
                                        <input 
                                            type="text" 
                                            placeholder={lang === 'pt' ? 'Nome (ex: Mãe, Terapeuta)' : 'Name (e.g. Mom, Therapist)'} 
                                            value={newContactName}
                                            onChange={e => setNewContactName(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all dark:text-white"
                                        />
                                        <input 
                                            type="tel" 
                                            placeholder={lang === 'pt' ? 'Telefone' : 'Phone Number'} 
                                            value={newContactPhone}
                                            onChange={e => setNewContactPhone(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all dark:text-white"
                                        />
                                        <div className="flex space-x-2 pt-2">
                                            <button onClick={() => setIsAddingContact(false)} className="flex-1 py-3 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Cancel</button>
                                            <button onClick={handleSaveContact} disabled={!newContactName || !newContactPhone} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-black hover:bg-red-600 disabled:opacity-50 transition-all shadow-lg shadow-red-500/20">Save</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SOSButton;

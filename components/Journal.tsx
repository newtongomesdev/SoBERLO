import React, { useState, useMemo } from 'react';
import { JournalEntry, Mood } from '../types';
import { TranslationKey } from '../i18n';

interface JournalProps {
    entries: JournalEntry[];
    onAddEntry: (title: string, content: string, mood?: Mood) => void;
    onDeleteEntry: (id: string) => void;
    t: (key: TranslationKey | any) => string;
}

const moodIcons: Record<Mood, string> = {
    [Mood.Great]: '🤩',
    [Mood.Good]: '😊',
    [Mood.Okay]: '😐',
    [Mood.Bad]: '😔',
    [Mood.Awful]: '😫',
};

const Journal: React.FC<JournalProps> = ({ entries, onAddEntry, onDeleteEntry, t }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedMood, setSelectedMood] = useState<Mood | undefined>();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEntries = useMemo(() => {
        return entries.filter(e => 
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            e.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [entries, searchQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && content.trim()) {
            onAddEntry(title.trim(), content.trim(), selectedMood);
            setTitle('');
            setContent('');
            setSelectedMood(undefined);
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-primary to-blue-600 p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black flex items-center space-x-3">
                        <span className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">✍️</span>
                        <div>
                            <span className="block">{t('journalTitle' as any)}</span>
                            <span className="block text-[10px] font-medium opacity-70 mt-0.5">{t('journalSubtitle' as any)}</span>
                        </div>
                    </h2>
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className={`p-2 rounded-full transition-all duration-300 ${isAdding ? 'bg-red-500 rotate-45' : 'bg-white/20 hover:bg-white/30'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
                
                {/* Search Bar */}
                {!isAdding && (
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-white/50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input 
                            type="text"
                            placeholder={t('searchThoughts' as any)}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-10 pr-4 text-sm placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
                        />
                    </div>
                )}
            </div>

            <div className="p-6">
                {isAdding ? (
                    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-down">
                        <div className="flex space-x-2 justify-center pb-2">
                            {Object.entries(moodIcons).map(([mood, icon]) => (
                                <button
                                    key={mood}
                                    type="button"
                                    onClick={() => setSelectedMood(mood as Mood)}
                                    className={`text-2xl p-2 rounded-xl transition-all ${selectedMood === mood ? 'bg-brand-light dark:bg-blue-900/30 scale-125 shadow-sm' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                        <input 
                            type="text" 
                            placeholder={t('dayTitle' as any)} 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl text-lg font-bold focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                            required 
                            autoFocus
                        />
                        <textarea 
                            placeholder={t('mindPlaceholder' as any)} 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 rounded-xl text-base h-48 resize-none focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                            required 
                        />
                        <button type="submit" className="w-full bg-brand-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95">
                            {t('saveJournal' as any)}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredEntries.length === 0 ? (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                                <div className="text-5xl mb-4 opacity-20">📖</div>
                                <p className="text-slate-500 font-medium">{searchQuery ? t('noResults' as any) : t('emptyJournal' as any)}</p>
                                <button onClick={() => setIsAdding(true)} className="mt-4 text-brand-primary font-bold hover:underline">
                                    {t('startWriting' as any)}
                                </button>
                            </div>
                        ) : (
                            filteredEntries.map(entry => (
                                <div key={entry.id} className="group bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-transparent hover:border-brand-primary/20 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-3">
                                            {entry.mood && (
                                                <span className="text-2xl bg-white dark:bg-slate-700 p-1.5 rounded-lg shadow-sm">{moodIcons[entry.mood]}</span>
                                            )}
                                            <div>
                                                <h3 className="font-black text-slate-800 dark:text-slate-100 leading-tight">{entry.title}</h3>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                    {new Date(entry.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onDeleteEntry(entry.id)}
                                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-500 whitespace-pre-wrap">
                                        {entry.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journal;


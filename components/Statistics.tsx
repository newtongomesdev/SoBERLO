import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { MoodLog, CravingLog } from '../types';
import { TranslationKey } from '../i18n';
import { motion } from 'framer-motion';

interface StatisticsProps {
    moodLogs: MoodLog[];
    cravings: CravingLog[];
    t: (key: TranslationKey | any) => string;
}

const Statistics: React.FC<StatisticsProps> = ({ moodLogs, cravings, t }) => {
    // Process mood data for chart (last 14 logs for better trend)
    const moodData = useMemo(() => {
        return [...moodLogs].reverse().slice(-14).map(log => {
            let score = 3;
            if (log.mood === 'great') score = 5;
            if (log.mood === 'good') score = 4;
            if (log.mood === 'bad') score = 2;
            if (log.mood === 'awful') score = 1;
            return {
                date: new Date(log.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }),
                score
            };
        });
    }, [moodLogs]);

    // Process cravings data for chart (last 7 days intensity average)
    const cravingsData = useMemo(() => {
        return [...cravings].reverse().slice(-7).map(log => ({
            date: new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' }),
            intensity: log.intensity
        }));
    }, [cravings]);

    // --- NEURO-INSIGHT ENGINE (The Local Brain) ---
    const insights = useMemo(() => {
        if (cravings.length < 3) return null;

        // 1. Trigger Analysis
        const triggerCounts: Record<string, number> = {};
        cravings.forEach(c => triggerCounts[c.trigger] = (triggerCounts[c.trigger] || 0) + 1);
        const topTrigger = Object.entries(triggerCounts).sort((a,b) => b[1] - a[1])[0][0];

        // 2. Time Window Analysis
        const timeCounts: Record<string, number> = { 'Morning': 0, 'Afternoon': 0, 'Evening': 0, 'Night': 0 };
        cravings.forEach(c => {
            const hourMatch = c.time.match(/^(\d{1,2})/);
            if (hourMatch) {
                const hour = parseInt(hourMatch[1]);
                if (hour >= 5 && hour < 12) timeCounts['Morning']++;
                else if (hour >= 12 && hour < 18) timeCounts['Afternoon']++;
                else if (hour >= 18 && hour < 22) timeCounts['Evening']++;
                else timeCounts['Night']++;
            }
        });
        const criticalWindow = Object.entries(timeCounts).sort((a,b) => b[1] - a[1])[0][0];

        // 3. Correlation: Mood vs Cravings
        // Check if cravings tend to happen on days with lower mood
        let lowMoodCravingCount = 0;
        let daysWithMoodAndCraving = 0;
        
        cravings.forEach(c => {
            const sameDayMood = moodLogs.find(m => m.date === c.date);
            if (sameDayMood) {
                daysWithMoodAndCraving++;
                if (sameDayMood.mood === 'bad' || sameDayMood.mood === 'awful') {
                    lowMoodCravingCount++;
                }
            }
        });
        const moodCorrelation = daysWithMoodAndCraving > 0 ? lowMoodCravingCount / daysWithMoodAndCraving : 0;

        // 4. Intensity Trend
        const recentIntensity = cravings.slice(0, 3).reduce((acc, c) => acc + c.intensity, 0) / 3;
        const olderIntensity = cravings.slice(3, 6).reduce((acc, c) => acc + c.intensity, 0) / (cravings.length >= 6 ? 3 : cravings.length - 3 || 1);
        const intensityTrend = recentIntensity > olderIntensity ? 'rising' : 'falling';

        return {
            topTrigger,
            criticalWindow,
            moodCorrelation,
            intensityTrend,
            recentIntensity
        };
    }, [cravings, moodLogs]);

    const getAdviceByTrigger = (trigger: string) => {
        const tLower = trigger.toLowerCase();
        if (tLower.includes('stress') || tLower.includes('estresse') || tLower.includes('ansiedade')) 
            return { icon: '🧘', text: t('adviceStress') };
        if (tLower.includes('social') || tLower.includes('amigos') || tLower.includes('festa')) 
            return { icon: '👥', text: t('adviceSocial') };
        if (tLower.includes('tedio') || tLower.includes('tédio') || tLower.includes('boredom')) 
            return { icon: '🎨', text: t('adviceBoredom') };
        if (tLower.includes('triste') || tLower.includes('sad')) 
            return { icon: '☀️', text: t('adviceSadness') };
        return { icon: '🛡️', text: t('adviceDefault') };
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header section with summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t('totalMoodLogs' as any) || "Mood Logs"}</p>
                    <p className="text-2xl font-black text-emerald-900 dark:text-white">{moodLogs.length}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-2xl border border-orange-100 dark:border-orange-800/50">
                    <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">{t('totalCravings' as any) || "Cravings Logged"}</p>
                    <p className="text-2xl font-black text-orange-900 dark:text-white">{cravings.length}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Avg Intensity</p>
                    <p className="text-2xl font-black text-blue-900 dark:text-white">
                        {(cravings.reduce((acc, c) => acc + c.intensity, 0) / (cravings.length || 1)).toFixed(1)}
                    </p>
                </div>
            </div>

            {/* NEURO-INSIGHT ENGINE (The Visual Brain) */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 dark:bg-black p-1 rounded-3xl shadow-2xl relative overflow-hidden"
            >
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-dark p-8 rounded-[1.4rem] text-white">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-2xl font-black flex items-center space-x-3">
                                <span className="bg-blue-500 p-2 rounded-xl text-xl">🧠</span>
                                <span>{t('neuroInsightTitle')}</span>
                            </h3>
                            <p className="text-slate-400 text-sm mt-1">{t('neuroInsightSubtitle')}</p>
                        </div>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></div>
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150"></div>
                        </div>
                    </div>

                    {insights ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Insight Card: Trigger */}
                                <div className="bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-2xl border border-white/10 group">
                                    <div className="flex justify-between items-start mb-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">{t('majorTrigger')}</p>
                                        <span className="text-xl group-hover:scale-125 transition-transform">🎯</span>
                                    </div>
                                    <p className="text-2xl font-black text-white capitalize">{insights.topTrigger}</p>
                                    <p className="text-xs text-slate-400 mt-2">Appears in {( (Object.values(cravings.filter(c => c.trigger === insights.topTrigger)).length / cravings.length) * 100).toFixed(0)}% of your entries.</p>
                                </div>

                                {/* Insight Card: Time */}
                                <div className="bg-white/5 hover:bg-white/10 transition-colors p-5 rounded-2xl border border-white/10 group">
                                    <div className="flex justify-between items-start mb-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">{t('dangerZone')}</p>
                                        <span className="text-xl group-hover:scale-125 transition-transform">⏰</span>
                                    </div>
                                    <p className="text-2xl font-black text-white">{insights.criticalWindow}</p>
                                    <p className="text-xs text-slate-400 mt-2">Your probability of cravings peaks during this window.</p>
                                </div>
                            </div>

                            {/* Actionable Advice Banner */}
                            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 rounded-2xl border border-blue-500/30">
                                <div className="flex items-start space-x-4">
                                    <span className="text-3xl">{getAdviceByTrigger(insights.topTrigger).icon}</span>
                                    <div>
                                        <p className="font-bold text-blue-100">{t('neuroRecommendation')}</p>
                                        <p className="text-sm text-slate-300 mt-1">{getAdviceByTrigger(insights.topTrigger).text}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{t('moodCorrelation')}</p>
                                    <div className="flex items-end space-x-2 mt-1">
                                        <p className="text-xl font-bold">{(insights.moodCorrelation * 100).toFixed(0)}%</p>
                                        <p className="text-[10px] text-slate-400 pb-1">Link to low mood</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{t('intensityTrend')}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <p className={`text-xl font-bold ${insights.intensityTrend === 'falling' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {insights.intensityTrend === 'falling' ? t('improving') : t('escalating')}
                                        </p>
                                        <span>{insights.intensityTrend === 'falling' ? '📉' : '📈'}</span>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">{t('resilienceScore')}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <p className="text-xl font-bold">{((1 - (insights.recentIntensity / 10)) * 100).toFixed(0)}</p>
                                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500" style={{ width: `${(1 - (insights.recentIntensity / 10)) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <div className="text-5xl mb-4 opacity-30">🔋</div>
                            <p className="text-slate-400 font-medium">{t('neuroCharging')}</p>
                            <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                                {t('neuroHelpText')}
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mood Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span>📈</span>
                            <span>{t('moodTrend' as any) || "Emotional Stability"}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-2 py-1 rounded-full font-black uppercase">14 Day View</span>
                    </h3>
                    <div className="h-64 w-full">
                        {moodData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={moodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400 dark:text-slate-500" />
                                    <YAxis domain={[1, 5]} hide />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorMood)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-400 text-sm italic">Logging your first mood starts the engine.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cravings Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span>⚡</span>
                            <span>{t('cravingsTrend' as any) || "Craving Intensity"}</span>
                        </div>
                        <span className="text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-2 py-1 rounded-full font-black uppercase">Weekly Flow</span>
                    </h3>
                    <div className="h-64 w-full">
                        {cravingsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cravingsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor' }} className="text-slate-400 dark:text-slate-500" />
                                    <YAxis domain={[0, 10]} hide />
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }}
                                    />
                                    <Bar dataKey="intensity" radius={[6, 6, 0, 0]} barSize={30}>
                                        {cravingsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.intensity > 7 ? '#ef4444' : entry.intensity > 4 ? '#f97316' : '#f59e0b'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                                <p className="text-slate-400 text-sm italic">Log cravings to see your progress flow.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;

import React from 'react';
import { motion } from 'framer-motion';

interface SobrietyTreeProps {
  days: number;
  lang: string;
}

const Leaf = ({ className, delay = 0, color = "from-emerald-400 to-emerald-600" }: { className: string, delay?: number, color?: string }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1, rotate: [-5, 5, -5] }}
    transition={{ 
      scale: { type: "spring", stiffness: 60, damping: 12, delay: delay * 0.2 },
      rotate: { repeat: Infinity, duration: 4 + Math.random() * 2, delay: delay, ease: "easeInOut" }
    }}
    className={`absolute bg-gradient-to-br ${color} rounded-tr-[50%] rounded-bl-[50%] rounded-tl-sm rounded-br-sm shadow-xl shadow-emerald-900/20 border border-white/10 ${className}`}
    style={{ transformOrigin: 'bottom left' }}
  />
);

const Firefly = ({ x, y, delay }: { x: string, y: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x, y }}
    animate={{
      y: `calc(${y} - 30px)`,
      x: `calc(${x} + ${Math.random() > 0.5 ? '20px' : '-20px'})`,
      opacity: [0, 1, 0.8, 0]
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    className="absolute w-1.5 h-1.5 bg-yellow-200 rounded-full blur-[1px] shadow-[0_0_10px_3px_rgba(253,224,71,0.6)] z-20 pointer-events-none"
  />
);

const SobrietyTree: React.FC<SobrietyTreeProps> = ({ days, lang }) => {
  const getStage = () => {
    if (days >= 90) return 4; // Majestic Tree
    if (days >= 30) return 3; // Full Tree
    if (days >= 7) return 2;  // Young Tree
    if (days >= 1) return 1;  // Sprout
    return 0; // Seed
  };

  const stage = getStage();

  return (
    <div className="relative flex flex-col items-center justify-end h-72 w-full bg-slate-900 rounded-[2rem] p-6 overflow-hidden border border-slate-800 shadow-2xl group">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-900/20 to-transparent"></div>
         <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
            className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl transition-colors duration-1000 ${stage >= 3 ? 'bg-emerald-500/20' : 'bg-blue-500/10'}`}
         ></motion.div>
         {/* Sun/Moon */}
         <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full blur-[2px] shadow-[0_0_50px_rgba(253,224,71,0.2)] opacity-80"
         ></motion.div>
      </div>

      <div className="relative flex flex-col items-center justify-end h-full z-10 w-full mb-10">
        {/* Ground */}
        <div className="absolute bottom-0 w-3/4 h-8 bg-gradient-to-t from-slate-800 to-slate-800/0 rounded-[100%] blur-[4px]"></div>
        <div className="w-24 h-2 bg-slate-700 rounded-full mb-1 shadow-lg shadow-black/50 relative z-20"></div>

        {/* The Tree System */}
        <div className="relative flex flex-col items-center justify-end h-48 w-full z-10">
          
          {/* Stage 0: Seed */}
          {stage === 0 && (
             <motion.div 
               animate={{ scale: [1, 1.2, 1], boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 20px rgba(16,185,129,0.5)', '0 0 0px rgba(16,185,129,0)'] }} 
               transition={{ repeat: Infinity, duration: 3 }}
               className="w-5 h-4 bg-gradient-to-br from-amber-600 to-amber-800 rounded-[50%] mb-1 shadow-xl border border-amber-500/30 relative z-10"
             ></motion.div>
          )}

          {/* Trunk & Branches (Stage 1+) */}
          {stage >= 1 && (
            <motion.div 
              initial={{ height: 0 }} 
              animate={{ height: Math.min(stage * 30, 100) }} 
              transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
              className="w-4 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-t-full relative shadow-[inset_-2px_0_4px_rgba(0,0,0,0.3)] origin-bottom z-10"
            >
                {/* Stage 1: Sprout */}
                {stage === 1 && (
                    <>
                        <Leaf className="w-8 h-8 -left-6 top-2" delay={1} />
                        <Leaf className="w-6 h-6 -right-4 top-6 rotate-90" delay={2} color="from-emerald-300 to-emerald-500" />
                    </>
                )}

                {/* Stage 2: Young Tree */}
                {stage === 2 && (
                    <>
                        <Leaf className="w-12 h-12 -left-10 top-4" delay={1} />
                        <Leaf className="w-10 h-10 -right-8 top-8 rotate-90" delay={2} />
                        <Leaf className="w-14 h-14 -top-8 -left-4 rotate-45" delay={3} color="from-emerald-300 to-emerald-500" />
                    </>
                )}

                {/* Stage 3: Full Tree */}
                {stage >= 3 && (
                    <>
                        {/* Back layer */}
                        <Leaf className="w-20 h-20 -left-16 -top-4 -rotate-12 opacity-80" delay={1} color="from-emerald-700 to-emerald-900" />
                        <Leaf className="w-20 h-20 -right-16 -top-4 rotate-45 opacity-80" delay={2} color="from-emerald-700 to-emerald-900" />
                        
                        {/* Middle layer */}
                        <Leaf className="w-24 h-24 -left-12 -top-12 rotate-12" delay={3} />
                        <Leaf className="w-24 h-24 -right-12 -top-10 rotate-90" delay={4} />
                        
                        {/* Front layer */}
                        <Leaf className="w-28 h-28 -top-20 -left-10 rotate-45" delay={5} color="from-emerald-300 to-emerald-500" />
                        
                        {/* Fireflies */}
                        <Firefly x="-40px" y="20px" delay={0} />
                        <Firefly x="40px" y="0px" delay={1.5} />
                        <Firefly x="-20px" y="-40px" delay={3} />
                    </>
                )}

                {/* Stage 4: Majestic Tree */}
                {stage >= 4 && (
                    <>
                        {/* Extra volume */}
                        <Leaf className="w-32 h-32 -top-28 -left-12 rotate-[60deg] opacity-90" delay={6} color="from-emerald-400 to-emerald-600" />
                        <Leaf className="w-20 h-20 -top-16 -left-24 -rotate-[20deg]" delay={7} />
                        <Leaf className="w-20 h-20 -top-16 -right-20 rotate-[110deg]" delay={8} />

                        {/* Magic Fruits/Orbs */}
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} className="absolute -top-12 left-0 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)]"></motion.div>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5 }} className="absolute -top-4 -right-8 w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.6)]"></motion.div>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 3 }} className="absolute -top-20 -left-6 w-5 h-5 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.6)]"></motion.div>

                        {/* More Fireflies */}
                        <Firefly x="60px" y="-20px" delay={0.5} />
                        <Firefly x="-60px" y="-60px" delay={2} />
                        <Firefly x="0px" y="-80px" delay={4} />
                    </>
                )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 text-center z-30">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/80 mb-1 drop-shadow-md">
          {lang === 'pt' ? 'Sua Árvore da Vida' : 'Your Tree of Life'}
        </p>
        <p className="text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {stage === 0 && (lang === 'pt' ? 'Uma semente de esperança...' : 'A seed of hope...')}
          {stage === 1 && (lang === 'pt' ? 'Os primeiros brotos surgem!' : 'The first sprouts appear!')}
          {stage === 2 && (lang === 'pt' ? 'Sua força está crescendo.' : 'Your strength is growing.')}
          {stage === 3 && (lang === 'pt' ? 'Uma árvore robusta e resiliente.' : 'A robust and resilient tree.')}
          {stage === 4 && (lang === 'pt' ? 'Florescendo em plena majestade!' : 'Blooming in full majesty!')}
        </p>
      </div>
    </div>
  );
};

export default SobrietyTree;

import React, { useState, useEffect } from 'react';
import Mascot from './Mascot';
import { SparklesIcon } from './Icons';

interface LoadingScreenProps {
  type: 'scanning' | 'brewing' | 'roleplay';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ type }) => {
  const [message, setMessage] = useState("");

  const messages = {
    scanning: ["Scanning the universe for context...", "Identifying key objects...", "Consulting the language stars...", "Translating reality..."],
    brewing: ["Mixing vocabulary potions...", "Designing fun challenges...", "Polishing definitions...", "Preparing the stage..."],
    roleplay: ["LingoBot is getting into character...", "Rehearsing lines...", "Setting the scene...", "Warming up voice..."]
  };

  useEffect(() => {
    const list = messages[type];
    setMessage(list[0]);
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % list.length;
      setMessage(list[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in w-full overflow-hidden">
      
      {/* Planetary System */}
      <div className="relative w-80 h-80 mb-12 flex items-center justify-center">
         
         {/* Central Mascot */}
         <div className="relative z-10 animate-bounce-subtle">
             <Mascot emotion="thinking" size="xl" />
         </div>

         {/* Orbit 1 (Outer) - Clockwise */}
         <div className="absolute w-[280px] h-[280px] rounded-full border-[3px] border-dashed border-indigo-200/50 animate-spin-slow">
             {/* Planet 1 */}
             <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-red-400 shadow-lg border-2 border-white flex items-center justify-center">
                <div className="w-full h-1 bg-white/30 transform rotate-45 rounded-full"></div>
             </div>
         </div>

         {/* Orbit 2 (Inner) - Counter-Clockwise */}
         <div className="absolute w-[180px] h-[180px] rounded-full border-[3px] border-dashed border-slate-300/60 animate-spin-reverse-slow">
             {/* Planet 2 */}
             <div className="absolute -top-3 left-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 shadow-lg border-2 border-white"></div>
         </div>
         
         {/* Background Glow */}
         <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      <div className="text-center z-10 max-w-md px-4">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight animate-fade-in">{message}</h3>
        <div className="flex items-center justify-center gap-2 text-indigo-500 text-sm font-bold uppercase tracking-widest animate-pulse">
            <SparklesIcon />
            <span>AI Processing</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
import React, { useRef, useState } from 'react';
import { VocabularyItem } from '../types';
import { SparklesIcon, TrophyIcon, FireIcon } from './Icons';
import confetti from 'canvas-confetti';

interface MagicRecapCardProps {
  theme: string;
  xpEarned: number;
  totalWords: number;
  starWord: VocabularyItem;
  streak: number;
  onClose: () => void;
}

const MagicRecapCard: React.FC<MagicRecapCardProps> = ({ theme, xpEarned, totalWords, starWord, streak, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Trigger confetti on mount
  React.useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffffff', '#fcd34d', '#818cf8']
    });
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current || !window.html2canvas) return;
    
    setIsDownloading(true);
    try {
      const canvas = await window.html2canvas(cardRef.current, {
        scale: 2, // High resolution
        backgroundColor: null,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `ContextLingo-${theme.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        
        {/* The Card to Capture */}
        <div 
          ref={cardRef}
          className="w-full aspect-[4/5] rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)'
          }}
        >
          {/* Decorative Noise/Grain Overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          {/* Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <SparklesIcon />
              <span className="text-sm font-bold uppercase tracking-widest">Lesson Complete</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight break-words">
              {theme}
            </h2>
          </div>

          {/* Star Word Highlight */}
          <div className="relative z-10 bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 text-center transform rotate-[-2deg]">
            <p className="text-white/80 text-xs font-bold uppercase mb-1">Star Word</p>
            <h3 className="text-3xl font-black text-white mb-1">{starWord.word}</h3>
            <p className="text-white/90 italic text-sm">"{starWord.meaning}"</p>
          </div>

          {/* Stats Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-4">
             <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-1 text-yellow-300 mb-1">
                   <TrophyIcon /> <span className="text-xs font-bold uppercase">XP Earned</span>
                </div>
                <p className="text-2xl font-bold text-white">+{xpEarned}</p>
             </div>
             <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="flex items-center gap-1 text-orange-300 mb-1">
                   <FireIcon /> <span className="text-xs font-bold uppercase">Streak</span>
                </div>
                <p className="text-2xl font-bold text-white">{streak} Days</p>
             </div>
          </div>

          {/* Footer Branding */}
          <div className="relative z-10 text-center border-t border-white/20 pt-4 mt-2">
             <p className="text-white/60 text-xs font-medium">ContextLingo • Learning from Reality</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-3">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3.5 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-indigo-50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isDownloading ? (
               <span className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
            ) : (
               <>Download Image 📸</>
            )}
          </button>
          
          <button 
            onClick={onClose}
            className="w-full py-3.5 text-white/80 font-medium hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            Back to Themes
          </button>
        </div>

      </div>
    </div>
  );
};

export default MagicRecapCard;
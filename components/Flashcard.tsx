import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { SpeakerIcon, MicrophoneIcon, HeartIcon } from './Icons';
import { playSfx } from '../utils/audio';

interface FlashcardProps {
  item: VocabularyItem;
  language: string;
  onAddXp?: (amount: number) => void;
  isSaved?: boolean;
  onToggleSave?: (item: VocabularyItem) => void;
  index?: number;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const Flashcard: React.FC<FlashcardProps> = ({ item, language, onAddXp, isSaved = false, onToggleSave, index = 0 }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [xpAwarded, setXpAwarded] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const langMap: Record<string, string> = {
    'English': 'en-US', 'Spanish': 'es-ES', 'French': 'fr-FR', 'Japanese': 'ja-JP', 'Korean': 'ko-KR'
  };
  const bcpLanguage = langMap[language] || 'en-US';

  const showTranslation = item.example_translation && 
                          item.example_translation.trim().toLowerCase() !== item.example.trim().toLowerCase();

  const handleFlip = () => {
      playSfx('pop');
      setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    setIsPlaying(true);
    window.speechSynthesis.cancel();
    const textToRead = isFlipped ? `${item.word}. ${item.example}` : item.word;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = bcpLanguage;
    utterance.rate = 0.85; 
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSfx('click');
    onToggleSave && onToggleSave(item);
  };

  const handlePronunciationCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMicError(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError("N/A");
      return;
    }
    if (isListening) return;
    setIsListening(true);
    setFeedbackStatus('idle');

    const recognition = new SpeechRecognition();
    recognition.lang = bcpLanguage;
    recognition.continuous = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      if (transcript.includes(item.word.toLowerCase())) {
        playSfx('correct');
        setFeedbackStatus('correct');
        if (!xpAwarded && onAddXp) {
            onAddXp(10);
            setXpAwarded(true);
        }
      } else {
        playSfx('incorrect');
        setFeedbackStatus('incorrect');
      }
      setIsListening(false);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setMicError("Error");
    };
    recognition.onend = () => setIsListening(false);
    try { recognition.start(); } catch { setIsListening(false); }
  };

  // Helper to determine text size based on length
  const getDefinitionTextSize = (text: string) => {
      if (text.length > 100) return 'text-sm';
      if (text.length > 50) return 'text-base';
      return 'text-lg';
  };

  return (
    <div 
      className="group perspective-1000 w-full h-80 cursor-pointer animate-enter select-none"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleFlip}
    >
      <div 
        className="relative w-full h-full text-center transition-transform duration-500 transform-style-3d shadow-lg rounded-[1.5rem]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* FRONT */}
        <div 
          className="absolute inset-0 w-full h-full bg-white border border-slate-100 rounded-[1.5rem] flex flex-col items-center justify-center p-6 backface-hidden"
          style={{ backfaceVisibility: 'hidden', zIndex: isFlipped ? 0 : 1 }}
        >
          {/* Top colored strip for style */}
          <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-t-[1.5rem] ${isSaved ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>

          {onToggleSave && (
            <button
                onClick={handleToggleSaveClick}
                className={`absolute top-4 right-4 p-2.5 rounded-full transition-all z-20 shadow-sm ${isSaved ? 'text-rose-500 bg-rose-50 hover:bg-rose-100' : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'}`}
            >
                <HeartIcon filled={isSaved} />
            </button>
          )}

          <div className="flex-grow flex flex-col items-center justify-center pt-6 w-full overflow-hidden">
             <h3 className="text-3xl font-black text-slate-800 mb-3 tracking-tight break-words max-w-full px-2">{item.word}</h3>
             {item.pronunciation && (
                <span className="text-sm font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                    /{item.pronunciation}/
                </span>
             )}
          </div>

          <div className="flex gap-4 mt-auto z-10 w-full justify-center pb-2">
             <button onClick={handlePlayAudio} className={`p-4 rounded-2xl border-2 transition-all shadow-sm relative ${isPlaying ? 'text-white bg-indigo-500 border-indigo-500 animate-pulse-ring' : 'text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-500 bg-white'}`}>
                <SpeakerIcon />
             </button>
             <button onClick={handlePronunciationCheck} className={`p-4 rounded-2xl border-2 transition-all shadow-sm relative ${isListening ? 'text-white bg-rose-500 border-rose-500 animate-pulse-ring' : xpAwarded ? 'text-white bg-emerald-500 border-emerald-500' : 'text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-500 bg-white'}`}>
                <MicrophoneIcon />
                {micError && <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] bg-rose-600 text-white px-2 py-1 rounded shadow-lg whitespace-nowrap">{micError}</span>}
             </button>
          </div>
          
          {feedbackStatus === 'correct' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-20 rounded-[1.5rem] backdrop-blur-sm">
                  <div className="text-center animate-pop-in">
                      <div className="text-5xl mb-2">🎉</div>
                      <div className="text-emerald-500 font-black text-2xl uppercase tracking-wider">Perfect!</div>
                  </div>
              </div>
          )}
          {feedbackStatus === 'incorrect' && <div className="absolute top-4 left-4 text-rose-500 animate-shake font-black text-sm uppercase">Try again</div>}
          
          <div className="absolute bottom-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Tap to flip</div>
        </div>

        {/* BACK - Updated for scrolling */}
        <div 
          className="absolute inset-0 w-full h-full bg-indigo-50/50 border border-indigo-100 rounded-[1.5rem] flex flex-col p-5 text-left backface-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: isFlipped ? 1 : 0 }}
        >
           {/* Scrollable Content Container */}
           <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 relative">
              
              {/* Definition Section */}
              <div className="mb-4 bg-white p-4 rounded-xl border border-indigo-100 shadow-sm relative">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 sticky top-0 bg-white z-10">Definition</p>
                 <p className={`text-slate-800 font-bold leading-snug ${getDefinitionTextSize(item.meaning)}`}>
                    {item.meaning}
                 </p>
                 
                 {/* Audio button moved inside/near definition for better layout */}
                 <button 
                    onClick={handlePlayAudio} 
                    className={`absolute top-2 right-2 p-1.5 rounded-full hover:bg-indigo-50 transition-all ${isPlaying ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`}
                 >
                    <SpeakerIcon />
                 </button>
              </div>
              
              {/* Context Section */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">In Context</p>
                 <p className="text-slate-600 font-medium italic mb-2 text-sm leading-relaxed">"{item.example}"</p>
                 {showTranslation && (
                     <p className="text-slate-400 text-xs font-semibold pt-2 border-t border-slate-100 leading-relaxed">{item.example_translation}</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
import React, { useState, useEffect, useRef } from 'react';
import { WordChainTurn } from '../types';
import { generateWordChainTurn } from '../services/geminiService'; // Changed import
import { getRandomStartingWord } from '../services/wordChainService'; // Keeping for init only
import { SparklesIcon, RefreshIcon, XIcon, TrophyIcon, FireIcon, BookIcon, LightBulbIcon } from './Icons';
import Mascot from './Mascot';
import ConfirmModal from './ConfirmModal';
import confetti from 'canvas-confetti';
import { playSfx } from '../utils/audio';

interface WordChainGameProps {
  onBack: () => void;
  onAddXp: (amount: number) => void;
}

const TIME_PER_TURN = 20; // Increased time slightly for AI latency

const WordChainGame: React.FC<WordChainGameProps> = ({ onBack, onAddXp }) => {
  const [turns, setTurns] = useState<WordChainTurn[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null); // Stores the Lose Reason
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(TIME_PER_TURN);
  const [isActive, setIsActive] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Game with Random Word
  useEffect(() => {
      startNewGame();
  }, []);

  const startNewGame = () => {
      const starter = getRandomStartingWord();
      setTurns([{ 
          word: starter.word, 
          player: 'ai', 
          definition: starter.definition 
      }]);
      setScore(0);
      setGameOver(false);
      setError(null);
      setInput('');
      setTimeLeft(TIME_PER_TURN);
      setIsActive(true);
      setIsProcessing(false);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, isProcessing]);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    
    if (isActive && !gameOver && timeLeft > 0 && !isProcessing) {
        interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
    } else if (timeLeft === 0 && !gameOver) {
        handleGameOver("Time's Up!");
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, gameOver, isProcessing]);

  const getLastWord = () => turns.length > 0 ? turns[turns.length - 1].word : "";
  const getLastLetter = () => getLastWord().slice(-1).toUpperCase();

  const handleGameOver = (reason: string) => {
      playSfx('incorrect');
      setGameOver(true);
      setIsActive(false);
      setError(reason);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || gameOver || isProcessing) return;

    playSfx('click');
    const userWord = input.trim().toUpperCase();
    const requiredLetter = getLastLetter();

    // 1. Basic Client Validation (Fast fail)
    if (!userWord.startsWith(requiredLetter)) {
        handleGameOver(`Wrong letter! Must start with '${requiredLetter}'`);
        return;
    }
    if (turns.some(t => t.word === userWord)) {
        handleGameOver(`'${userWord}' was already used!`);
        return;
    }

    // Optimistic UI update
    setTurns(prev => [...prev, { word: userWord, player: 'user' as const }]);
    setInput('');
    setIsProcessing(true); // Pause timer, show loading
    
    try {
        // 2. Call Gemini
        const historyWords = turns.map(t => t.word); // History before this turn
        const result = await generateWordChainTurn(userWord, historyWords);
        
        if (result.isValid) {
             if (result.aiWord) {
                 // Success!
                 playSfx('correct');
                 setTurns(prev => [
                     ...prev, 
                     { word: result.aiWord!.toUpperCase(), player: 'ai', definition: result.aiDefinition }
                 ]);
                 setScore(prev => prev + 1);
                 
                 // Reset Timer
                 setTimeLeft(TIME_PER_TURN);
                 setIsActive(true);
                 setError(null);

                 // Gamification
                 if ((score + 1) % 5 === 0) {
                     playSfx('success');
                     confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
                     onAddXp(50);
                 } else {
                     onAddXp(10);
                 }
             } else {
                 // AI gave up (Rare)
                 setGameOver(true);
                 setError("Victory! LingoBot gave up.");
                 playSfx('success');
                 confetti({ particleCount: 150, spread: 120, origin: { y: 0.6 } });
                 onAddXp(200);
             }
        } else {
             // AI rejected the word
             handleGameOver(result.invalidReason || "Invalid word!");
        }
    } catch (err) {
        console.error(err);
        // On API error, maybe let them pass or just fail safely
        handleGameOver("AI Connection Lost");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleRestart = () => {
      playSfx('click');
      startNewGame();
  };
  
  const handleExitClick = () => {
      playSfx('click');
      if (!gameOver && score > 0) {
          setShowExitConfirm(true);
      } else {
          onBack();
      }
  };

  // Check if input is valid while typing for UI feedback
  const isInputStartingCorrectly = input.length === 0 || input.toUpperCase().startsWith(getLastLetter());

  // Calculate timer percentage for progress bar
  const timerPercentage = (timeLeft / TIME_PER_TURN) * 100;
  const timerColor = timeLeft <= 5 ? 'bg-rose-500' : 'bg-indigo-500';

  if (turns.length === 0) return null; // Wait for init

  const isWin = error?.includes("Victory");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-nunito animate-fade-in relative">
        <ConfirmModal 
            isOpen={showExitConfirm}
            title="Quit Game?"
            message={`You have a score of ${score}. If you quit now, you lose your current streak.`}
            confirmLabel="Quit Game"
            onConfirm={() => { setShowExitConfirm(false); onBack(); }}
            onCancel={() => setShowExitConfirm(false)}
            variant="danger"
        />

        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
            <button onClick={handleExitClick} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
                <XIcon />
            </button>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <SparklesIcon /> Word Chain
            </h2>
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                <TrophyIcon />
                <span className="font-bold text-indigo-700">{score}</span>
            </div>
        </div>

        {/* Timer Bar */}
        {!gameOver && (
            <div className="w-full h-1.5 bg-slate-200">
                <div 
                    className={`h-full transition-all duration-1000 linear ${timerColor}`} 
                    style={{ width: `${timerPercentage}%` }}
                />
            </div>
        )}

        {/* Game Area */}
        <div className="flex-grow max-w-2xl mx-auto w-full p-4 flex flex-col relative">
            
            {/* Background Mascot (Normal State) */}
            {!gameOver && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-0 opacity-10 pointer-events-none transition-all">
                    <Mascot emotion={score > 10 ? "excited" : "happy"} size="xl" />
                </div>
            )}

            {/* Timer Countdown Number (Floating) */}
            {!gameOver && (
                <div className={`absolute top-4 right-4 z-10 font-black text-2xl ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>
                    {timeLeft}s
                </div>
            )}

            <div 
                ref={scrollRef}
                className="flex-grow overflow-y-auto space-y-4 pb-48 custom-scrollbar relative z-10"
            >
                {/* Introduction Hint */}
                <div className="flex justify-center mb-4">
                     <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-xs font-bold border border-amber-100 flex items-center gap-2 shadow-sm animate-enter">
                        <LightBulbIcon />
                        <span>Link words! "Appl<span className="font-black underline">e</span>" → "<span className="font-black underline">E</span>gg"</span>
                     </div>
                </div>

                {turns.map((turn, idx) => (
                    <div 
                        key={idx} 
                        className={`flex flex-col ${turn.player === 'user' ? 'items-end' : 'items-start'}`}
                    >
                        <div 
                            className={`px-6 py-3 rounded-2xl text-lg font-black tracking-wide shadow-sm border-2 max-w-[80%] animate-pop-in ${
                                turn.player === 'user' 
                                ? 'bg-indigo-600 text-white border-indigo-600 rounded-br-none' 
                                : 'bg-white text-slate-700 border-slate-200 rounded-bl-none'
                            }`}
                        >
                            {turn.word}
                        </div>
                        {turn.definition && (
                            <div className="mt-2 max-w-[85%] animate-fade-in">
                                <div className="bg-white border-l-4 border-indigo-400 pl-3 py-2 pr-3 rounded-r-xl shadow-sm text-left">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <div className="text-indigo-400 scale-75 origin-left"><BookIcon /></div>
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Meaning</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 leading-snug">
                                        {turn.definition}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {isProcessing && (
                   <div className="flex flex-col items-start">
                        <div className="px-6 py-3 rounded-2xl bg-slate-100 text-slate-400 border-2 border-slate-200 rounded-bl-none animate-pulse flex items-center gap-2">
                           <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                           <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                           <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                   </div>
                )}
            </div>
            
            {/* Input Area */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 pb-8 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        
                        {/* Clearer Input UI: Prefix style */}
                        <div className={`flex items-stretch rounded-xl border-2 transition-all overflow-hidden ${
                            !isInputStartingCorrectly 
                            ? 'border-rose-400 bg-rose-50 ring-2 ring-rose-200' 
                            : 'border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100'
                        } ${gameOver || isProcessing ? 'opacity-50 grayscale' : ''}`}>
                            
                            {/* The "Rule" Prefix */}
                            <div className={`flex items-center px-4 border-r-2 font-black text-xl select-none ${
                                !isInputStartingCorrectly 
                                ? 'bg-rose-100 text-rose-600 border-rose-200' 
                                : 'bg-slate-100 text-slate-500 border-slate-100'
                            }`}>
                                {getLastLetter()}
                            </div>

                            <input 
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder={isProcessing ? "LingoBot is thinking..." : "Type word here..."}
                                className="flex-grow px-4 py-4 bg-transparent font-bold text-lg text-slate-800 uppercase outline-none placeholder-slate-300"
                                autoFocus
                                disabled={gameOver || isProcessing}
                                maxLength={20}
                            />

                            <button 
                                type="submit"
                                disabled={!input || gameOver || isProcessing}
                                className="px-6 bg-indigo-600 text-white font-bold hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:bg-slate-400 transition-colors"
                            >
                                SEND
                            </button>
                        </div>
                        
                        {!isInputStartingCorrectly && !gameOver && (
                            <p className="text-xs font-bold text-rose-500 px-1 animate-shake">
                                Oops! Word must start with "{getLastLetter()}"
                            </p>
                        )}

                    </form>
                    
                    <div className="mt-3 flex justify-between items-center px-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                           Dictionary: Gemini AI
                        </p>
                        {!gameOver && (
                            <button onClick={handleRestart} className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                                <RefreshIcon /> Reset Game
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Full Screen Game Over Overlay */}
        {gameOver && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-fade-in px-4">
                 
                 {/* Teasing Mascot (Jumps out) */}
                 <div className="mb-8 animate-bounce drop-shadow-2xl">
                     <Mascot emotion={isWin ? "excited" : "teasing"} size="xl" />
                 </div>

                <div className={`w-full max-w-md p-8 rounded-[2.5rem] text-center border-8 shadow-2xl bg-white relative overflow-hidden ${isWin ? 'border-emerald-400' : 'border-rose-400'}`}>
                    
                    {/* Background Pattern for Card */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

                    <div className="relative z-10">
                        <h3 className={`text-4xl font-black mb-2 uppercase tracking-tight ${isWin ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {isWin ? "YOU WON!" : "GAME OVER"}
                        </h3>
                        
                        <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${isWin ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                           {error}
                        </div>
                        
                        <div className="bg-slate-100 rounded-2xl p-4 mb-8">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Final Score</p>
                            <div className="flex items-center justify-center gap-2">
                                <TrophyIcon />
                                <span className="text-4xl font-black text-slate-800">{score}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleRestart}
                                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_6px_0_rgb(67,56,202)] hover:shadow-[0_4px_0_rgb(67,56,202)] hover:translate-y-0.5 active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-2 text-lg uppercase tracking-wide"
                            >
                                <RefreshIcon /> Play Again
                            </button>
                            <button 
                                onClick={onBack}
                                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
                            >
                                Exit to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default WordChainGame;
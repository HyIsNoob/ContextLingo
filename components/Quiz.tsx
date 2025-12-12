import React, { useState, useEffect } from 'react';
import { MiniQuizQuestion, MultipleChoiceQuestion, ScrambleQuestion, MatchingQuestion } from '../types';
import { CheckIcon, XIcon, RefreshIcon, TrophyIcon, SparklesIcon, WandIcon } from './Icons';
import Mascot from './Mascot';
import confetti from 'canvas-confetti';
import { playSfx } from '../utils/audio';

interface QuizProps {
  questions: MiniQuizQuestion[];
  onComplete?: () => void;
  onAnswer?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onAnswer }) => {
  // Internal queue of questions to display (allows filtering for retries)
  const [activeQuestions, setActiveQuestions] = useState<MiniQuizQuestion[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  // Mascot Cheering State
  const [showCheer, setShowCheer] = useState(false);
  
  // Track mistakes by ID for Smart Retry
  const [mistakes, setMistakes] = useState<number[]>([]);

  // Scramble State
  const [scrambleAnswer, setScrambleAnswer] = useState<string[]>([]);
  const [scrambleOptions, setScrambleOptions] = useState<string[]>([]);
  
  // Matching State
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedMatchCard, setSelectedMatchCard] = useState<{id: string, text: string, type: 'term'|'def'} | null>(null);
  const [matchingCards, setMatchingCards] = useState<{id: string, text: string, type: 'term'|'def'}[]>([]);

  // Multiple Choice State
  const [mcSelected, setMcSelected] = useState<string | null>(null);
  const [mcShake, setMcShake] = useState<string | null>(null);

  // Initialize questions on load
  useEffect(() => {
    if (questions && questions.length > 0) {
        setActiveQuestions(questions);
        setCurrentIndex(0);
        setScore(0);
        setMistakes([]);
        setShowResult(false);
    }
  }, [questions]);

  const currentQuestion = activeQuestions && activeQuestions.length > 0 ? activeQuestions[currentIndex] : null;

  useEffect(() => {
    resetQuestionState();
  }, [currentIndex, activeQuestions]);

  const resetQuestionState = () => {
    setIsAnswered(false);
    setShowCheer(false); // Reset cheer state
    setMcSelected(null);
    setScrambleAnswer([]);
    setMatchedPairs([]);
    setSelectedMatchCard(null);

    if (!currentQuestion) return;

    if (currentQuestion.type === 'scramble') {
      setScrambleOptions([...(currentQuestion as ScrambleQuestion).scrambled_words]);
    } else if (currentQuestion.type === 'matching') {
      const mq = currentQuestion as MatchingQuestion;
      const cards = [
        ...mq.pairs.map((p, i) => ({ id: `t-${i}`, text: p.term, type: 'term' as const })),
        ...mq.pairs.map((p, i) => ({ id: `d-${i}`, text: p.definition, type: 'def' as const }))
      ];
      setMatchingCards(cards.sort(() => Math.random() - 0.5));
    }
  };

  const markMistake = () => {
     if (currentQuestion) {
         setMistakes(prev => {
             if (prev.includes(currentQuestion.id)) return prev;
             return [...prev, currentQuestion.id];
         });
     }
  };

  // --- Visual Effects ---
  const triggerCorrectEffect = () => {
      playSfx('correct');
      confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#34d399', '#fcd34d', '#818cf8']
      });
  };

  const triggerWrongEffect = () => {
      playSfx('incorrect');
      // Red particles for wrong
      confetti({
          particleCount: 20,
          spread: 30,
          startVelocity: 15,
          origin: { y: 0.7 },
          colors: ['#f43f5e', '#e11d48']
      });
  };

  // --- Handlers ---

  const handleMCSelect = (option: string) => {
    if (isAnswered) return;
    setMcSelected(option);
    const q = currentQuestion as MultipleChoiceQuestion;
    
    if (option === q.correct_answer) {
      triggerCorrectEffect();
      handleSuccess();
    } else {
      setMcShake(option);
      setTimeout(() => setMcShake(null), 500);
      triggerWrongEffect();
      markMistake(); // Track error
      setIsAnswered(true);
      if (onAnswer) onAnswer();
    }
  };

  const handleScrambleWordClick = (word: string, fromBank: boolean) => {
    if (isAnswered) return;
    playSfx('click');
    if (fromBank) {
      setScrambleAnswer([...scrambleAnswer, word]);
      setScrambleOptions(scrambleOptions.filter(w => w !== word)); 
    } else {
      setScrambleOptions([...scrambleOptions, word]);
      setScrambleAnswer(scrambleAnswer.filter(w => w !== word));
    }
  };

  const checkScramble = () => {
    const q = currentQuestion as ScrambleQuestion;
    const userAnswer = scrambleAnswer.join(' ');
    const correctAnswer = q.target_sentence_words.join(' ');
    
    setIsAnswered(true);
    if (onAnswer) onAnswer();
    
    if (userAnswer === correctAnswer) {
      triggerCorrectEffect();
      handleSuccess();
    } else {
      triggerWrongEffect();
      markMistake();
    }
  };

  const handleMatchingCardClick = (card: {id: string, text: string, type: 'term'|'def'}) => {
    if (matchedPairs.includes(card.id)) return;
    playSfx('click');
    
    if (!selectedMatchCard) {
      setSelectedMatchCard(card);
    } else {
      if (selectedMatchCard.id === card.id) {
        setSelectedMatchCard(null); // Deselect
        return;
      }
      
      const q = currentQuestion as MatchingQuestion;
      const isMatch = q.pairs.some(p => 
        (p.term === card.text && p.definition === selectedMatchCard.text) ||
        (p.term === selectedMatchCard.text && p.definition === card.text)
      );

      if (isMatch) {
        triggerCorrectEffect();
        setMatchedPairs(prev => [...prev, card.id, selectedMatchCard.id]);
        setSelectedMatchCard(null);
        if (matchedPairs.length + 2 >= matchingCards.length) {
           handleSuccess();
           setIsAnswered(true);
           if (onAnswer) onAnswer();
        }
      } else {
        triggerWrongEffect();
        setSelectedMatchCard(null);
        markMistake();
      }
    }
  };

  const handleSuccess = () => {
    setScore(prev => prev + 1);
    setIsAnswered(true);
    
    // Trigger Mascot Cheer
    setShowCheer(true);
    setTimeout(() => setShowCheer(false), 2000); // Hide after 2 seconds

    if (onAnswer) onAnswer();
  };

  const handleNext = () => {
    playSfx('pop');
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      playSfx('success');
      setShowResult(true);
      if (onComplete) onComplete();
    }
  };

  const handleSmartRetry = () => {
    playSfx('click');
    const retryQuestions = questions.filter(q => mistakes.includes(q.id));
    setActiveQuestions(retryQuestions);
    setMistakes([]);
    setScore(0);
    setCurrentIndex(0);
    setShowResult(false);
  };

  const handleFullReset = () => {
    playSfx('click');
    setActiveQuestions(questions);
    setMistakes([]);
    setScore(0);
    setCurrentIndex(0);
    setShowResult(false);
  };

  // --- Render Empty State ---
  if (!activeQuestions || activeQuestions.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center h-full flex flex-col justify-center items-center">
        <div className="text-slate-300 mb-4 text-4xl"><SparklesIcon /></div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Quiz not available</h3>
      </div>
    );
  }

  // --- Render Result ---
  if (showResult) {
    const isPerfect = score === activeQuestions.length;
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center animate-pop-in shadow-sm h-full flex flex-col justify-center items-center">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 text-5xl shadow-inner ${isPerfect ? 'bg-yellow-100 text-yellow-500' : 'bg-slate-100 text-slate-500'}`}>
          {isPerfect ? <TrophyIcon /> : <CheckIcon />}
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{isPerfect ? "Perfect Score!" : "Quiz Complete!"}</h3>
        <p className="text-slate-500 mb-8">You got <span className="font-bold text-slate-900">{score}</span> out of <span className="font-bold text-slate-900">{activeQuestions.length}</span> correct.</p>
        <div className="space-y-3 w-full max-w-xs">
            {mistakes.length > 0 && (
                 <button onClick={handleSmartRetry} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                    <WandIcon /> Smart Retry ({mistakes.length})
                </button>
            )}
            <button onClick={handleFullReset} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${mistakes.length > 0 ? 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50' : 'bg-slate-900 text-white hover:bg-black'}`}>
                <RefreshIcon /> {mistakes.length > 0 ? "Restart All" : "Practice Again"}
            </button>
        </div>
      </div>
    );
  }

  // --- Render Questions ---
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px] md:h-[600px] relative">
      
      {/* CHEERING MASCOT OVERLAY */}
      {showCheer && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-[2rem] animate-fade-in pointer-events-none">
            <div className="animate-bounce mb-6">
                 <Mascot emotion="excited" size="xl" />
            </div>
            <h3 className="text-4xl font-black text-emerald-500 animate-pop-in tracking-tight drop-shadow-sm">Correct!</h3>
            <p className="text-emerald-400 font-bold uppercase tracking-widest mt-2 animate-pulse">Keep going!</p>
        </div>
      )}

      {/* Progress Bar - Fixed at top */}
      <div className="w-full bg-slate-100 h-1.5 shrink-0">
        <div className="bg-indigo-600 h-1.5 transition-all duration-500 ease-out" style={{ width: `${((currentIndex) / activeQuestions.length) * 100}%` }}></div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Question {currentIndex + 1} of {activeQuestions.length}
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">Score: {score}</span>
            </div>

            {/* MULTIPLE CHOICE */}
            {currentQuestion?.type === 'multiple-choice' && (() => {
            const q = currentQuestion as MultipleChoiceQuestion;
            return (
                <div className="animate-fade-in pb-2">
                <h3 className="text-xl font-bold text-slate-900 mb-4 leading-snug">{q.question}</h3>
                <div className="space-y-3">
                    {q.options.map((opt, i) => {
                        let style = "border-slate-200 hover:border-indigo-300";
                        if (isAnswered) {
                            if (opt === q.correct_answer) style = "bg-emerald-50 border-emerald-500 text-emerald-800";
                            else if (mcSelected === opt) style = "bg-rose-50 border-rose-500 text-rose-800";
                            else style = "opacity-50 border-slate-100";
                        }
                        return (
                            <button key={i} onClick={() => handleMCSelect(opt)} disabled={isAnswered}
                                className={`w-full text-left p-4 rounded-xl border-2 font-semibold transition-all ${style} ${mcShake === opt ? 'animate-shake' : ''}`}>
                                {opt}
                            </button>
                        )
                    })}
                </div>
                </div>
            )
            })()}

            {/* SCRAMBLE */}
            {currentQuestion?.type === 'scramble' && (() => {
            const q = currentQuestion as ScrambleQuestion;
            return (
                <div className="animate-fade-in flex flex-col pb-2">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Translate this sentence</h3>
                <p className="text-slate-500 mb-6 italic">"{q.english_sentence}"</p>
                <div className="min-h-[50px] border-b-2 border-slate-200 mb-6 flex flex-wrap gap-2 pb-2">
                    {scrambleAnswer.map((word, i) => (
                        <button key={`${word}-ans-${i}`} onClick={() => handleScrambleWordClick(word, false)} disabled={isAnswered}
                            className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-bold hover:bg-indigo-200 transition-all animate-pop-in text-sm">
                            {word}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {scrambleOptions.map((word, i) => (
                        <button key={`${word}-opt-${i}`} onClick={() => handleScrambleWordClick(word, true)} disabled={isAnswered}
                            className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-sm">
                            {word}
                        </button>
                    ))}
                </div>
                {!isAnswered && (
                    <button onClick={checkScramble} disabled={scrambleAnswer.length === 0}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl disabled:opacity-50 hover:bg-indigo-700 mt-2">
                        Check Answer
                    </button>
                )}
                </div>
            )
            })()}

            {/* MATCHING */}
            {currentQuestion?.type === 'matching' && (() => {
            return (
                <div className="animate-fade-in pb-2">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Match the pairs</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {matchingCards.map((card) => {
                            const isMatched = matchedPairs.includes(card.id);
                            const isSelected = selectedMatchCard?.id === card.id;
                            let style = "bg-white border-slate-200 text-slate-700 hover:border-indigo-300";
                            if (isMatched) style = "bg-emerald-50 border-emerald-500 text-emerald-700 opacity-50";
                            else if (isSelected) style = "bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500";

                            return (
                                <button key={card.id} onClick={() => handleMatchingCardClick(card)} disabled={isMatched || isAnswered}
                                    className={`p-3 rounded-xl border-2 font-medium text-sm transition-all shadow-sm min-h-[70px] flex items-center justify-center text-center ${style}`}>
                                    {card.text}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )
            })()}
            
             {/* Explanation Area */}
            {isAnswered && currentQuestion && !showCheer && (
                <div className="mt-4 animate-slide-up pb-2">
                    <div className={`p-4 rounded-xl text-sm border ${mistakes.includes(currentQuestion.id) ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                        <span className="font-bold block mb-1 text-xs uppercase">
                            {mistakes.includes(currentQuestion.id) ? "Incorrect" : "Correct"}
                        </span>
                        <span className="text-slate-600 leading-relaxed block">{currentQuestion.explanation}</span>
                    </div>
                </div>
            )}
      </div>
      
      {/* Footer with Next Button (Sticky) */}
      {isAnswered && (
        <div className="p-4 bg-white border-t border-slate-100 shrink-0 z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
            <button onClick={handleNext} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            {currentIndex === activeQuestions.length - 1 ? "Finish Quiz" : "Next Question →"}
            </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
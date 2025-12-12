import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import InputSection from './components/InputSection';
import ThemeSelector from './components/ThemeSelector';
import RoleSelector from './components/RoleSelector';
import LearnView from './components/LearnView';
import RoleplayView from './components/RoleplayView'; 
import LoadingScreen from './components/LoadingScreen';
import HistoryView from './components/HistoryView';
import MagicRecapCard from './components/MagicRecapCard';
import WordChainGame from './components/WordChainGame';
import ConfirmModal from './components/ConfirmModal'; // Added Import

import { 
  generateThemes, 
  generateVocabulary,
  generateQuizzes,
  fileToBase64, 
  generateRoleplayReply,
  analyzeGrammar
} from './services/geminiService';

import { saveHistoryItem, getHistory, saveChatSession, getSavedChats } from './services/storageService';
import { playSfx } from './utils/audio'; // Added Import

import { 
  SessionState, 
  TargetLanguage, 
  InputData,
  DifficultyLevel,
  HistoryItem,
  VocabularyItem,
  ChatMessage,
  DailyMission,
  RoleConfig,
  SavedChatSession,
  LearnData
} from './types';

const SESSION_KEY = 'contextlingo_session_v12';

const INITIAL_MISSIONS: DailyMission[] = [
    { id: 'm1', label: 'Scholar: Learn 5 new words', target: 5, current: 0, completed: false, type: 'words' },
    { id: 'm2', label: 'Sharp Mind: Finish 1 Quiz', target: 1, current: 0, completed: false, type: 'quiz' },
    { id: 'm3', label: 'Orator: Speak 5 times', target: 5, current: 0, completed: false, type: 'roleplay' }
];

const INITIAL_STATE: SessionState = {
  view: 'landing', 
  inputData: null,
  contextDescription: null,
  themes: [],
  selectedTheme: null,
  selectedRoles: null,
  learnContent: null,
  chatHistory: [],
  seenWords: [],
  themeProgress: 0,
  xp: 0,
  streak: 0,
  lastVisitDate: null,
  completedThemes: [],
  dailyMissions: INITIAL_MISSIONS,
  savedVocabulary: []
};

const App: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [session, setSession] = useState<SessionState>(INITIAL_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingType, setLoadingType] = useState<'scanning' | 'brewing' | 'roleplay'>('scanning');
  const [error, setError] = useState<string | null>(null);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChatSession[]>([]); 
  
  const [showRecap, setShowRecap] = useState(false);
  
  // Transient state for history navigation
  const [historyTab, setHistoryTab] = useState<'sessions' | 'saved' | 'chats'>('sessions');

  // NEW: State for Header Navigation Confirmation
  const [showHeaderNavConfirm, setShowHeaderNavConfirm] = useState(false);

  useEffect(() => {
    const initializeSession = () => {
        try {
            const loadedHistory = getHistory();
            setHistoryItems(Array.isArray(loadedHistory) ? loadedHistory : []);
            
            const loadedChats = getSavedChats();
            setSavedChats(Array.isArray(loadedChats) ? loadedChats : []);
            
            const saved = localStorage.getItem(SESSION_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                let safeView = parsed.view;
                // Safety check for view state vs data availability
                if ((safeView === 'learn_mode' || safeView === 'theme_selection' || safeView === 'roleplay_mode') && (!parsed.inputData)) {
                    safeView = 'dashboard';
                }

                const today = new Date().toDateString();
                const lastVisit = parsed.lastVisitDate;
                let newStreak = parsed.streak || 0;
                
                // Sanitize Daily Missions
                let currentMissions = Array.isArray(parsed.dailyMissions) ? parsed.dailyMissions : INITIAL_MISSIONS;
                // Fix potential corrupted missions
                currentMissions = currentMissions.map((m: any, i: number) => {
                    if (!m || typeof m !== 'object' || !m.id) return INITIAL_MISSIONS[i];
                    return m;
                });

                if (lastVisit !== today) {
                    currentMissions = INITIAL_MISSIONS;
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    if (lastVisit === yesterday.toDateString()) {
                        newStreak += 1;
                    } else if (newStreak > 0) {
                        newStreak = 1; // Streak reset logic, keep at 1 if they missed a day but returned
                    } else {
                        newStreak = 1;
                    }
                }
                
                setSession({
                    ...INITIAL_STATE, // Start with defaults to ensure all keys exist
                    ...parsed, // Override with saved data
                    view: safeView === 'landing' && parsed.xp > 0 ? 'dashboard' : safeView,
                    streak: newStreak,
                    lastVisitDate: today,
                    dailyMissions: currentMissions,
                    completedThemes: Array.isArray(parsed.completedThemes) ? parsed.completedThemes : [],
                    savedVocabulary: Array.isArray(parsed.savedVocabulary) ? parsed.savedVocabulary : []
                });
            } else {
                setSession(prev => ({ ...prev, lastVisitDate: new Date().toDateString() }));
            }
        } catch (e) {
            console.error("Failed to load session", e);
            // In case of critical failure, fallback to initial state (clears potentially bad localstorage)
            setSession(INITIAL_STATE);
        } finally {
            setTimeout(() => setIsInitializing(false), 500);
        }
    };
    initializeSession();
  }, []);

  useEffect(() => {
    if (isInitializing) return;
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
  }, [session, isInitializing]);

  const updateMission = (type: 'words' | 'quiz' | 'roleplay', amount: number = 1) => {
    setSession(prev => {
        const newMissions = prev.dailyMissions.map(m => {
            if (m.type === type && !m.completed) {
                const newCurrent = Math.min(m.target, m.current + amount);
                return { ...m, current: newCurrent, completed: newCurrent >= m.target };
            }
            return m;
        });
        let xpBonus = 0;
        const justCompleted = newMissions.filter((m, i) => m.completed && !prev.dailyMissions[i].completed);
        if (justCompleted.length > 0) xpBonus = 50 * justCompleted.length;
        return { ...prev, dailyMissions: newMissions, xp: prev.xp + xpBonus };
    });
  };

  const handleAddXp = (amount: number) => setSession(prev => ({ ...prev, xp: prev.xp + amount }));

  // --- Header Navigation Logic ---
  const handleHeaderLogoClick = () => {
      // Views where we want to warn the user before leaving
      const protectedViews = ['theme_selection', 'role_selection', 'learn_mode', 'roleplay_mode', 'minigame'];
      
      if (protectedViews.includes(session.view)) {
          playSfx('click');
          setShowHeaderNavConfirm(true);
      } else {
          setSession(prev => ({...prev, view: 'dashboard'}));
      }
  };

  const confirmReturnToDashboard = () => {
      setShowHeaderNavConfirm(false);
      setSession(prev => ({...prev, view: 'dashboard'}));
  };

  // --- Core Flow ---

  const handleStart = async (text: string, file: File | null, language: TargetLanguage, difficulty: DifficultyLevel) => {
    setLoading(true);
    setLoadingType('scanning');
    setError(null);
    try {
      let base64 = null;
      if (file) base64 = await fileToBase64(file);
      const { themes, contextDescription } = await generateThemes(text, base64, language, difficulty);
      setSession(prev => ({
        ...prev,
        inputData: { text, file: null, fileBase64: base64, language, difficulty }, 
        contextDescription,
        themes,
        view: 'theme_selection',
        selectedTheme: null,
        selectedRoles: null,
        learnContent: null,
        seenWords: [],
        themeProgress: 0
      }));
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleRegenerateThemes = async () => {
    if (!session.inputData) return;
    setLoading(true);
    try {
        const { themes, contextDescription } = await generateThemes(
            session.inputData.text, 
            session.inputData.fileBase64, 
            session.inputData.language, 
            session.inputData.difficulty
        );
        setSession(prev => ({ ...prev, themes, contextDescription }));
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  const handleSelectTheme = async (themeTitle: string) => {
     if (!session.inputData || !session.contextDescription) return;
     
     setLoading(true);
     setLoadingType('brewing');
     setSession(prev => ({ ...prev, selectedTheme: themeTitle }));

     try {
         const vocabulary = await generateVocabulary(
             session.contextDescription,
             themeTitle,
             session.inputData.language,
             session.inputData.difficulty
         );
         
         const newSeenWords = vocabulary.map(v => v.word);
         const tempRoles: RoleConfig = { user_role: "User", ai_role: "AI" }; 

         setSession(prev => ({
            ...prev,
            selectedTheme: themeTitle,
            learnContent: { vocabulary, roles: tempRoles, quizzes: [] }, 
            seenWords: newSeenWords,
            themeProgress: 0, 
            view: 'learn_mode'
         }));
         setLoading(false);
         updateMission('words', vocabulary.length);

         setBackgroundLoading(true);
         const quizzes = await generateQuizzes(
            session.contextDescription,
            themeTitle,
            session.inputData.language,
            session.inputData.difficulty,
            vocabulary
         );
         setSession(prev => {
            if (!prev.learnContent) return prev;
            return { ...prev, learnContent: { ...prev.learnContent, quizzes } };
         });

     } catch (e: any) {
        setError(e.message);
        setLoading(false);
     } finally {
        setBackgroundLoading(false);
     }
  };

  const handleRolesSelected = (roles: RoleConfig) => {
     setSession(prev => ({ ...prev, selectedRoles: roles }));
  };

  const handleLoadMore = async () => {
    if (!session.inputData || !session.selectedTheme || !session.learnContent || !session.contextDescription) return;
    try {
      setBackgroundLoading(true); 
      const newVocab = await generateVocabulary(
        session.contextDescription,
        session.selectedTheme,
        session.inputData.language,
        session.inputData.difficulty,
        session.seenWords
      );
      const newlySeen = newVocab.map(v => v.word);
      const newQuizzes = await generateQuizzes(
        session.contextDescription,
        session.selectedTheme,
        session.inputData.language,
        session.inputData.difficulty,
        newVocab
      );
      setSession(prev => {
         if (!prev.learnContent) return prev;
         return {
           ...prev,
           seenWords: [...prev.seenWords, ...newlySeen],
           learnContent: { ...prev.learnContent, vocabulary: newVocab, quizzes: newQuizzes }
         };
      });
      updateMission('words', newVocab.length);
    } catch (e) { console.error("Failed to load more", e); } finally { setBackgroundLoading(false); }
  };

  const handleQuizAnswer = () => setSession(prev => ({ ...prev, themeProgress: Math.min(100, prev.themeProgress + 10) }));
  const handleQuizBatchComplete = () => updateMission('quiz', 1);

  const handleSendMessage = async (text: string) => {
    if (!session.learnContent || !session.inputData || !session.selectedTheme || !session.contextDescription || !session.selectedRoles) return;
    updateMission('roleplay', 1);
    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = { id: userMsgId, role: 'user', text, isGrammarPending: true };
    setSession(prev => ({ ...prev, chatHistory: [...prev.chatHistory, userMsg] }));
    const currentHistoryForAI = [...session.chatHistory, userMsg];

    // AI Reply
    generateRoleplayReply(
        currentHistoryForAI,
        session.contextDescription,
        session.selectedRoles.user_role,
        session.selectedRoles.ai_role,
        session.selectedTheme,
        session.inputData.language,
        session.inputData.difficulty
    ).then(aiText => {
        const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'ai', text: aiText };
        setSession(prev => ({ ...prev, chatHistory: [...prev.chatHistory, aiMsg] }));
    });

    // Grammar Analysis
    analyzeGrammar(
        text, 
        session.inputData.language, 
        session.inputData.difficulty,
        session.contextDescription,
        session.selectedRoles.user_role,
        session.selectedRoles.ai_role
    ).then(analysis => {
        setSession(prev => {
            const updatedHistory = prev.chatHistory.map(msg => {
                if (msg.id === userMsgId) return { ...msg, grammarAnalysis: analysis, isGrammarPending: false };
                return msg;
            });
            return { ...prev, chatHistory: updatedHistory };
        });
    }).catch(() => {
        setSession(prev => {
             const updatedHistory = prev.chatHistory.map(msg => {
                if (msg.id === userMsgId) return { ...msg, isGrammarPending: false };
                return msg;
            });
            return { ...prev, chatHistory: updatedHistory };
        });
    });
  };
  
  const handleResetRoles = () => {
     setSession(prev => ({ ...prev, selectedRoles: null, chatHistory: [] }));
  };

  const handleSaveChatSession = () => {
    if (session.selectedTheme && session.inputData && session.selectedRoles && session.contextDescription && session.chatHistory.length > 0) {
        saveChatSession(
            session.selectedTheme,
            session.inputData.language,
            session.selectedRoles.user_role,
            session.selectedRoles.ai_role,
            session.chatHistory,
            session.contextDescription
        );
        setSavedChats(getSavedChats());
    }
  };

  const handleSaveHistoryItem = () => {
    if (session.learnContent && session.selectedTheme && session.inputData && session.contextDescription) {
        saveHistoryItem(
            session.learnContent,
            session.selectedTheme,
            session.inputData.language,
            session.inputData.difficulty,
            session.contextDescription,
            session.inputData.fileBase64
        );
        setHistoryItems(getHistory());
    }
  };

  const handleCompleteTheme = () => { handleSaveHistoryItem(); setShowRecap(true); };
  
  const handleFinalizeTheme = () => {
    setShowRecap(false);
    let updatedCompletedThemes = session.completedThemes;
    if (session.selectedTheme && !session.completedThemes.includes(session.selectedTheme)) {
        updatedCompletedThemes = [...session.completedThemes, session.selectedTheme!];
    }
    setSession(prev => ({
        ...prev,
        completedThemes: updatedCompletedThemes,
        xp: prev.xp + 200, 
        view: 'theme_selection', 
        learnContent: null,
        chatHistory: [],
        selectedTheme: null,
        selectedRoles: null,
    }));
  };

  const handleFinishContext = () => {
     setSession(prev => ({
         ...prev,
         view: 'dashboard',
         inputData: null,
         contextDescription: null,
         themes: [],
         selectedTheme: null,
         learnContent: null,
         chatHistory: [],
         completedThemes: []
     }));
  };

  const handleToggleSavedWord = (item: VocabularyItem) => {
    setSession(prev => {
        const exists = prev.savedVocabulary.some(w => w.word === item.word);
        let newSaved;
        if (exists) newSaved = prev.savedVocabulary.filter(w => w.word !== item.word);
        else newSaved = [...prev.savedVocabulary, item];
        return { ...prev, savedVocabulary: newSaved };
    });
  };

  const handleResumeChat = (chat: SavedChatSession) => {
      const dummyRoles = { user_role: chat.userRole, ai_role: chat.aiRole };
      const dummyLearnData: LearnData = { 
          vocabulary: [], 
          quizzes: [], 
          roles: dummyRoles 
      };
      const mockInput: InputData = {
          text: chat.contextDescription,
          file: null,
          language: chat.language,
          difficulty: 'Intermediate' 
      };
      setSession(prev => ({
        ...prev,
        view: 'roleplay_mode',
        inputData: mockInput,
        contextDescription: chat.contextDescription,
        themes: [{ title: chat.theme, tagline: "Saved Session", available_roles: [chat.userRole, chat.aiRole, "A", "B"] }],
        selectedTheme: chat.theme,
        selectedRoles: dummyRoles,
        learnContent: dummyLearnData,
        chatHistory: chat.messages
      }));
  };

  const handleResumeHistoryItem = (item: HistoryItem) => {
      setSession(prev => ({
        ...prev,
        view: 'learn_mode',
        selectedTheme: item.theme,
        contextDescription: item.contextDescription,
        learnContent: item.learnData,
        chatHistory: item.chatHistory || [], 
        seenWords: item.learnData.vocabulary.map(v => v.word),
        themeProgress: 0, 
        inputData: { 
            text: item.contextDescription, 
            file: null, 
            fileBase64: item.thumbnailBase64, 
            language: item.language, 
            difficulty: item.difficulty 
        },
        themes: [],
        selectedRoles: item.learnData.roles
    }));
  };

  if (isInitializing) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div></div>;
  if (session.view === 'landing') return <LandingPage onGetStarted={() => setSession(prev => ({...prev, view: 'dashboard'}))} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Global Confirmation for Header Navigation */}
      <ConfirmModal 
        isOpen={showHeaderNavConfirm}
        title="Go to Dashboard?"
        message="Your current session progress will be lost if you leave now."
        confirmLabel="Go Dashboard"
        onConfirm={confirmReturnToDashboard}
        onCancel={() => setShowHeaderNavConfirm(false)}
        variant="danger"
      />

      {session.view !== 'roleplay_mode' && session.view !== 'minigame' && (
        <Header 
            xp={session.xp} 
            streak={session.streak} 
            onDashboard={handleHeaderLogoClick} // UPDATED: Use the new handler
            isDashboard={session.view === 'dashboard'}
        />
      )}
      
      {showRecap && session.learnContent && (
        <MagicRecapCard 
            theme={session.selectedTheme || "Session Complete"}
            xpEarned={session.completedThemes.includes(session.selectedTheme || '') ? 0 : 200} 
            totalWords={session.learnContent.vocabulary.length}
            starWord={session.learnContent.vocabulary[Math.floor(Math.random() * session.learnContent.vocabulary.length)]}
            streak={session.streak}
            onClose={handleFinalizeTheme}
        />
      )}

      <main className={`flex-grow w-full ${session.view === 'roleplay_mode' || session.view === 'minigame' ? '' : 'p-4 md:p-6'}`}>
        {loading ? (
            <LoadingScreen type={loadingType} />
        ) : (
            <>
                {session.view === 'dashboard' && (
                    <Dashboard 
                        xp={session.xp}
                        streak={session.streak}
                        missions={session.dailyMissions}
                        recentHistory={historyItems}
                        savedWordsCount={session.savedVocabulary.length}
                        onStartNew={() => setSession(prev => ({...prev, view: 'upload'}))}
                        onResume={handleResumeHistoryItem} 
                        onViewHistory={() => {
                            setHistoryTab('sessions');
                            setSession(prev => ({...prev, view: 'history'}));
                        }} 
                        onViewSavedWords={() => {
                            setHistoryTab('saved');
                            setSession(prev => ({...prev, view: 'history'}));
                        }}
                        onStartMinigame={() => setSession(prev => ({...prev, view: 'minigame'}))}
                        totalThemesCompleted={session.completedThemes.length}
                    />
                )}
                
                {session.view === 'minigame' && (
                    <WordChainGame 
                        onBack={() => setSession(prev => ({...prev, view: 'dashboard'}))} 
                        onAddXp={handleAddXp}
                    />
                )}

                {session.view === 'upload' && (
                    <div className="animate-fade-in py-10">
                        <InputSection onNext={handleStart} isLoading={false} />
                        <button onClick={() => setSession(prev => ({...prev, view: 'dashboard'}))} className="block mx-auto mt-6 text-slate-400 hover:text-slate-600">Cancel</button>
                    </div>
                )}
                
                {session.view === 'theme_selection' && (
                    <ThemeSelector
                        themes={session.themes} 
                        completedThemes={session.completedThemes}
                        onSelect={handleSelectTheme} 
                        isLoading={false}
                        onBack={() => setSession(prev => ({...prev, view: 'upload'}))}
                        onRegenerate={handleRegenerateThemes}
                        onFinish={handleFinishContext} 
                    />
                )}

                {session.view === 'learn_mode' && session.learnContent && session.inputData && (
                    <LearnView 
                        content={session.learnContent}
                        theme={session.selectedTheme || ""}
                        language={session.inputData.language}
                        progress={session.themeProgress}
                        onLoadMore={handleLoadMore}
                        onGoToRoleplay={() => setSession(prev => ({...prev, view: 'roleplay_mode'}))}
                        isBackgroundLoading={backgroundLoading}
                        onAddXp={handleAddXp}
                        onQuestionAnswered={handleQuizAnswer}
                        onQuizBatchComplete={handleQuizBatchComplete}
                        onBack={() => setSession(prev => ({
                            ...prev, 
                            view: session.themes.length > 0 ? 'theme_selection' : 'history'
                        }))}
                        onCompleteTheme={handleCompleteTheme}
                        onSave={handleSaveHistoryItem}
                        
                        savedWords={session.savedVocabulary}
                        onToggleSavedWord={handleToggleSavedWord}
                    />
                )}

                {session.view === 'roleplay_mode' && session.selectedTheme && session.themes.length > 0 && (
                     !session.selectedRoles ? (
                        <div className="p-4">
                            <RoleSelector 
                                theme={session.themes.find(t => t.title === session.selectedTheme)!}
                                onConfirm={handleRolesSelected}
                                onBack={() => setSession(prev => ({...prev, view: 'learn_mode'}))}
                            />
                        </div>
                     ) : (
                        <RoleplayView 
                             theme={session.selectedTheme}
                             history={session.chatHistory}
                             userRole={session.selectedRoles.user_role}
                             aiRole={session.selectedRoles.ai_role}
                             onSendMessage={handleSendMessage}
                             isSending={session.chatHistory.length > 0 && session.chatHistory[session.chatHistory.length-1].role === 'user'}
                             onExit={() => {
                                if (!session.learnContent || session.learnContent.vocabulary.length === 0) {
                                    setSession(prev => ({...prev, view: 'history'}));
                                } else {
                                    setSession(prev => ({...prev, view: 'learn_mode'}));
                                }
                             }}
                             onChangeRoles={handleResetRoles}
                             onSaveSession={handleSaveChatSession} 
                        />
                     )
                )}
                
                {session.view === 'history' && (
                    <HistoryView 
                        items={historyItems}
                        savedChats={savedChats}
                        savedWords={session.savedVocabulary}
                        onSelect={handleResumeHistoryItem}
                        onSelectChat={handleResumeChat}
                        onBack={() => setSession(prev => ({...prev, view: 'dashboard'}))}
                        onToggleSavedWord={handleToggleSavedWord}
                        initialTab={historyTab}
                    />
                )}
            </>
        )}
        {error && <div className="max-w-md mx-auto mt-8 p-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-center">{error}</div>}
      </main>
    </div>
  );
};

export default App;
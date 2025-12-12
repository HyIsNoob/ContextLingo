
export type TargetLanguage = 'English' | 'Spanish' | 'French' | 'Japanese' | 'Korean';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

declare global {
  interface Window {
    html2canvas: any;
  }
}

export interface VocabularyItem {
  word: string;
  pronunciation?: string;
  meaning: string;
  example: string;
  example_translation?: string;
}

// Updated Quiz Types
export type QuizType = 'multiple-choice' | 'scramble' | 'matching';

export interface QuizQuestionBase {
  id: number;
  type: QuizType;
  explanation: string;
}

export interface MultipleChoiceQuestion extends QuizQuestionBase {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correct_answer: string;
}

export interface ScrambleQuestion extends QuizQuestionBase {
  type: 'scramble';
  question: string; // "Translate this sentence"
  english_sentence: string;
  target_sentence_words: string[]; // Correct order
  scrambled_words: string[]; // Mixed order
}

export interface MatchingQuestion extends QuizQuestionBase {
  type: 'matching';
  question: string; // "Match the pairs"
  pairs: { term: string; definition: string }[];
}

export type MiniQuizQuestion = MultipleChoiceQuestion | ScrambleQuestion | MatchingQuestion;

export interface RoleConfig {
  user_role: string;
  ai_role: string;
}

export interface ThemeSuggestion {
  title: string;
  tagline: string;
  available_roles: string[]; // Pool of 4-6 roles
}

export interface LearnData {
  vocabulary: VocabularyItem[];
  quizzes: MiniQuizQuestion[];
  roles: RoleConfig; 
}

export interface GrammarAnalysis {
  hasError: boolean;
  userOriginal: string;
  correctedText: string;
  explanation: string; // Grammar explanation
  
  // NEW: Contextual Improvement
  betterResponse: string; // A more natural/idiomatic way to say it
  betterResponseExplanation: string; // Why is this better?
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  grammarAnalysis?: GrammarAnalysis;
  isGrammarPending?: boolean;
}

export interface InputData {
  text: string;
  file: File | null;
  fileBase64?: string | null;
  language: TargetLanguage;
  difficulty: DifficultyLevel;
}

// Updated View Routing including Role Selection and Minigame
export type ViewMode = 'landing' | 'dashboard' | 'upload' | 'theme_selection' | 'role_selection' | 'learn_mode' | 'roleplay_mode' | 'history' | 'minigame';

export interface DailyMission {
  id: string;
  label: string;
  target: number;
  current: number;
  completed: boolean;
  type: 'words' | 'quiz' | 'roleplay';
}

// Persistable Session State
export interface SessionState {
  view: ViewMode;
  inputData: InputData | null;
  contextDescription: string | null;
  themes: ThemeSuggestion[];
  selectedTheme: string | null;
  selectedRoles: RoleConfig | null; // Selected from the pool
  learnContent: LearnData | null;
  chatHistory: ChatMessage[];
  seenWords: string[];
  themeProgress: number;
  
  // Gamification & Progress
  xp: number;
  streak: number;
  lastVisitDate: string | null;
  completedThemes: string[];
  dailyMissions: DailyMission[];
  
  // Saved Data
  savedVocabulary: VocabularyItem[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  theme: string;
  language: TargetLanguage;
  difficulty: DifficultyLevel;
  contextDescription: string;
  thumbnailBase64?: string | null;
  learnData: LearnData;
  chatHistory?: ChatMessage[]; 
}

// New: Dedicated Saved Chat Session
export interface SavedChatSession {
  id: string;
  timestamp: number;
  theme: string;
  language: TargetLanguage;
  userRole: string;
  aiRole: string;
  messages: ChatMessage[];
  contextDescription: string; // For AI context
}

export interface WordChainTurn {
    word: string;
    player: 'user' | 'ai';
    definition?: string;
}

import { LearnData, HistoryItem, TargetLanguage, DifficultyLevel, ChatMessage, SavedChatSession } from "../types";

const HISTORY_KEY = 'contextlingo_history_v1';
const CHATS_KEY = 'contextlingo_chats_v1';

export const getHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Critical fix: Ensure we strictly return an array. 
    // Old corrupted data might be an object or null.
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load history", error);
    return [];
  }
};

export const getSavedChats = (): SavedChatSession[] => {
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load saved chats", error);
    return [];
  }
};

export const saveChatSession = (
  theme: string,
  language: TargetLanguage,
  userRole: string,
  aiRole: string,
  messages: ChatMessage[],
  contextDescription: string
) => {
  try {
    const currentChats = getSavedChats();
    
    // Check if this specific chat (theme + roles) already exists to update it
    const existingIndex = currentChats.findIndex(c => 
        c.theme === theme && 
        c.language === language &&
        c.userRole === userRole &&
        c.aiRole === aiRole
    );
    
    let newChats = [...currentChats];
    
    if (existingIndex !== -1) {
       // Update existing
       newChats[existingIndex] = {
           ...newChats[existingIndex],
           messages: messages,
           timestamp: Date.now(),
       };
       // Move to top
       const updated = newChats[existingIndex];
       newChats.splice(existingIndex, 1);
       newChats.unshift(updated);
    } else {
       // Create new
       const newChat: SavedChatSession = {
           id: Date.now().toString(),
           timestamp: Date.now(),
           theme,
           language,
           userRole,
           aiRole,
           messages,
           contextDescription
       };
       newChats.unshift(newChat);
    }

    localStorage.setItem(CHATS_KEY, JSON.stringify(newChats));
  } catch (e) {
    console.error("Failed to save chat", e);
  }
};

export const saveHistoryItem = (
  learnData: LearnData, 
  theme: string, 
  language: TargetLanguage,
  difficulty: DifficultyLevel,
  contextDescription: string,
  thumbnailBase64?: string | null,
  chatHistory?: ChatMessage[]
) => {
  try {
    const currentHistory = getHistory();
    
    // SMART UPDATE: 
    if (currentHistory.length > 0 && 
        currentHistory[0].theme === theme && 
        currentHistory[0].language === language) {
        
        const updatedItem: HistoryItem = { 
            ...currentHistory[0], 
            learnData, 
            chatHistory: chatHistory || currentHistory[0].chatHistory || [],
            timestamp: Date.now() 
        };
        
        if (thumbnailBase64) updatedItem.thumbnailBase64 = thumbnailBase64;

        const newHistory = [updatedItem, ...currentHistory.slice(1)];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        return;
    }

    // Otherwise, create NEW item
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      theme,
      language,
      difficulty,
      contextDescription,
      learnData,
      thumbnailBase64,
      chatHistory: chatHistory || []
    };

    const updatedHistory = [newItem, ...currentHistory];

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (e: any) {
      // Handle QuotaExceededError
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn("Storage quota exceeded. Trying to save without thumbnail.");
        const itemWithoutImage = { ...newItem, thumbnailBase64: null };
        const historyWithoutImage = [itemWithoutImage, ...currentHistory];
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(historyWithoutImage));
        } catch (retryError) {
          console.error("Critical: Could not save history item even without image.", retryError);
        }
      }
    }
  } catch (error) {
    console.error("General error saving history", error);
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(CHATS_KEY);
};
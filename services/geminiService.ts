import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ThemeSuggestion, TargetLanguage, VocabularyItem, DifficultyLevel, MiniQuizQuestion, GrammarAnalysis, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Helper: File to Base64 ---
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// --- Step 1: Detect Context & Themes + Role Pool ---
const themeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    context_description: { type: Type.STRING },
    suggested_themes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tagline: { type: Type.STRING },
          available_roles: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "tagline", "available_roles"]
      }
    }
  },
  required: ["context_description", "suggested_themes"]
};

export const generateThemes = async (
  textInput: string,
  base64Image: string | null | undefined,
  language: TargetLanguage,
  difficulty: DifficultyLevel
): Promise<{ themes: ThemeSuggestion[], contextDescription: string }> => {
  try {
    const parts: any[] = [];
    // TOKEN OPTIMIZATION: Shortened prompt instructions
    const prompt = `
      Analyze input.
      1. Describe visual/situational context (English).
      2. Suggest 3 learning themes for ${language} (Level: ${difficulty}).
      3. For each theme, list 4 distinct character roles.
      
      Output strictly JSON. Theme titles/roles must be English.
    `;
    parts.push({ text: prompt });
    if (textInput) parts.push({ text: `Ctx: ${textInput}` });
    if (base64Image) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64Image } });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { role: "user", parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: themeSchema,
      },
    });

    if (!response.text) throw new Error("No response");
    const parsed = JSON.parse(response.text);
    return {
      themes: parsed.suggested_themes,
      contextDescription: parsed.context_description
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to scan themes.");
  }
};

// --- Step 2a: Generate Vocabulary ---
const vocabSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    vocabulary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          pronunciation: { type: Type.STRING },
          meaning: { type: Type.STRING },
          example: { type: Type.STRING },
          example_translation: { type: Type.STRING },
        },
        required: ["word", "meaning", "example", "example_translation"],
      },
    }
  },
  required: ["vocabulary"],
};

export const generateVocabulary = async (
  contextDescription: string,
  theme: string,
  language: TargetLanguage,
  difficulty: DifficultyLevel,
  existingWords: string[] = []
): Promise<VocabularyItem[]> => {
  try {
    // TOKEN OPTIMIZATION: Limit excluded words to last 50 to save tokens
    const recentWords = existingWords.slice(-50).join(', ');
    
    const prompt = `
      Act as ${language} tutor.
      Ctx: "${contextDescription}". Theme: "${theme}". Lvl: ${difficulty}.
      Task: List 8 vocab words relevant to context.
      ${recentWords ? `Exclude: ${recentWords}.` : ''}
      Output JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { role: "user", parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: vocabSchema,
      },
    });

    if (!response.text) throw new Error("No response");
    return JSON.parse(response.text).vocabulary;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate vocabulary.");
  }
};

// --- Step 2b: Generate Simplified Quizzes ---
const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    quizzes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          type: { type: Type.STRING, enum: ['multiple-choice'] },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correct_answer: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["id", "type", "question", "options", "correct_answer", "explanation"],
      },
    },
  },
  required: ["quizzes"],
};

export const generateQuizzes = async (
  contextDescription: string,
  theme: string,
  language: TargetLanguage,
  difficulty: DifficultyLevel,
  vocabularyContext: VocabularyItem[]
): Promise<MiniQuizQuestion[]> => {
  const timeoutPromise = new Promise<MiniQuizQuestion[]>((resolve) => 
    setTimeout(() => {
        console.warn("Quiz gen timed out.");
        resolve([]);
    }, 25000)
  );

  const genPromise = async (): Promise<MiniQuizQuestion[]> => {
    try {
        // TOKEN OPTIMIZATION: Only send words, not full definitions. AI knows the meanings.
        const wordList = vocabularyContext.map(v => v.word).join(", ");
        
        const prompt = `
          Create 5 Multiple Choice Questions for ${language} learners.
          Ctx: "${contextDescription}". Theme: "${theme}".
          Target Words: [${wordList}].
          Test meaning/usage. 4 options each.
          Output JSON.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: { role: "user", parts: [{ text: prompt }] },
          config: {
            responseMimeType: "application/json",
            responseSchema: quizSchema,
          },
        });

        if (!response.text) return [];
        const parsed = JSON.parse(response.text);
        return parsed.quizzes;
    } catch (error) {
        console.error("Quiz gen error:", error);
        return []; 
    }
  };

  return Promise.race([genPromise(), timeoutPromise]);
};

// --- Step 3: Roleplay Chat ---
export const generateRoleplayReply = async (
  history: ChatMessage[],
  contextDescription: string,
  userRole: string,
  aiRole: string,
  theme: string,
  language: TargetLanguage,
  difficulty: DifficultyLevel
): Promise<string> => {
  try {
    // TOKEN OPTIMIZATION: Slice history to last 10 turns to prevent context bloat
    const recentHistory = history.slice(-10);

    const systemPrompt = `
      Ctx: "${contextDescription}". Theme: ${theme}.
      Role: You are ${aiRole}. User is ${userRole}.
      Lang: ${language}. Lvl: ${difficulty}.
      Reply naturally (1-2 sentences). Stay in character.
    `;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...recentHistory.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }))
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents as any,
    });

    if (!response.text) throw new Error("No response");
    return response.text;
  } catch (error) {
    console.error(error);
    return "...";
  }
};

// --- Step 4: Grammar & Context Analysis ---
const grammarAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    has_error: { type: Type.BOOLEAN },
    user_original: { type: Type.STRING },
    corrected_text: { type: Type.STRING },
    explanation: { type: Type.STRING },
    better_response: { type: Type.STRING },
    better_response_explanation: { type: Type.STRING }
  },
  required: ["has_error", "corrected_text", "explanation", "better_response", "better_response_explanation"]
};

export const analyzeGrammar = async (
  userText: string,
  language: TargetLanguage,
  difficulty: DifficultyLevel,
  contextDescription: string,
  userRole: string,
  aiRole: string
): Promise<GrammarAnalysis> => {
  try {
    // TOKEN OPTIMIZATION: Simplified instructions
    const prompt = `
      Lang Coach (${language}).
      Ctx: "${contextDescription}". User: ${userRole}. AI: ${aiRole}. Lvl: ${difficulty}.
      Input: "${userText}"
      
      1. Check grammar/vocab errors.
      2. Provide a more natural/native phrasing for this specific roleplay context.
      
      Output JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { role: 'user', parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: grammarAnalysisSchema,
      },
    });

    if (!response.text) throw new Error("No response");
    const parsed = JSON.parse(response.text);

    return {
        hasError: parsed.has_error,
        userOriginal: parsed.user_original || userText,
        correctedText: parsed.corrected_text,
        explanation: parsed.explanation,
        betterResponse: parsed.better_response || parsed.corrected_text,
        betterResponseExplanation: parsed.better_response_explanation || "More natural phrasing."
    };
  } catch (error) {
    return { 
        hasError: false, 
        userOriginal: userText, 
        correctedText: userText, 
        explanation: "",
        betterResponse: userText,
        betterResponseExplanation: ""
    };
  }
};

// --- Minigame: Word Chain ---
const wordChainSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isValid: { type: Type.BOOLEAN },
    invalidReason: { type: Type.STRING },
    aiWord: { type: Type.STRING },
    aiDefinition: { type: Type.STRING }
  },
  required: ["isValid"]
};

export const generateWordChainTurn = async (
  userWord: string,
  historyWords: string[]
): Promise<{ isValid: boolean, invalidReason?: string, aiWord?: string, aiDefinition?: string }> => {
  try {
    // Only send last 15 words to keep tokens low
    const recentHistory = historyWords.slice(-15);
    const lastWord = recentHistory.length > 1 ? recentHistory[recentHistory.length - 2] : null; // User's input is already in history passed by component? No, component passes history *before* user word usually, but let's check usage.
    // Actually, usually we validate user word against the *previous* word in history.
    
    const prompt = `
      Play Word Chain (Shiritori) in English.
      Rules: Next word must start with last letter of previous word. No duplicates. Real words only.
      
      Game History: [${recentHistory.join(', ')}]
      User Input: "${userWord}"
      
      Task:
      1. Validate User Input (starts with correct letter? is real word? not duplicate?).
      2. If Invalid, set isValid=false and explain why.
      3. If Valid, generate a single word response starting with the last letter of User Input.
      4. Provide brief definition for your word.
      
      Output JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { role: "user", parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: wordChainSchema,
      },
    });

    if (!response.text) throw new Error("No response");
    return JSON.parse(response.text);
  } catch (error) {
    console.error(error);
    return { isValid: false, invalidReason: "AI Connection failed." };
  }
};
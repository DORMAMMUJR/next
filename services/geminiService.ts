
import { GoogleGenAI } from "@google/genai";

/**
 * Generates a text response from Gemini AI.
 * @param prompt The user's input string.
 * @returns The text response from the AI model.
 */
export const getAIResponse = async (prompt: string) => {
  // Always create a new GoogleGenAI instance right before making an API call 
  // to ensure it uses the most up-to-date API key from the environment/dialog.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Eres un asistente virtual experto para NEXT Bachillerato Ejecutivo. Proporcionas respuestas claras, profesionales y útiles sobre trámites escolares, materias y soporte técnico. Responde siempre en español.",
      },
    });
    // Accessing the .text property directly as it returns the extracted string output.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, ocurrió un error al procesar tu consulta. Por favor intenta de nuevo.";
  }
};


import { GoogleGenAI } from "@google/genai";

/**
 * Genera una respuesta de texto utilizando el modelo Gemini 3 Flash.
 * @param prompt La consulta del usuario.
 */
export const getAIResponse = async (prompt: string) => {
  // Se crea una instancia nueva para asegurar el uso de la API KEY más reciente del entorno.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Eres NEXT AI, el asistente virtual de NEXT Bachillerato Ejecutivo. 
        Tus respuestas deben ser profesionales, empáticas y ejecutivas. 
        Conoces sobre trámites SEP, RVOE, expedientes digitales y planes de estudio ejecutivos de 18 meses. 
        Responde siempre en español de México de forma concisa.`,
        temperature: 0.7,
        topP: 0.8,
      },
    });

    // Se accede a la propiedad .text directamente como especifica la documentación de @google/genai.
    return response.text;
  } catch (error) {
    console.error("Error en Gemini API:", error);
    return "Lo siento, tuve un problema al procesar tu solicitud académica. ¿Podrías intentar de nuevo o contactar a Control Escolar?";
  }
};

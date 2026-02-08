
import { GoogleGenAI } from "@google/genai";
import { RidingPace } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRouteSuggestions = async (prompt: string, pace?: RidingPace) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Agisci come un esperto motociclista italiano che conosce ogni curva d'Italia. 
        Analizza questa richiesta e il profilo utente: ${prompt}.
        Il ritmo preferito è: ${pace || 'non specificato'}.
        
        Rispondi con un itinerario dettagliato includendo:
        1. Nome dell'itinerario e zone attraversate.
        2. Strade specifiche (es. SS45, SP24) famose per le curve.
        3. Punti di sosta consigliati per foto o ristoro.
        4. Un consiglio tecnico sulla guida basato sulla zona.
        
        Usa un tono carico, tecnico ma amichevole. Usa emoji. Formatta il testo in modo leggibile con paragrafi.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ops! Ho perso il segnale GPS nel tunnel. Riprova tra un momento, biker!";
  }
};

export const generateRideDescription = async (title: string, start: string, destination: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Scrivi una descrizione epica e coinvolgente (max 100 parole) per un giro in moto: "${title}". 
        Da ${start} verso ${destination}. 
        Metti enfasi sulla libertà, il sound del motore e le curve. Solo testo in italiano.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Descrizione generata dall'AI non disponibile.";
  }
};

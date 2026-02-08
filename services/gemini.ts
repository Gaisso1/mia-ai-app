
import { GoogleGenAI } from "@google/genai";
import { RidingPace, Ride, User } from "../types";

// Inizializzazione protetta: verifica se la chiave esiste
const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getRouteSuggestions = async (prompt: string, pace?: RidingPace) => {
  if (!ai) {
    return "Ehi Biker! 🚨 La chiave API non è configurata su Vercel. Chiedi al proprietario di aggiungerla nelle 'Environment Variables' come API_KEY.";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Agisci come un esperto motociclista italiano. 
        Analizza questa richiesta: ${prompt}.
        Il ritmo preferito è: ${pace || 'non specificato'}.
        
        Rispondi con un itinerario dettagliato:
        1. Titolo accattivante.
        2. Percorso con nomi di strade (SS, SP).
        3. Punti sosta consigliati.
        4. Un consiglio tecnico sulla guida.
        
        Usa un tono amichevole e biker. Formatta con emoji e paragrafi chiari.`,
    });
    return response.text;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return "Sembra che ci sia un problema di connessione ai server... Riprova tra un istante, le curve non scappano! 🏍️";
  }
};

// Funzione per simulare la "Cloud Community" generando giri realistici se il database locale è vuoto
export const fetchSimulatedCommunityRides = async (region: string): Promise<Partial<Ride>[]> => {
  if (!ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera 3 giri in moto realistici per la regione ${region}. 
      Ritorna un array JSON di oggetti con: title, location, province, description, pace (Sportivo, Allegro o Tranquillo).
      I giri devono sembrare scritti da veri utenti (es. "Miky", "Gino", "Elena").`,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const text = response.text;
    return JSON.parse(text);
  } catch (e) {
    return [];
  }
};

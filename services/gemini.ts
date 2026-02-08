
import { GoogleGenAI, Type } from "@google/genai";
import { RidingPace } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRouteSuggestions = async (location: string, pace: RidingPace) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggerisci un itinerario motociclistico dettagliato partendo da ${location} con un ritmo di guida ${pace}. Includi punti di interesse e strade panoramiche. Rispondi in italiano con un tono entusiasta per motociclisti.`,
      config: {
        temperature: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Non sono riuscito a generare un itinerario al momento. Riprova più tardi.";
  }
};

export const generateRideDescription = async (title: string, start: string, destination: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera una descrizione lunga e coinvolgente per un giro in moto intitolato "${title}". Punto di partenza: ${start}. Destinazione: ${destination}. Enfatizza le curve, il panorama e il piacere di guidare in compagnia.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Descrizione non disponibile.";
  }
};

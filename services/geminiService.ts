
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ScanResult } from "../types";

export async function analyzeLabel(
  base64Image: string,
  userAllergens: string[]
): Promise<ScanResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this food label image. 
    1. Extract all ingredients listed.
    2. Check for the following allergens: ${userAllergens.join(', ')}. 
    3. If the label is not in English, translate the ingredients to English.
    4. Categorize each detected allergen with its specific ingredient match and a brief explanation of why it's a risk.
    5. Determine a safety rating: 
       - 'safe' if no allergens are found.
       - 'warning' if there are "may contain" traces.
       - 'danger' if allergens are clearly listed.
    
    Return the analysis strictly in JSON format.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          detectedAllergens: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                ingredient: { type: Type.STRING },
                matchedAllergens: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING } 
                },
                explanation: { type: Type.STRING }
              },
              required: ["ingredient", "matchedAllergens", "explanation"]
            }
          },
          originalLanguage: { type: Type.STRING },
          translation: { type: Type.STRING },
          safetyRating: { 
            type: Type.STRING,
            enum: ['safe', 'warning', 'danger']
          }
        },
        required: ["ingredients", "detectedAllergens", "originalLanguage", "safetyRating"]
      }
    }
  });

  const resultText = response.text || "{}";
  const parsed = JSON.parse(resultText);

  return {
    ...parsed,
    timestamp: Date.now()
  };
}

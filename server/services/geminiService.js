require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are a profile extraction assistant for an Indian government scheme eligibility matcher.

Extract structured eligibility profile fields from the user's message.

Return ONLY a valid JSON object with these exact fields (omit fields not mentioned, set them to null):
{
  "age": <number or null>,
  "gender": <"Male" | "Female" | "Other" | null>,
  "income": <annual income in rupees as number or null>,
  "occupation": <"Student" | "Farmer" | "Employed" | "Self-employed" | "Unemployed" | "Daily Wage Worker" | null>,
  "category": <"General" | "OBC" | "SC" | "ST" | null>,
  "state": <Indian state full name or null>,
  "hasBPL": <"yes" | "no" | null>,
  "hasLand": <"yes" | "no" | null>,
  "hasHouse": <"yes" | "no" | null>,
  "hasGirlChild": <"yes" | "no" | null>,
  "isPregnant": <"yes" | "no" | null>
}

Conversion rules:
- "2 lakhs" or "2L" → 200000
- "50k" → 50000
- "BPL" or "below poverty line" → hasBPL: "yes"
- If user says "I am a woman/female" → gender: "Female"
- Return ONLY the JSON object. No markdown, no backticks, no explanation.`;

const MODELS = ['gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];

async function extractProfile(userMessage) {
  let lastError;

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `${SYSTEM_PROMPT}\n\nUser message: "${userMessage}"`
      });

      const text = response.text.trim();
      try {
        return JSON.parse(text);
      } catch {
        const cleaned = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (err) {
      console.log(`Model ${model} failed: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError;
}

module.exports = { extractProfile };

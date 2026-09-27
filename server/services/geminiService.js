const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const EXTRACTION_PROMPT = `
You are a profile extraction assistant for an Indian government scheme eligibility matcher.

Extract structured eligibility profile fields from the user's message.

Return ONLY a valid JSON object with these exact fields (omit fields that aren't mentioned):
{
  "age": <number or null>,
  "gender": <"Male" | "Female" | "Other" | null>,
  "income": <annual income in rupees as number or null>,
  "occupation": <"Student" | "Farmer" | "Employed" | "Self-employed" | "Unemployed" | "Daily Wage Worker" | null>,
  "category": <"General" | "OBC" | "SC" | "ST" | null>,
  "state": <Indian state name or null>,
  "hasBPL": <"yes" | "no" | null>,
  "hasLand": <"yes" | "no" | null>,
  "hasHouse": <"yes" | "no" | null>,
  "hasGirlChild": <"yes" | "no" | null>,
  "isPregnant": <"yes" | "no" | null>
}

Rules:
- Income: convert "2 lakhs" → 200000, "50k" → 50000
- If user says "below poverty line" or "BPL" → hasBPL: "yes"
- If user mentions a state, use the full state name
- Return ONLY the JSON object, no markdown, no explanation, no backticks
`;

async function extractProfile(userMessage){
    const model = genAI.getGenerativeModel({model:'gemini-3.8-flash'});

    const result = await model.generateContent([
    EXTRACTION_PROMPT,
    `User message: "${userMessage}"`
  ]);

  const text = result.response.text().trim();

  try{
        return JSON.parse(text);
  }catch (err) {
    // Strip markdown backticks if model misbehaves
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

module.exports = {extractProfile};
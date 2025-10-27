import { GoogleGenerativeAI } from "@google/generative-ai";

export async function summarizeAnswer(answerText) {
  if (!answerText) return "⚠️ No text provided";

  try {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(
      `Summarize the following StackOverflow answer into 3–6 clear sentences. 
Do NOT use bullet points, headings, lists, formatting, code fences, or markdown. 
Write the summary in plain text only. Keep it neutral and informative.

Answer:
${answerText}`
    );

    const summary = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    return summary || "⚠️ Could not generate summary";
  } catch (err) {
    console.error("Summarizer Error:", err);
    return "⚠️ Summarization failed";
  }
}

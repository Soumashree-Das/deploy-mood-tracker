import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  baseURL: process.env.API_BASE,
});

// This function sends a prompt to the OpenAI API and returns a text reply
export async function chatWithBot(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemma-3n-e4b-it:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error.message);
    return "Sorry, I encountered an error.";
  }
}

// This is the actual Express route handler
export async function chatBotController(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ reply: "Prompt is required." });
    }

    const reply = await chatWithBot(prompt);

    res.status(200).json({ reply }); // ✅ only sending plain string, no circular structure
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ reply: "Internal server error." });
  }
}

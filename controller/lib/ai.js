// controller/lib/ai.js

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ✅ Always load the .env file from the project root (2 levels up)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// ✅ Check API key
// if (!process.env.GOOGLE_API_KEY) {
//   console.error("❌ GOOGLE_API_KEY not found in .env file!");
//   process.exit(1);
// }

// 🧠 Initialize Gemini model
const genAI = new GoogleGenerativeAI("AIzaSyAUkaLyxFxu-JYJuf4N0wO0gjHBo-17Lg8");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 📂 Load local data files
let textData = "";
const dataFolder = path.resolve(__dirname, "./data");
const files = fs.existsSync(dataFolder) ? fs.readdirSync(dataFolder) : [];

for (const file of files) {
  if (file.endsWith(".txt")) {
    const content = fs.readFileSync(path.join(dataFolder, file), "utf8");
    textData += `\n${content}`;
  }
}

console.log(`✅ Loaded ${files.length} text file(s) from ./data`);

// 💬 Core function — use local context if available, otherwise fallback to general knowledge
async function getAIResponse(userText) {
  try {
    const prompt = `If this context contains the answer, use it. Otherwise, answer from your general knowledge.

Context:
${textData.slice(0, 5000)}

Question: ${userText}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("❌ Error generating response:", error);
    return "⚠️ Something went wrong while generating response.";
  }
}

// 🔁 Export the function for use in Telegram.js or anywhere else
module.exports = { getAIResponse };

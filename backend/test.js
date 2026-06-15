// test.js
require("dotenv").config();

// console.log(process.env.GEMINI_API_KEY);

const { GoogleGenAI } =
  require("@google/genai");

const ai =
  new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

async function main() {

  const response =
    await ai.models.generateContent({

      model: "gemini-3.5-flash",

      contents:
        "Say hello"

    });

  console.log(response.text);
}

main().catch(console.error);
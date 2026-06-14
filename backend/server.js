// backend/server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({
  limit: "20mb"
}));

// ======================================================
// GEMINI
// ======================================================

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {

  res.json({

    success: true,

    message:
      "Backend Running"

  });

});

// ======================================================
// GENERATE POST
// ======================================================

app.post("/generate-post", async (req, res) => {

  try {
    console.log("Hello bhai");

    const {

      extractedProblems,

      challengeType,

      dayNum,

      totalDays

    } = req.body;

    if (
      !extractedProblems ||
      extractedProblems.length === 0
    ) {

      return res.status(400).json({

        success: false,

        error:
          "No extractedProblems received"

      });
    }

    const prompt = buildPrompt(

      extractedProblems,

      challengeType,

      dayNum,

      totalDays

    );

    const model =
      genAI.getGenerativeModel({

        model:
          "gemini-1.5-flash"

      });

    const result =
      await model.generateContent(prompt);

    const post =
      result.response.text();

    res.json({

      success: true,

      post

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      error: err.message

    });
  }

});

// ======================================================
// PROMPT BUILDER
// ======================================================

function buildPrompt(

  extractedProblems,

  challengeType,

  dayNum,

  totalDays

) {

  let problemsText = "";

  extractedProblems.forEach(

    (problem, index) => {

      problemsText += `

Problem ${index + 1}

Title:
${problem.title}

Difficulty:
${problem.difficulty}

Description:
${(problem.description || "")
  .substring(0, 1000)}

User Solution:
${(problem.code || "")
  .substring(0, 1500)}

`;
    }
  );

  return `

You are an expert DSA mentor and LinkedIn content writer.

Analyze the LeetCode problems and solution code.

Infer:

- approach used
- important learning points
- patterns used
- data structures used

Generate a LinkedIn post exactly in this style:

Day ${dayNum} of #${challengeType} 🚀

Today's session focused on important DSA concepts.

Problems Solved

✅ Problem Name

✅ Problem Name

✅ Problem Name

Key Learnings

🔹 Learning point 1

🔹 Learning point 2

🔹 Learning point 3

🔹 Learning point 4

Concluding paragraph.

Relevant hashtags.

Keep it:

- concise
- professional
- technical
- LinkedIn friendly
- under 250 words

Problem Data:

${problemsText}

`;
}

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {

  console.log("");

  console.log(
    `✅ Backend running on http://localhost:${PORT}`
  );

  console.log("");

});
// backend/server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } =
  require("@google/genai");

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
  new GoogleGenAI({
    apiKey:
      process.env.GEMINI_API_KEY
  });

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
    console.log("Data bhai:\n",req.body);
    console.log(
  JSON.stringify(
    extractedProblems,
    null,
  )
);
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

    

    const result =
  await genAI.models.generateContent({

    model:
      "gemini-2.5-flash",

    contents:
      prompt

  });

const post =
  result.text;

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

Analyze the LeetCode problems and the user's actual solution code.

Your job is to explain HOW the user's solution works, not to give a generic textbook explanation.

For each problem:

1. Mention the problem name.
2. Explain the key observation that led to the solution.
3. Explain the user's approach in 3-5 short lines.
4. Explain why that approach works.
5. Keep the explanation concise.

IMPORTANT:

* Do NOT explain every implementation detail.
* Do NOT write more than 80 words for a single problem.
* Do NOT create long paragraphs.
* Use short LinkedIn-style sentences.
* Focus on intuition and approach.
* Infer the approach from the user's code.
* Mention patterns such as Hashing, Sliding Window, Linked List, Two Pointers, Greedy, DP, BFS, DFS, etc.

Output format:

🚀 Day ${dayNum} of #${challengeType}

Today's session focused on important DSA concepts.

Problems Solved

✅ Problem Name

Key Observation:

[2-3 lines]

Approach Used:

[2-3 lines]

Why it works:

[1-2 lines]

✅ Problem Name

Key Observation:

[2-3 lines]

Approach Used:

[2-3 lines]

Why it works:

[1-2 lines]

✅ Problem Name

Key Observation:

[2-3 lines]

Approach Used:

[2-3 lines]

Why it works:

[1-2 lines]

💡 Today's Learnings

🔹 Learning 1

🔹 Learning 2

🔹 Learning 3

🔹 Learning 4

One short concluding paragraph.

Day ${dayNum}/${totalDays} ✅

Hashtags

STRICT RULES:

* Total post must stay under 500 words.
* Keep the entire post suitable for LinkedIn.
* Avoid long essays.
* Avoid repeating the problem statement.
* Explain the user's solution, not the optimal solution if they are different.

these are the problems ${problemsText}
`
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
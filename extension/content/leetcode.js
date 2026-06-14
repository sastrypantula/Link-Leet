"use strict";

console.log("[LC] Content script loaded");

chrome.runtime.onMessage.addListener(

  (message, sender, sendResponse) => {

   if (message.type === "EXTRACT_PROBLEM") {

  (async () => {

    console.log("Waiting for Monaco...");

    await waitForCodeToLoad();

    const details =
      extractProblemDetails();

    sendResponse({
      success: true,
      details
    });

  })();

  return true;
}

  }
);

async function waitForCodeToLoad() {

  for(let i = 0; i < 20; i++) {

    const lines =
      document.querySelectorAll(
        ".view-lines .view-line"
      );

    console.log(
      "Monaco lines:",
      lines.length
    );

    if(lines.length > 5) {

      console.log(
        "Code loaded successfully"
      );

      return true;
    }

    await new Promise(resolve =>
      setTimeout(resolve, 500)
    );
  }

  console.log(
    "Timed out waiting for Monaco"
  );

  return false;
}

function extractProblemDetails() {

  const result = {

  title: null,

  description: null,

  difficulty: null,

  // language: null,

  code: null

};
   console.log(document.querySelectorAll("a"));
  // Title
 result.title =
  document.title
    .replace(" - LeetCode", "")
    .trim();
  // Description
  const descriptionElement =
    document.querySelector(
      '[data-track-load="description_content"]'
    );

  if(descriptionElement){

    result.description =
      descriptionElement.innerText.trim();
  }

  // Difficulty
 const difficultyElement =
  document.querySelector(
    '[class*="text-difficulty"]'
  );

if(difficultyElement){

  result.difficulty =
    difficultyElement.textContent.trim();
}
   // Language

// const buttons =
//   document.querySelectorAll(
//     'button[aria-haspopup="dialog"]'
//   );

// if(buttons.length > 1){

//   result.language =
//     buttons[1].textContent.trim();
// }
// console.log(
//   "LANGUAGE =",
//   result.language
// );
// Code

const lines =
  document.querySelectorAll(
    ".view-lines .view-line"
  );

if(lines.length){

  result.code =
    Array.from(lines)
      .map(line => line.innerText)
      .join("\n");
}

console.log(
  "Code length:",
  result.code?.length
);

console.log(result);
  return result;
}
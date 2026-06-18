"use strict";
chrome.action.onClicked.addListener(() => {

    chrome.windows.create({

        url: chrome.runtime.getURL(

            "popup/popup.html"

        ),

        type: "popup",

        width: 500,

        height: 800

    });

});
// ======================================================
// MESSAGE LISTENER
// ======================================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === "FETCH_PROBLEMS") {

    handleFetchProblems()
      .then(() => {
        sendResponse({
          success: true
        });
      })
      .catch(err => {
        console.error("some error while fetching the problems", err);

        sendResponse({
          success: false,
          error: err.message
        });
      });

    return true;
  }
   if(message.type === "FILL_LINKEDIN"){

      openLinkedInPost()
    .then(() => {

      sendResponse({
        success:true
      });

    })
    .catch(err => {

      sendResponse({
        success:false,
        error:err.message
      });

    });

  return true;
    }
 

});

// ======================================================
// FETCH PROBLEMS HANDLER
// ======================================================

async function handleFetchProblems() {

  console.log("FETCH_PROBLEMS started");

  const problemMap = await getProblemMap();

  console.log(
    `[BG] Loaded ${Object.keys(problemMap).length} problems`
  );

  // For now only verify mapping works

  const data = await getStorage(["problems"]);

  const problems = data.problems || [];

  const slugs = problems.map(num => ({
    number: num,
    slug: problemMap[String(num)] || null
  }));

  console.log("[BG] Mapping Result");

  console.table(slugs);

  await setStorage({
  mappedProblems: slugs
});

await processProblems();

}

// ======================================================
// GET PROBLEM MAP
// ======================================================

async function getProblemMap() {

  const stored = await getStorage(["problemMap"]);

  if (
    stored.problemMap &&
    Object.keys(stored.problemMap).length > 0
  ) {

    console.log("[BG] Using cached problem map");

    return stored.problemMap;
  }

  console.log("Fetching problem map from LeetCode");

  const problemMap = await fetchAllProblems();

  await setStorage({
    problemMap
  });

  return problemMap;
}

// ======================================================
// FETCH ALL LEETCODE PROBLEMS
// ======================================================

async function fetchAllProblems() {

  const query = {

  operationName: "problemsetQuestionListV2",

  query: `
    query problemsetQuestionListV2(
      $filters: QuestionFilterInput,
      $limit: Int,
      $searchKeyword: String,
      $skip: Int,
      $sortBy: QuestionSortByInput,
      $categorySlug: String
    ) {
      problemsetQuestionListV2(
        filters: $filters
        limit: $limit
        searchKeyword: $searchKeyword
        skip: $skip
        sortBy: $sortBy
        categorySlug: $categorySlug
      ) {
        questions {
          questionFrontendId
          titleSlug
          title
          difficulty
        }
      }
    }
  `,

  variables: {

    skip: 0,

    limit: 100,

    categorySlug: "all-code-essentials",

    searchKeyword: "",

    filters: {
      filterCombineType: "ALL"
    },

    sortBy: {
      sortField: "CUSTOM",
      sortOrder: "ASCENDING"
    }
  }
};

  const response = await fetch(
    "https://leetcode.com/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(query)
    }
  );


   if (!response.ok) {

  const text = await response.text();

  console.log("GraphQL Error Response:");

  console.log(text);

  throw new Error(
    `GraphQL failed: ${response.status}`
  );

  }

  const json = await response.json();

  const questions =
  json.data.problemsetQuestionListV2.questions;


console.log(questions[0]);

  const map = {};

  for (const q of questions) {

    if (!q.questionFrontendId) continue;

map[String(q.questionFrontendId)] =
    q.titleSlug;
  }

  console.log(
    `[BG] Built map with ${Object.keys(map).length} problems`
  );

  return map;
}

// process the problem build the url and open tha tab
async function processProblems() {

  const data = await getStorage(["mappedProblems"]);

  const problems = data.mappedProblems || [];

  const extractedProblems = [];

  for (const problem of problems) {

    const url =
      `https://leetcode.com/problems/${problem.slug}/`;

    console.log("Opening:", url);

    const tab = await chrome.tabs.create({
      url,
      active: true
    });

    await waitForTabLoad(tab.id);

    console.log("Page loaded:", problem.slug);

    const result =
      await chrome.tabs.sendMessage(
        tab.id,
        {
          type: "EXTRACT_PROBLEM"
        }
      );
      const screenshot =
  await captureScreenshot(
    tab.windowId
  );

console.log(
  "Screenshot captured"
);

    console.log("Received from leetcode.js", result);
    console.log(result.details);

   extractedProblems.push({

  number: problem.number,

  slug: problem.slug,

  title:
    result?.details?.title || null,

  description:
    result?.details?.description || null,

  difficulty:
    result?.details?.difficulty || null,

  code:
    result?.details?.code || null,

  screenshot
});

await chrome.tabs.remove(tab.id);
await new Promise(resolve =>
  setTimeout(resolve, 1000)
);
  }

  await setStorage({
    extractedProblems
  });

const verify =
  await getStorage(["extractedProblems"]);

// console.log(
//   "VERIFY STORAGE",
//   verify.extractedProblems
// );
// console.log(
//   verify.extractedProblems[0].screenshot
// );
}

async function captureScreenshot(windowId) {

  const dataUrl =
    await chrome.tabs.captureVisibleTab(
      windowId,
      {
        format: "png"
      }
    );

  return dataUrl;
}

function waitForTabLoad(tabId) {

  return new Promise(resolve => {

    function listener(
      updatedTabId,
      changeInfo
    ) {

      if (
        updatedTabId === tabId &&
        changeInfo.status === "complete"
      ) {

        chrome.tabs.onUpdated
          .removeListener(listener);

        resolve();
      }
    }

    chrome.tabs.onUpdated
      .addListener(listener);
  });
}


async function openLinkedInPost() {

  const data =
    await getStorage([
      "generatedPost",
      "extractedProblems"
    ]);

  const tab =
    await chrome.tabs.create({

      url:
        "https://www.linkedin.com/feed/",

      active:true
    });

  await waitForTabLoad(tab.id);

  await new Promise(resolve =>
    setTimeout(resolve, 8000)
  );

  await chrome.tabs.sendMessage(
    tab.id,
    {
      type:
        "FILL_LINKEDIN_POST",

      post:
        data.generatedPost,

      screenshots:
        data.extractedProblems.map(
          p => p.screenshot
        )
    }
  );
}
// ======================================================
// STORAGE HELPERS
// ======================================================

function getStorage(keys) {

  return new Promise(resolve => {

    chrome.storage.local.get(
      keys,
      resolve
    );

  });
}

function setStorage(obj) {

  return new Promise(resolve => {

    chrome.storage.local.set(
      obj,
      resolve
    );

  });
}
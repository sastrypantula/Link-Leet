"use strict";

const BACKEND = "http://localhost:3000";
console.log("POPUP JS LOADED");
document.addEventListener("DOMContentLoaded", async () => {
  bindButtons();
  await loadSavedData();
});

// ===============================
// BUTTONS
// ===============================

function bindButtons() {

  $("btnFetch").addEventListener("click", fetchProblems);

  $("btnGenerate").addEventListener("click", generatePost);

  $("btnLinkedIn").addEventListener("click", fillLinkedIn);

  $("btnReset").addEventListener("click", resetAll);
}

// ===============================
// LOAD SAVED DATA
// ===============================

async function loadSavedData() {

  const data = await getStorage([
    "challengeType",
    "dayNum",
    "totalDays",
    "problems",
    "generatedPost"
  ]);

  if(data.challengeType)
    $("challengeType").value = data.challengeType;

  if(data.dayNum)
    $("dayNum").value = data.dayNum;

  if(data.totalDays)
    $("totalDays").value = data.totalDays;

  if(data.problems){

    $("prob1").value = data.problems[0] || "";
    $("prob2").value = data.problems[1] || "";
    $("prob3").value = data.problems[2] || "";
  }

  if(data.generatedPost){

    $("postPreview").style.display = "block";
    $("postPreview").textContent = data.generatedPost;

    $("btnLinkedIn").disabled = false;
  }
}

// ===============================
// FETCH PROBLEM DATA
// ===============================
async function fetchProblems() {

  const p1 = $("prob1").value.trim();
  const p2 = $("prob2").value.trim();
  const p3 = $("prob3").value.trim();

  const dayNum = $("dayNum").value.trim();
  const totalDays = $("totalDays").value.trim();

  const challengeType = $("challengeType").value;

  if (!p1 || !p2 || !p3) {
    setStatus("Enter all 3 problem numbers");
    return;
  }

  const problems = [p1, p2, p3];

  await setStorage({
    problems,
    challengeType,
    dayNum,
    totalDays
  });

  setStatus("Fetching problem data...");

  chrome.runtime.sendMessage({
    type: "FETCH_PROBLEMS"
  }, (response) => {

    if (chrome.runtime.lastError) {
      setStatus(chrome.runtime.lastError.message);
      return;
    }

    if (!response) {
      setStatus("No response from background");
      return;
    }

    if (response.success) {

      setStatus("Problem data fetched successfully");

      $("btnGenerate").disabled = false;

    } else {

      setStatus(response.error || "Fetch failed");
    }
  });
}

// ===============================
// GENERATE POST
// ===============================

async function generatePost() {
 console.log("GENERATE CLICKED");

  const data = await getStorage([
    "extractedProblems",
    "challengeType",
    "dayNum",
    "totalDays"
  ]);

  console.log(data);

  if(!data.extractedProblems){

    setStatus("Fetch problem data first");
    return;
  }

  setStatus("Generating LinkedIn post...");

  try{
    console.log("Sending to backend", data);

    const res = await fetch(`${BACKEND}/generate-post`,{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

     body: JSON.stringify({

  extractedProblems:
    data.extractedProblems,

  challengeType:
    data.challengeType,

  dayNum:
    data.dayNum,

  totalDays:
    data.totalDays

})
    });

    const result = await res.json();

    await setStorage({
      generatedPost:result.post
    });

    $("postPreview").style.display = "block";
    $("postPreview").textContent = result.post;

    $("btnLinkedIn").disabled = false;

    setStatus("Post generated Successfully");

  }catch(err){

    setStatus(err.message);
  }
}

// ===============================
// FILL LINKEDIN
// ===============================

async function fillLinkedIn(){

  chrome.runtime.sendMessage({

    type:"FILL_LINKEDIN"

  });
}

// ===============================
// RESET
// ===============================

async function resetAll(){

  const ok = confirm("Clear all stored data?");

  if(!ok) return;

  await chrome.storage.local.clear();

  location.reload();
}

// ===============================
// HELPERS
// ===============================

function $(id){

  return document.getElementById(id);
}

function setStatus(msg){

  $("statusBox").textContent = msg;
}

function getStorage(keys){

  return new Promise(resolve =>
    chrome.storage.local.get(keys, resolve)
  );
}

function setStorage(obj){

  return new Promise(resolve =>
    chrome.storage.local.set(obj, resolve)
  );
}
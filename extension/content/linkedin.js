// content/linkedin.js
// Runs on LinkedIn pages and fills the post composer

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FILL_LINKEDIN_POST") {
    fillPost(message.post, message.screenshots)
      .then(result => sendResponse(result))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open for async response
  }
});

// ─── Main function to fill LinkedIn post ─────────────────────────────────────
async function fillPost(postContent, screenshots) {
  // Find the composer text area
  const editor = await waitForElement(
    '.ql-editor[contenteditable="true"], [data-placeholder="What do you want to talk about?"], .share-creation-state__placeholder',
    8000
  );

  if (!editor) {
    // Try to open the post modal first
    const startPostBtn = document.querySelector('[aria-label="Start a post"]') ||
                         document.querySelector('button.share-box-feed-entry__trigger');

    if (startPostBtn) {
      startPostBtn.click();
      await sleep(2000);

      const editorAfterClick = await waitForElement(
        '.ql-editor[contenteditable="true"]',
        5000
      );

      if (!editorAfterClick) {
        return { success: false, error: "Could not find LinkedIn post editor" };
      }

      await insertText(editorAfterClick, postContent);
    } else {
      return { success: false, error: "Please click 'Start a post' on LinkedIn first" };
    }
  } else {
    await insertText(editor, postContent);
  }

  // Upload screenshots if available
  if (screenshots && screenshots.length > 0) {
    await sleep(500);
    await uploadScreenshots(screenshots);
  }

  showLinkedInToast("✅ Post filled by LeetCode Extension! Review and click Post.");

  return { success: true };
}

// ─── Insert text into LinkedIn's editor ──────────────────────────────────────
async function insertText(editor, text) {
  // Click to focus
  editor.click();
  editor.focus();

  // Clear existing content
  editor.innerHTML = "";

  // LinkedIn uses a Quill editor, we need to trigger proper input events
  // Method 1: execCommand
  try {
    // Set focus
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    selection.removeAllRanges();
    selection.addRange(range);

    // Insert line by line to preserve formatting
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      document.execCommand("insertText", false, lines[i]);
      if (i < lines.length - 1) {
        document.execCommand("insertParagraph", false);
      }
    }

    // Trigger events to make LinkedIn recognize the input
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    editor.dispatchEvent(new Event("change", { bubbles: true }));
    editor.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));

    return true;
  } catch (e) {
    // Fallback: set innerHTML
    editor.innerHTML = text.split("\n").map(line => `<p>${line || "<br>"}</p>`).join("");
    editor.dispatchEvent(new Event("input", { bubbles: true }));
    return true;
  }
}

// ─── Upload screenshots ───────────────────────────────────────────────────────
async function uploadScreenshots(screenshots) {
  // Find the image/media button in LinkedIn composer
  const mediaBtn = document.querySelector('[aria-label*="image"], [aria-label*="media"], button[class*="media"]');

  if (!mediaBtn) {
    console.log("[Extension] Could not find media upload button");
    return;
  }

  // Convert base64 screenshots to File objects and upload
  for (const screenshotData of screenshots) {
    try {
      const blob = base64ToBlob(screenshotData, "image/png");
      const file = new File([blob], "leetcode-solution.png", { type: "image/png" });

      // LinkedIn's file input
      const fileInput = document.querySelector('input[type="file"][accept*="image"]');
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event("change", { bubbles: true }));
        await sleep(1500);
      }
    } catch (e) {
      console.log("[Extension] Screenshot upload failed:", e);
    }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function base64ToBlob(base64, mimeType) {
  const byteString = atob(base64.split(",")[1] || base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}

function showLinkedInToast(message) {
  const existing = document.getElementById("lc-ext-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "lc-ext-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: #0a66c2;
    color: white;
    border-radius: 8px;
    padding: 14px 20px;
    font-size: 14px;
    font-family: 'Segoe UI', sans-serif;
    z-index: 999999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    max-width: 320px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

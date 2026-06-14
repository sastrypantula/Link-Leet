# ⚡ LeetCode → LinkedIn Auto Post Generator
## Complete Setup Guide (Read This First!)

---

## 📁 Project Structure

```
leetcode-linkedin-extension/
│
├── extension/              ← Chrome Extension (load this into Chrome)
│   ├── manifest.json
│   ├── icons/
│   ├── popup/
│   │   ├── popup.html
│   │   └── popup.js
│   ├── content/
│   │   ├── leetcode.js
│   │   └── linkedin.js
│   └── background/
│       └── background.js
│
├── backend/                ← Node.js Server (run this on your computer)
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── generate_icons.py       ← Helper script (already ran)
```

---

## 🛠️ STEP-BY-STEP SETUP

---

### STEP 1 — Get an OpenAI API Key

1. Go to: **https://platform.openai.com/api-keys**
2. Sign in / create an account
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-...`)
5. **Save it** — you'll need it in Step 2

> ⚠️ OpenAI charges per API call. Each post generation costs ~$0.001 (less than 1 paisa). Very cheap!

---

### STEP 2 — Set Up the Backend

**Open Terminal / Command Prompt:**

```bash
# 1. Go to the backend folder
cd path/to/leetcode-linkedin-extension/backend

# 2. Create the .env file
cp .env.example .env
```

**Now open the `.env` file in any text editor (Notepad, VS Code, etc.):**

```
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3000
```

Replace `sk-your-actual-key-here` with the key you got in Step 1.

**Install dependencies:**

```bash
npm install
```

**Start the backend:**

```bash
node server.js
```

You should see:
```
✅ LeetCode LinkedIn Generator Backend
🚀 Running at http://localhost:3000
```

> 🔴 IMPORTANT: Keep this terminal window open while using the extension!

---

### STEP 3 — Load the Chrome Extension

1. Open **Google Chrome**
2. Go to: `chrome://extensions/`
3. Turn ON **"Developer mode"** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the **`extension`** folder inside your project
6. You'll see the extension appear with an icon in Chrome's toolbar

> If you don't see the icon, click the puzzle piece 🧩 icon in Chrome toolbar and pin it.

---

### STEP 4 — Using the Extension

#### Before solving problems:

1. Click the extension icon in Chrome toolbar
2. Select your **Challenge type** (Striver/Blind 75/NeetCode 150)
3. Enter the **Day number** (e.g., Day 12) and **Total days** (e.g., 45)
4. Enter **Problem 1, 2, 3** LeetCode numbers (e.g., 1, 2, 3)
5. Click **"Save & Start Monitoring"**

#### Now solve the problems:

1. Go to LeetCode.com
2. Solve Problem 1 → Submit → Get "Accepted"
3. The extension automatically detects it! (You'll see a toast notification)
4. Solve Problem 2 → Submit → Get "Accepted"
5. Solve Problem 3 → Submit → Get "Accepted"
6. The extension popup will show all 3 as ✅

#### Generate the post:

1. Click the extension icon
2. Click **"Generate LinkedIn Post"**
3. Wait 5-10 seconds for AI to generate
4. You'll see a preview of the post

#### Fill LinkedIn:

1. Click **"Fill LinkedIn Post"**
2. If LinkedIn isn't open, it opens automatically
3. On LinkedIn, click **"Start a post"**
4. Come back to extension, click **"Fill LinkedIn Post"** again
5. The text gets auto-filled in LinkedIn!
6. Review the post
7. Click **"Post"** on LinkedIn

---

## ❓ Troubleshooting

### "Error: Is your backend running on port 3000?"
→ Make sure you ran `node server.js` in the backend folder and it's still running.

### "Please click Start a post on LinkedIn first"
→ Go to LinkedIn feed, click "Start a post" to open the composer, then try again.

### Extension not detecting solved problems?
→ Make sure you clicked "Save & Start Monitoring" BEFORE solving the problems.
→ Try refreshing the LeetCode page after saving problems.

### OpenAI error?
→ Check your `.env` file has the correct API key.
→ Make sure you have billing set up at platform.openai.com

### Extension not showing?
→ Go to chrome://extensions and make sure it's enabled (toggle is blue).

---

## 🔧 Customizing the Post Format

To change how the AI generates posts, edit `backend/server.js`:

- Find the `buildPrompt` function
- Edit the instructions inside to change tone, format, hashtags, etc.

---

## 💡 Tips

- The extension works while you browse — no need to keep it open
- Progress is saved in Chrome's local storage (survives browser restarts)
- Click "Reset All Data" in the extension to start fresh for a new day
- For best results, solve all problems in one sitting

---

## 📊 Cost Estimate

Using `gpt-4o-mini` model:
- ~1 post generation = ~800 tokens = ~$0.0001
- 45 days of Striver SDE = ~$0.005 total (less than 50 paisa!)

# 🚀 Leet-Link

LeetLink is a Chrome Extension that automates sharing your LeetCode progress on LinkedIn.

The extension extracts solved LeetCode problems, captures screenshots, generates a LinkedIn-ready post using Gemini AI, and automatically fills the LinkedIn post editor with both text and images.

---

# Features

✅ Enter LeetCode problem numbers

✅ Automatically fetch problem details

✅ Extract

- Problem Title
- Difficulty
- Description
- Your submitted code

✅ Capture screenshots of solved problems

✅ Generate LinkedIn posts using Gemini AI

✅ Open LinkedIn automatically

✅ Fill LinkedIn post content

✅ Upload screenshots automatically

---

# Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Chrome APIs

- chrome.tabs
- chrome.storage
- chrome.runtime
- chrome.action
- chrome.scripting

### Backend

- Node.js
- Express.js

### AI

- Gemini 2.5 Flash API

### API
GraphQL
RESTAPI

---

# Project Structure

```text
LeetLink/

│
├── manifest.json
│
├── background/
│   └── background.js
│
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
│
├── content_scripts/
│   ├── leetcode.js
│   └── linkedin.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── assets/
│
└── README.md
```

---

# Installation

## Step 1 : Clone Repository

```bash
git clone <repository-url>

cd LeetLink
```

---

## Step 2 : Install Backend Dependencies

Move into backend folder

```bash
cd backend
```

Install packages

```bash
npm install
```

---

## Step 3 : Create .env file

Inside backend folder create

```text
.env
```

Add your Gemini API Key

```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

Example

```env
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxx
```

---

# Getting Gemini API Key

Visit

https://aistudio.google.com/

Create an API Key

Copy it

Paste it inside

```env
GEMINI_API_KEY=
```

---

# Running Backend Server

Inside backend folder

```bash
node server.js
```

Server should start successfully

```text
✅ Backend running on http://localhost:3000
```

Keep this terminal running.

---

# Loading Chrome Extension

Open Chrome

Go to

```text
chrome://extensions/
```

Enable

```text
Developer Mode
```

Click

```text
Load unpacked
```

Select

```text
LeetLink
```

Extension is now installed.

---

# How To Use


### Step 1

Open LeetCode

Solve problems


---

### Step 2

Open Extension


Enter


```text
Problem 1 Number

Problem 2 Number

Problem 3 Number
```


Example


```text
1

2

3
```


Choose


```text
Challenge Type

Day Number

Total Days
```


Example


```text
Challenge Type

Striver


Day

1


Total Days

45
```


---

### Step 3


Click


```text
Fetch Problems
```


Extension automatically


✔ Opens LeetCode pages


✔ Extracts descriptions


✔ Extracts code


✔ Captures screenshots


✔ Stores extracted data


---

### Step 4


Click


```text
Generate Post
```


Gemini generates a LinkedIn-ready post.


Preview appears inside extension.


---

### Step 5


Click


```text
Fill LinkedIn
```


Extension automatically


✔ Opens LinkedIn


✔ Opens post editor


✔ Inserts generated text


✔ Uploads screenshots


---

# Required Permissions


Manifest requires


```json
"permissions": [

"tabs",

"storage",

"activeTab",

"scripting"

]
```


Host permissions


```json
"host_permissions": [

"https://leetcode.com/*",

"https://www.linkedin.com/*"

]
```


---

# Notes


Keep backend server running while using the extension.


LinkedIn UI changes frequently.


Selectors inside


```text
linkedin.js
```


may require updates in future.

---


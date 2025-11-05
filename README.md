# 🧠 Syntax Sifu — One-Day MVP Prototype

> Prototype built in **5h 32m** to explore new tech.  
> Not an active project — just an experiment in rapid MVP design.

---

## ⚡ Overview

**Syntax Sifu** is a sarcastic micro-coding-drill web app.  
Pick a topic and language, race through 5-minute challenges, get roasted by the end screen.

🧩 Live Links  
- Backend: [Render](https://dashboard.render.com/web/srv-d3bv0rvdiees738vhu40)  
- Frontend: [Vercel](https://vercel.com/silverspark/syntax-sifu)

---

## 🧭 Objective

Create a lightweight, playful coding trainer where users:

- Choose a **concept** (loops, strings, recursion, etc.)
- Choose a **language** (Python, JS, or C#)
- Solve sarcastic challenges under time pressure
- Skip, pause, or restart freely
- Receive snarky feedback on completion

---

## 🔄 User Flow

1. **Landing:** Select category + language → Start Drill  
2. **Onboarding Overlay:** 3 quick slides (roast / how-it-works / controls)  
3. **Challenge Round:** Monaco editor, 5-minute timer, instant ✅/❌ feedback  
4. **End Screen:** Summary + sarcastic commentary  

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js + Monaco Editor (`@monaco-editor/react`) → Vercel |
| Backend | FastAPI (Python) → Render / Railway |
| Execution | Python → `exec()` • JS → Node subprocess • C# → `dotnet-script` |
| Storage | Optional SQLite for users / submissions / challenges |

---

## 🧩 Example Challenges

**Strings** – “Reverse a string. Welcome to 2005 interview hell.”  
**Lists** – “Return the last element. Closure matters.”  
**Loops** – “Countdown from n to 0, like your motivation.”  
**Classes** – “Dog inherits Animal. Dog barks. Groundbreaking.”  
**Unit Tests** – “Write pytest for `is_even(n)` because QA insists.”

---

## 🧪 Quick API Sketch

```
GET /challenge?category=loops      → random prompt
POST /submit_code {code,fn,lang}   → run tests & return result
```


---

## 🗓️ Build Timeline (1 Day)

**AM (3 h):** FastAPI scaffold + challenge bank + multi-language runner  
**PM (3 h):** Next.js UI + Monaco editor + timer + controls  
**Eve (2 h):** Onboarding + end screen + deployments

---

## 🧠 Notes & Next Steps

- Add **skip button** to bypass rate limits / keep momentum  
- Focus on **blur-fade onboarding** for tutorial polish  
- Extract **runner prompt** into separate file  
- Potential hackathon remake when validated  

---

### 🎨 Design Inspo

LeetCode-style layout with snarky tone + minimal UI for focus.  
Future ideas: scoring streaks, AI-generated roasts, community challenge packs.


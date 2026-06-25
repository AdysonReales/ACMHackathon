# PROSESO

An AI-powered, mobile-responsive study companion web application that reimagines the high-stakes courtroom drama of *Ace Attorney* as a *Pokémon*-style turn-based academic thesis defense. 

---

## 👥 Team Information: LarpTrip
We are a team of application developers collaborating to push the boundaries of gamified learning systems and local language engineering datasets.

* **Adyson Reales** — Lead Architect / Project Management
* **Rolando Zagala** — Frontend Engineer / State Machine Developer
* **Elijah Raven De Luna** — Backend & Infrastructure Engineer
* **Lleyton Flores** — Asset Pipeline & UI/UX Designer

---

## 📋 The Problem Statement: Case 2
Our team selected **Case 2 (AI Study Companion)** to resolve the core engagement and retention drop-offs found in traditional, text-dense Learning Management Systems (LMS). Traditional study methods lack immediate feedback and cognitive immersion. 

**Proseso** transforms dry, passive document reading into an active, high-stakes academic battle simulation to gamify retention while simultaneously generating specialized dataset foundations for local open-source research.

---

## 🎮 The Core Product Loop

1. **Document Ingestion:** Students upload their course materials (PDF syllabi, lecture notes, or textbook screenshots).
2. **Case Generation:** A single-pass AI script analyzes the text once, compiling it into an interactive level layout mapping core concepts to counter-evidence cards.
3. **The Courtroom Battle:** A strict Professor sprite launches flawed, jargon-heavy academic "attacks." The player inspects their bilingual **Evidence Bag** to match the flaw and slams down **"OBJECTION!" (Tutol!)**, triggering retro screenshake and layout transitions.
4. **The Oral Defense:** The Professor reels back and demands a vocal explanation (*"Paliwanag mo nga!"*). The player holds down the microphone button to defend their position in English or Taglish code-switching.
5. **Stutter & Penalty Matrix:** Native browser audio streams directly to the **Deepgram API**. A local evaluation module analyzes the text transcript for confidence scores and counts local speech filler elements (*"uh"*, *"um"*, *"ano"*, *"parang"*). Excess stammers result in a **"STUTTER PENALTY!"**, inflicting recoil damage onto the user's Academic Reputation (HP) bar.

---

## 🚀 Dual-Theme Merge Architecture

This application successfully bridges both hackathon prompt tracks simultaneously:
* **Theme 2 (AI Study Companion):** A mobile-first, low-bandwidth architecture that scales dynamically from desktop viewports down to mobile screens. By loading combat states entirely locally on the client viewport, continuous token costs and server network strain are reduced to absolute zero. 
* **Theme 1 (Philippine Speech Technology):** Every oral defense interaction seamlessly crowd-sources a real-world, conversational, code-switched Taglish academic speech database. Labeled audio assets (`.wav`) along with text transcripts and stutter frequency metrics are securely pipelined to **Supabase** to create a downloadable open-source evaluation benchmark for future local language researchers.

---

## 🛠️ Technical Stack

* **Frontend Framework:** React (Vite) + TypeScript
* **Styling & Design Tokens:** Tailwind CSS (Y2K / Soft Classroom Layout System)
* **Backend Database:** Supabase (PostgreSQL Metadata Logs & Secure Audio Storage Buckets)
* **Speech-to-Text Processing:** Deepgram API (`filler_words=true` conversational engine)

---

## 📦 Local Installation & Setup

1. **Clone the Repository:**
   ```sh
   git clone [https://github.com/AdysonReales/ACMHackathon.git](https://github.com/AdysonReales/ACMHackathon.git)
   cd ACMHackathon

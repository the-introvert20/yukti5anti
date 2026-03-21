# YUKTI — AI Based Gamified Environmental Learning Platform

<div align="center">
  <h3>For the Peaks and Pines of Uttarakhand 🏔️🌲</h3>
  <p>An interactive, AI-powered platform designed for students (grades 6-12) to learn about environmental conservation, local ecology, and sustainability through gamified quests, interactive maps, and localized curriculum.</p>
</div>

## 🌟 Features

- **Interactive Quests & Quizzes**: Gamified learning modules targeting Uttarakhand's specific ecology (e.g., Save the Snow Leopards, Ganga Restoration).
- **Eco-Guardian Leaderboard**: Students earn points, level up, and compete for badges acknowledging their conservation knowledge.
- **AI Chatbot (Yukti AI)**: A built-in virtual Himalayan guide powered by Groq (LLaMA 3) to answer student questions regarding flora, fauna, and local geography in real-time.
- **Teacher Dashboard**: Centralized analytics showing class progress, impact hours, badge milestones, and easy access to local PDF resources.
- **Responsive "Glassmorphic" UI**: Designed using modern aesthetics, Tailwind CSS, dark/light theme toggling, and rich CSS animations.

## 🛠 Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), CSS3
- **Backend (Auth)**: Node.js, Express, `google-auth-library`, JSONWebToken (JWT) for secure session cookies
- **Styling**: Tailwind CSS (via CDN with custom configurations)
- **Icons & Fonts**: Google Material Symbols, Google Fonts (Inter, Manrope)
- **AI Integration**: Groq API (LLaMA-3.3-70b-versatile) for conversational AI
- **Deployment & Tooling**: Vite (Dev Server), Jest (Test Suite)

## 🚀 Getting Started

To run the YUKTI platform locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/the-introvert20/yukti5anti.git
   cd yukti5anti
   ```

2. **Configure API Keys**
   - Head over to `index.html` and locate the `GROQ_API_KEY` constant around line `1015`.
   - Update it with your valid Groq API Key:
     ```javascript
     const GROQ_API_KEY = 'your_groq_api_key_here';
     ```

3. **Configure Google OAuth 2.0 Backend**
   - The application uses a local Node.js backend for secure PKCE token validation.
   - Navigate into the `/server` directory: `cd server`
   - Install backend dependencies: `npm install`
   - Copy the `.env.example` file to `.env` and fill in your Google Client ID and Client Secret (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`).
   - Run the backend: `npm run dev`

4. **Run the Development Frontend Server**
   - In a separate terminal, navigate back to the root `yukti5anti` folder.
   - Run Vite:
   ```bash
   npm install
   npm run dev
   ```

4. **Explore the App**
   - Open your browser to the local network link provided by Vite (usually `http://localhost:5173/`).

## 🗺 Application Architecture

The project works as a lightweight Single Page Application (SPA), routing logic relies on native hashchanges and `fetch()` to fetch and parse individual raw HTML files located in the `public/pages/` directory dynamically into the DOM.

- `server/`: Houses the Express backend, handling PKCE code exchanges, API rate-limiting, secure `httpOnly` sessions, and logging.
- `index.html`: The main application shell (Navbar, Theme Controller, AI Chatbot).
- `public/pages/landing.html`: Entry splash page.
- `public/pages/dashboard.html`: The core player perspective with active quests and stats.
- `public/pages/teacher.html`: Educator analytics and class monitoring workspace.
- `public/pages/quiz.html`: Interactive, timer-based trivia layout. 

## 🏞 Why Uttarakhand?

Uttarakhand is home to some of the most dynamic environments on Earth, from the Ganges river basin to the high Himalayas. **YUKTI** is built specifically to address the lack of hyper-localized, interactive environmental education materials designed for regional youth. By contextualizing learning around Jim Corbett, the Chipko movement, and Himalayan monals, students gain hands-on appreciation for the biome they inhabit.

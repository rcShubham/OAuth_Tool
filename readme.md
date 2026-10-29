# OAuth Setup Assistant 🛡️

A modern, AI-powered web application that guides developers through the painful process of configuring OAuth applications for external services.

Instead of scouring through outdated or fragmented documentation, developers can select their provider, specify their application type and environment, and receive a tailored, step-by-step checklist with contextual advice.

## 🚀 Live Demo

*(Insert your Vercel/Netlify deployment link here)*

## 🛠️ Setup Instructions

To run this project locally:

1. **Initialize a React environment** (Next.js, Vite, or Create React App):

   ```
   npx create-react-app oauth-assistant
   cd oauth-assistant
   
   ```

2. **Install dependencies**:
   This project relies on `lucide-react` for icons and Tailwind CSS for styling.

   ```
   npm install lucide-react
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   
   ```

3. **Configure Tailwind**: Ensure your `tailwind.config.js` is set up to scan your component files.

4. **Copy the Application**: Replace your `src/App.js` with the provided `App.jsx` code.

5. **Add API Key**:

   * *Note for reviewers:* In this MVP codebase, the Gemini API key is referenced directly in the component for ease of demonstration. In a production environment, this must be moved to a server-side route (e.g., Next.js API Routes) using an environment variable (`process.env.GEMINI_API_KEY`).

6. **Start the app**:

   ```
   npm start
   
   ```

## 🧠 Key Decisions

* **Generative AI with Structured Output:** We utilized the Gemini API not just for chat, but to actively research the web for documentation. By forcing the LLM to output according to a strict JSON schema, we ensure the UI consistently renders interactive checklists, scopes, and time estimates, rather than returning a wall of markdown text.

* **Anti-Hallucination via Disambiguation:** A major challenge with AI agents is hallucination when given ambiguous prompts. If a user searches for "Apple", the AI is instructed *not* to guess. Instead, it flags the query as ambiguous and returns UI suggestions ("Sign in with Apple" vs "Apple Music API") for the user to clarify.

* **Contextual injection:** The guide dynamically injects environment-specific advice (e.g., suggesting `localhost:3000` for development redirect URIs vs `yourdomain.com` for production).

* **Time-to-Value:** Estimated times are displayed for every step to help developers plan their work.

## 🔍 Verification & Learnings (QA)

During the development and testing of this agent against real sources, we discovered the following:

1. **Successful Verification:** The hardcoded data for **Google** and **GitHub** was verified against official docs. The AI correctly identified that Google requires manual verification for sensitive scopes, while GitHub is stricter about exact Redirect URI matches.

2. **Dynamic Generation Accuracy:** When testing unfamiliar apps (e.g., "Spotify OAuth"), the agent successfully located the need for the `user-read-private` scope and the Dashboard URL.

3. **Corrections Made:** Initially, the AI would sometimes invent provider requirements (like approval timelines). We corrected this by adjusting the system prompt to explicitly forbid inventing SLAs and to rely strictly on Google Search grounding.

## ⚠️ Limitations

* **Documentation Paywalls:** If an identity provider hides their developer documentation behind a login wall, the AI agent will not be able to read it and may fail to generate a highly accurate guide.

* **API Key Management:** As an MVP designed for a single-file preview, the API calls are made client-side. A true production rollout requires migrating these calls to a secure backend to protect the API key.

* **Time Estimates:** The time estimates for AI-generated guides are heuristic approximations based on standard OAuth flows, not guaranteed completion times.
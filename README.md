

Framework: React 19 for UI and state management.
AI Engine: Google Gemini 3 Flash for vision-based OCR, allergen reasoning, and multi-language translation.
Styling: Tailwind CSS for a responsive, premium iOS-style interface.
Hardware Integration: WebRTC (MediaStream API) for live camera scanning and the HTML5 File API for gallery uploads.
Storage: Browser LocalStorage for persistent user profiles and scan history.


This contains everything you need to run your app locally.



## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# TourCraft

## Run in VS Code
1. Open this folder in VS Code.
2. Open Terminal.
3. Run:
   npm install
   npm run dev
4. Open the localhost address shown by Vite in Chrome.

The frontend is intentionally self-contained: login, navigation, trip planning, itinerary, explore, bookings, trips, profile and emergency screens work without API keys.

## Optional Python API
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

## Optional services
Gemini, Google Maps, MongoDB and Pixel-style analytics are represented as integration points. Add real keys only when you are ready; never put secret server keys directly into public frontend code.

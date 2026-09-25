"""
Optional TourCraft API.
The React app works without this server. Run this only if you want a Python API.
"""
import os
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="TourCraft API")

class TripRequest(BaseModel):
    destination: str = "Rishikesh"
    days: int = 5
    travellers: int = 1
    budget: int = 10000
    interests: list[str] = []

@app.get("/api/health")
def health():
    return {"ok": True, "service": "TourCraft API"}

@app.post("/api/generate-trip")
def generate_trip(req: TripRequest):
    return {
        "destination": req.destination,
        "days": req.days,
        "travellers": req.travellers,
        "budget": req.budget,
        "message": "Trip generated using TourCraft rules. Connect Gemini here for live AI generation.",
        "stops": ["Triveni Ghat", "Ram Jhula", "Rishikesh View Point", "Nilkanth Waterfalls"]
    }

# Optional MongoDB/Gemini integrations can be added through environment variables:
# MONGODB_URI=...
# GEMINI_API_KEY=...
# GOOGLE_MAPS_API_KEY=...

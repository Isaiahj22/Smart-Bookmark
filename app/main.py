from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import os
import json
import requests  # ✅ Use requests instead of openai!

app = FastAPI()
templates = Jinja2Templates(directory="app/templates")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Mount static files (important if you have frontend assets like CSS, JS)
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# === ROUTES ===

@app.get("/", response_class=HTMLResponse)
def read_home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/voice/{book_id}")
def get_voice(book_id: str, lang: str = "en"):
    path = os.path.join(BASE_DIR, "audio", f"{book_id}_{lang}.mp3")
    if os.path.exists(path):
        return FileResponse(path, media_type="audio/mpeg")
    return JSONResponse({"error": "Voice file not found"}, status_code=404)

@app.get("/tips/{book_id}")
def get_tips(book_id: str, lang: str = "en"):
    tips_path = os.path.join(BASE_DIR, "data", f"tips_{lang}.json")
    try:
        with open(tips_path, "r") as file:
            tips = json.load(file)
        return JSONResponse(tips.get(book_id, {"tips": []}))
    except:
        return JSONResponse({"error": "Tips not found"}, status_code=404)

@app.get("/avatars")
def get_avatars():
    with open(os.path.join(BASE_DIR, "data", "avatars.json"), "r") as file:
        avatars = json.load(file)
    return JSONResponse(avatars)

# === Create Game Routes ===

@app.get("/create-game", response_class=HTMLResponse)
async def create_game_page(request: Request):
    return templates.TemplateResponse("create_game.html", {"request": request})

@app.post("/create-game")
async def create_game(request: Request):
    data = await request.json()
    story_title = data.get("story_title", "")

    if not story_title:
        return JSONResponse({"error": "Story title is required"}, status_code=400)

    # Build the prompt for Ollama
    payload = {
        "model": "llama2",  # ✅ or mistral/llama3 if you prefer
        "messages": [
            {
                "role": "user",
                "content": (
                    f"Print Numbers 1-10"
                )
            }
        ]
    }

    try:
        response = requests.post(
            "http://localhost:11434/api/chat",
            json=payload
        )
        response.raise_for_status()

        result = response.json()
        game_text = result['message']['content']

        return JSONResponse({"game": game_text})

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os
import json
from fastapi.responses import JSONResponse, FileResponse


from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.templating import Jinja2Templates
import os
import json

app = FastAPI()
templates = Jinja2Templates(directory="app/templates")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.get("/", response_class=HTMLResponse)
def read_home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

# === Routes ===

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

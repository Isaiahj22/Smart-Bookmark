from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import os
import json

app = FastAPI()
templates = Jinja2Templates(directory="app/templates")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Serve static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Home Page
@app.get("/", response_class=HTMLResponse)
def read_home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

# Teacher Page
@app.get("/signup-teacher", response_class=HTMLResponse)
def signup_teacher(request: Request):
    return templates.TemplateResponse("teacher.html", {"request": request})

# Student Page
@app.get("/signup-student", response_class=HTMLResponse)
def signup_student(request: Request):
    return templates.TemplateResponse("signup-student.html", {"request": request})

# Voice
@app.get("/voice/{book_id}")
def get_voice(book_id: str, lang: str = "en"):
    path = os.path.join(BASE_DIR, "audio", f"{book_id}_{lang}.mp3")
    if os.path.exists(path):
        return FileResponse(path, media_type="audio/mpeg")
    return JSONResponse({"error": "Voice file not found"}, status_code=404)

# ⭐ Story (Fix here for english/spanish selection)
@app.get("/story/{book_id}")
def get_story(book_id: str, lang: str = "english"):
    if lang == "english":
        filename = f"{book_id}_en.txt"
    elif lang == "spanish":
        filename = f"{book_id}_es.txt"
    else:
        return JSONResponse({"error": "Language not supported"}, status_code=400)

    file_path = os.path.join(BASE_DIR, "data", filename)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as file:
            story = file.read()
        return JSONResponse({"story": story})
    return JSONResponse({"error": "Story not found"}, status_code=404)

# Tips
@app.get("/tips/{book_id}")
def get_tips(book_id: str, lang: str = "en"):
    tips_path = os.path.join(BASE_DIR, "data", f"tips_{lang}.json")
    try:
        with open(tips_path, "r") as file:
            tips = json.load(file)
        return JSONResponse(tips.get(book_id, {"tips": []}))
    except:
        return JSONResponse({"error": "Tips not found"}, status_code=404)

# Avatars
@app.get("/avatars")
def get_avatars():
    with open(os.path.join(BASE_DIR, "data", "avatars.json"), "r") as file:
        avatars = json.load(file)
    return JSONResponse(avatars)

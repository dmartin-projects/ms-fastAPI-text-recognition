from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import pathlib,os

# talling fastAPI where to find out a templtes

BASE_DIR = os.path.dirname(__file__)
templates = Jinja2Templates(directory=os.path.join(BASE_DIR,'templates'))

app = FastAPI()

@app.get('/', response_class=HTMLResponse)
def home_view(request:Request):
    return templates.TemplateResponse('home_view/home.html', {"request":request, "name":"david"})


@app.post('/')
def home_detail_view():
    return {"hello":"world"}


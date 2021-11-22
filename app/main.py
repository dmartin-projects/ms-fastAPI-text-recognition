from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import pathlib,os


from pydantic import BaseSettings

from functools import lru_cache

class Settings(BaseSettings):
    debug:bool= False
    name:str
    class Config:
        env_file = 'app/.env'

# according to official doc this is the most efficient way to initialize these settings
# with this decorator we make sure this is gonna call one time 
@lru_cache
def get_settings():
    return Settings()

# talling fastAPI where to find out a templtes

BASE_DIR = os.path.dirname(__file__)
templates = Jinja2Templates(directory=os.path.join(BASE_DIR,'templates'))

app = FastAPI()

@app.get('/', response_class=HTMLResponse)
def home_view(request: Request, settings:Settings = Depends(get_settings)):
    print(settings.name)
    print(settings.debug)
    return templates.TemplateResponse('home_view/home.html', {"request":request, "name":"david"})


@app.post('/')
def home_detail_view():
    return {"hello":"world"}


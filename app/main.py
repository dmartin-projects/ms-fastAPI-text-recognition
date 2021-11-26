from fastapi import (
    FastAPI,
    Request, 
    Depends,
    File,
    UploadFile,
    HTTPException,
    Form

    )
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
import pathlib,os,uuid,io
from PIL import Image
from pydantic import BaseSettings
from functools import lru_cache

import pytesseract

from fastapi.staticfiles import StaticFiles


class Settings(BaseSettings):
    debug:bool= False
    name:str
    echo_active: bool = False
    class Config:
        env_file = 'app/.env'

# according to official doc this is the most efficient way to initialize these settings
# with this decorator we make sure this is gonna call onece 
@lru_cache
def get_settings():
    return Settings()

# telling fastAPI where to find out our important directories 
BASE_DIR = pathlib.Path(__file__).parent
UPLOAD_DIR = BASE_DIR/'uploads'
STATIC_DIR = BASE_DIR/'static'

templates = Jinja2Templates(directory=os.path.join(BASE_DIR,'templates'))

app = FastAPI()
app.mount('/static', StaticFiles(directory=STATIC_DIR), name="static")


origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials= True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get('/', response_class=HTMLResponse)
def home_view(request: Request, settings:Settings = Depends(get_settings)):
    print(settings.name)
    print(settings.debug)
    return templates.TemplateResponse('index.html', {"request":request})


@app.post('/')
async def prediction_view(file:UploadFile=File(...),settings:Settings = Depends(get_settings)):

    bytes_str = io.BytesIO(file.file.read())

    try:
        img = Image.open(bytes_str) # converting bytes into a img if it could be all ok
    except:
        raise HTTPException(detail="invalid img", status_code=400)

    prediction_origin = pytesseract.image_to_string(img)
    prediction = [line for line in prediction_origin.split('\n') if line not in ['','\t','\f']]
    
    return {"results":prediction, "original_string":prediction_origin}


@app.post('/img-echo/', response_class=FileResponse)
async def img_echo_view(file:UploadFile=File(...),settings:Settings = Depends(get_settings)):

    if not settings.echo_active:
        raise HTTPException(detail="invalid endpoint", status_code=400)

    UPLOAD_DIR.mkdir(exist_ok=True)

    bytes_str = io.BytesIO(file.file.read())

    try:
        img = Image.open(bytes_str) # converting bytes into a img if it could be all ok
    except:
        raise HTTPException(detail="invalid img", status_code=400)

    f_name = pathlib.Path(file.filename)
    file_extention = f_name.suffix
    dest = UPLOAD_DIR/f'{uuid.uuid1()}{file_extention}'
    img.save(dest)
    return dest



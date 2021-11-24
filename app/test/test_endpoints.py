from fastapi.datastructures import UploadFile
from fastapi.testclient import TestClient
from app.main import app, BASE_DIR, UPLOAD_DIR
import os,time, shutil, io
from PIL import Image, ImageChops

client = TestClient(app)

def test_get_home_view():
    response = client.get('/')
    assert response.status_code == 200
    assert 'text/html' in response.headers['content-type']

def test_post_img_echo_view():
    img_saved_path = BASE_DIR/'img'

    for path in img_saved_path.glob('*'):

        try:
            img = Image.open(path)
        except:
            img = None
        
        response = client.post('/img-echo/',files={"file":open(path,'rb')})
        
        if img is None:
            assert response.status_code == 400
        else:
            assert response.status_code == 200
            r_stream = io.BytesIO(response.content)
            echo_img = Image.open(r_stream)
            # we are gonna compare both images original and uploaded, for that we need ImageChops
            difference = ImageChops.difference(echo_img,img).getbbox()
            assert difference is None # so is the same image

    
    shutil.rmtree(UPLOAD_DIR)

def test_post_prediction():
    
    img_saved_path = BASE_DIR/'img'

    for path in img_saved_path.glob('*'):

        try:
            img = Image.open(path)
        except:
            img = None
        
        response = client.post('/',files={"file":open(path,'rb')})
        
        if img is None:
            assert response.status_code == 400
        else:
            assert response.status_code == 200
            data = response.json()
            assert len(data.keys())==2

    
  
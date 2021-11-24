from os import path
import pathlib
import pytesseract

from PIL import Image

BASE_DIR = pathlib.Path(__file__).parent
IMG_DIR = BASE_DIR/'img'

img_path = IMG_DIR/'ingredients-1.png'


img = Image.open(img_path)

prediction = pytesseract.image_to_string(img)

print(prediction)
# Microservice to extract text from images

The goal of this project is to extract text from images using OCR (Optical Character Recognition). To get that we will use a third-library called `tesseract OCR`, but he main idea is use a machine learning algorith to extract data from images.

To deploy this ML app we will use docker.

## Dependencies - I

For this project we will use:

1. fastapi
2. gunicorn
3. uvicorn
4. jinja2

gunicorn and uvicorn can work together in production but not locally.

so we install all of it `pip install fastapi gunicorn uvicorn` and create a requirements.txt `pip freeze > requirements.txt`.

so our folder tree looks like that:

```
ms-fastapi
    |_app
        \
         |_ main.py
         |_ __init__.py
    |_ venv
    |_ .env
    |_ .gitignore
    |_ README.md
    |_ requirements

```

to run our server we use

```
uvicorn app.main:app --reload
```

## Dependencies - II

In fact we are not gonna build a REST-API since it not gonna response with a JSON but a HTML template made with `JINJA Templates`.
So to install it

`pip install jini2`

In this point we have to be aware that fastAPI has no idea about templates and HTML files because it is build to respond JSON data.

So to change that we need to import some features as `HTMLResponse`

if we implement an end-point with response_class=HTMLResponse it only must return a HTML if we try to response a JSON it will fall an error

Other important point is we need catch the resquest made to pass it as a attribute in function

```python
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os

# talling fastAPI where to find out a templtes

BASE_DIR = os.path.dirname(__file__) # /home/david/PROYECTOS/ms-fastapi/./app
templates = Jinja2Templates(directory=os.path.join(BASE_DIR,'templates'))

app = FastAPI()

@app.get('/', response_class=HTMLResponse)
def home_view(request:Request):
    return templates.TemplateResponse('home_view/home.html', {"request":request, "name":"david"})


# TemplateResponse need a context and it is the request itself
# besides it allow us to pass more data
```

Now we can create our templates

```
ms-fastapi
    |_app
        \
         |_ main.py
         |_ __init__.py
         |_ templates
            |_base.html
            |_home_view
                |_ home.html
    |_ venv
    |_ .env
    |_ .gitignore
    |_ README.md
    |_ requirements

```

base.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- Bootstrap CSS -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
      crossorigin="anonymous"
    />
    <style>
      body {
        background-color: grey;
      }
    </style>

    <title>Hello, world!</title>
  </head>
  <body class="bg-cfe text-light">
    {% block content%}
    <!--  -->
    {% endblock %}

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
      crossorigin="anonymous"
    ></script>
  </body>
</html>
```

home.html, when it extends from base.html remember that start to look out from directory we specified at main.py

` templates = Jinja2Templates(directory=os.path.join(BASE_DIR,'templates'))`

```html
{% extends 'base.html' %}
<!--  -->
{% block content %}
<div class="text-center my-5 mx-5">
  <h1>hello {{name}}</h1>
</div>
{% endblock%}
```

## Dependencies - III

We gonna implement tester using `pytest` and `requests`

```
pip install pytest requests
```

to order to run all our test with pytest we must place a `pytest.ini` file at root directory with this content:

```
[pytest]
norecursedirs = lib/* bin/* include/*
```

then we must writte a test, remenber all function must start with `test_`

test_endpoints.py

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_home_view():
    response = client.get('/')
    assert response.status_code == 200
    assert 'text/html' in response.headers['content-type']

```

![not found](img/1.png)

//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  button_extract = document.querySelector("#extractText"),
  button_createTXT = document.querySelector("#createTXT"),
  button_clearImage = document.querySelector("#clearImage"),
  input_text = document.querySelector("input[type='file']"),
  allSet = document.querySelector("#allSet"),
  input = dropArea.querySelector("input");

let file; //this is a global variable and we'll use it inside multiple functions
let myModal = new bootstrap.Modal(document.getElementById("myModal"), {});

button.onclick = () => {
  input.click(); //if user click on the button then the input also clicked
};
let modalBody = document.querySelector("#responseText");
const div = document.createElement("div");
let img = document.createElement("img");

let url, DEBUG;
DEBUG = true;

DEBUG = "https://ms-fastapi-read-text.herokuapp.com/";

if (DEBUG) {
  url = "http://127.0.0.1:8000/";
}

input.addEventListener("change", function () {
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  button_extract.classList.add("active");
  button_createTXT.classList.add("active");
  button_clearImage.classList.add("active");
  showFile(); //calling function
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  button_extract.classList.add("active");
  button_createTXT.classList.add("active");
  button_clearImage.classList.add("active");
  showFile(); //calling function
});

function showFile() {
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
  if (validExtensions.includes(fileType)) {
    //if user selected file is an image file
    let fileReader = new FileReader(); //creating new FileReader object

    // start reading our file
    fileReader.readAsDataURL(file);

    // .onload(), this event is triggered when reading is complete and success
    fileReader.onload = () => {
      let fileURL = fileReader.result; //passing user file source in fileURL variable
      // UNCOMMENT THIS BELOW LINE. I GOT AN ERROR WHILE UPLOADING THIS POST SO I COMMENTED IT
      img.innerHTML = "";
      img.src = fileURL;
      img.alt = "not found img";
      //let imgTag = `<img src="${fileURL}" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      allSet.style.display = "none";
      dropArea.appendChild(img); //adding that created img tag inside dropArea container
    };
  } else {
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
    button_extract.classList.remove("active");
    button_createTXT.classList.remove("active");
    button_clearImage.classList.remove("active");
  }
}

button_extract.addEventListener("click", (e) => {
  e.preventDefault();

  let formData = new FormData();
  formData.append("file", file, file.name);

  postData(url, formData)
    .then((response) => {
      div.innerHTML = "";
      response.results.forEach((element) => {
        const p = document.createElement("p");
        p.innerText = element;
        div.appendChild(p);
      });

      modalBody.appendChild(div);
      myModal.show();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

async function postData(url = "", data) {
  const response = await fetch(url, {
    method: "POST",
    body: data,
  });
  //console.log(response.text());
  return response.text(); // parses JSON response into native JavaScript objects
}

button_clearImage.addEventListener("click", (e) => {
  e.preventDefault();
  input_text.value = "";
  dropArea.querySelector("img").remove();
  allSet.style.display = "block";
  dropArea.classList.remove("active");
  button_extract.classList.remove("active");
  button_createTXT.classList.remove("active");
  button_clearImage.classList.remove("active");
});

button_createTXT.addEventListener("click", (e) => {
  e.preventDefault();
  let formData = new FormData();
  formData.append("file", file, file.name);

  postData(url + "create-text/", formData)
    .then((response) => {
      function download(filename, text) {
        var pom = document.createElement("a");
        pom.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(text)
        );
        pom.setAttribute("download", filename);
        pom.click();
      }

      download("text.txt", response);
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

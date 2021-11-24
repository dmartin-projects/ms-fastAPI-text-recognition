//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  button_extract = document.querySelectorAll(".send"),
  input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions

button.onclick = () => {
  input.click(); //if user click on the button then the input also clicked
};

input.addEventListener("change", function () {
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  button_extract[0].classList.add("active");
  button_extract[1].classList.add("active");
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
  button_extract[0].classList.add("active");
  button_extract[1].classList.add("active");
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
      let imgTag = `<img src="${fileURL}" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    };
  } else {
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
    button_extract[0].classList.remove("active");
    button_extract[1].classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
}

button_extract[0].addEventListener("click", (e) => {
  e.preventDefault();

  let fileReader = new FileReader(); //creating new FileReader object

  // start reading our file
  //   fileReader.readAsArrayBuffer(file);

  let formData = new FormData();
  formData.append("file", file, file.name);

  // fileReader.onload = () => {
  postData("https://ms-fastapi-read-text.herokuapp.com/", formData)
    .then((response) => console.log(response))
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
  // };
});

async function postData(url = "", data) {
  const response = await fetch(url, {
    method: "POST",
    body: data,
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

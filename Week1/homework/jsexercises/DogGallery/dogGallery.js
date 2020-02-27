
// Inside the same file write two programs: one with XMLHttpRequest, and the other with axios
// Each function should make an API call to the given endpoint: https://xkcd.com/info.0.json
// Log the received data to the console
// Render the img property into an <img> tag in the DOM
// Incorporate error handling

// STEP 1 with XMLHttpRequest
//const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//const xhr2 = new XMLHttpRequest();  
/*
const getData = () => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();   
        xhr.open('GET', "https://xkcd.com/info.0.json", true);
        xhr.send();
        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {  
            if (xhr.readyState == 4 && xhr.status == 200) {
                const dato = JSON.parse(xhr.responseText);
                resolve(dato); // We could just send dato for all the general data
            }
        }

        xhr.onerror = () => {
            reject("Something ain't going well...");
        }
    });
    return promise;
}

getData()
    .then(responseData => {
        console.log(responseData);
        loadNewElements();
    })
    .catch(err => {
        console.log(err);
    }); 
*/
// STEP 2 AXIOS

const axios = require('axios'); // We have to load in the library first

axios
  .get('https://xkcd.com/info.0.json')
  .then(responseText => {
    //const specificData = responseText.data.results[0].name.first;
    console.log(responseText.data.img);  // We could just send responseText.data for all the general data
    })
  .catch(function(error) {
    console.log("Something went wrong. Error '" + error + "' detected.");
  });
 

  function loadNewElements(){
    const div = document.querySelector(".centerSide");
    const parr1 = document.createElement("p");
    // const parr2 = document.createElement("p");
    // const img1 = document.createElement("img");
    // const img2 = document.createElement("img");

    parr1.innerHTML = "Image with XHR:"
    div.appendChild(parr1);
  }
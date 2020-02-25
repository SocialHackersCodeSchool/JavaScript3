// Write a function that makes an API call to https://www.randomuser.me/api

//     Inside the same file write two functions: one with XMLHttpRequest, and the other with axios
//     Each function should make an API call to the given endpoint: https://www.randomuser.me/api
//     Log the received data to the console
//     Incorporate error handling


// STEP 1 with XMLHttpRequest
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const getData = () => {
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();   
        xhr.open('GET', "https://www.randomuser.me/api", true);
        xhr.send();
        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {  
            if (xhr.readyState == 4 && xhr.status == 200) {
                const dato = JSON.parse(xhr.responseText);  
                const specificData = dato.results[0].name.first;
                resolve(specificData); // We could just send dato for all the general data
            }
        }

        xhr.onerror = () => {
            reject("Something ain't going well...");
        }
    });
    return promise;
}

getData()
    .then(responseData => console.log(responseData))
    .catch(err => {
        console.log(err);
    }); 

// STEP 2 AXIOS
const axios = require('axios'); // We have to load in the library first

axios
  .get('https://www.randomuser.me/api')
  .then(responseText => {
    const specificData = responseText.data.results[0].name.first;
    console.log(specificData);  // We could just send responseText.data for all the general data
    })
  .catch(function(error) {
    console.log("Something went wrong. Error " + error + " destected.");
  });

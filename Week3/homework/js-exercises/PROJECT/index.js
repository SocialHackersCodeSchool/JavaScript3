'use strict';

{
  //JS3-2 START Select Listener
  const selectEl = document.querySelector("#repositories");
  selectEl.addEventListener("change", (event) => {
    displaySelectedRepo(event.target.value);
    displayContributors(event.target.value);  //JS3-2 After all the Li Elements are created keeps only the selected one visible.
  });

  //JS3-2 END Select Listener
  /* JS3-2 Modified function (Now with fetch)
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 299) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  } */

  //JS3-3 START New fetchJSON function that uses fetch instead of xhr, and async functions
  async function fetchJSON(url, cb) {
    try {
      console.log("Reached point");
      const res = await axios.get(url);
      cb(null, res.data);
      fetchContributors(contributorsURLArray)  //JS3-3 After the repos, comes the list of contributors
    } catch(err){
      cb(new Error(`Network error.`));
    }
  } 
  //JS3-2 END

  //JS3-2 START New  function that uses fetch instead of xhr
  async function fetchContributors(contrData) {
    try{
    await Promise.all(contrData.map(async function(dato) {
      let res = await axios.get(dato.url);
      contributorsAux(null, res.data, dato.id);
    }))
    } catch(err){
      console.log("One URL failed...");
    }
  }
  //JS3-2 END

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);

    Object.entries(options).forEach(([key, value]) => {
      // JS3-1 START Modified Lines
      if (key === 'errText') {
        elem.innerHTML = value;
      } else {
        const innerSpan = document.createElement("span");
        const innerLink = document.createElement("a");
        if (key === 'text') {
          innerSpan.innerHTML += "<strong>Repository:</strong>  ";
          innerLink.target = "_blank";
          innerLink.innerText = value;
          innerLink.href = options.url;
          innerSpan.appendChild(innerLink);
          innerSpan.innerHTML += "<br/>";
        } else if (key === 'desc') {
          innerSpan.innerHTML += "<strong>Description:</strong> " + value + "<br/>";
        } else if (key === 'forks') {
          innerSpan.innerHTML += "<strong>Forks:</strong>           " + value + "<br/>";
        } else if (key === 'update') {
          innerSpan.innerHTML += "<strong>Update:</strong>        " + formatDate(value);
        } else if (key === 'url') {
          //displaySelectedRepo();
        }
        // JS3-1 END Modified Lines
        else {
          elem.setAttribute(key, value);
        }
        elem.appendChild(innerSpan);
      }
    });
    parent.appendChild(elem);
    return elem;
  }

  //JS3-2 Function that creates and append only for contributors
  function createAndAppendContributors(name, parent, options = {}) {
    const elem = document.createElement(name);
    const contrDiv = document.createElement("div");
    contrDiv.setAttribute("class", "contributorData");
    const contributorURL = options.url;

    Object.entries(options).forEach(([key, value]) => {
      const innerSpan = document.createElement("span");
      const innerLink = document.createElement("a");
      
      if (key === 'img') {
        const contImage = document.createElement("img");
        contImage.src = value;
        contrDiv.appendChild(contImage);
      } else if (key === 'text') {
        const innerSpan = document.createElement("span");
        const innerLink = document.createElement("a");
        innerLink.target = "_blank";
        innerLink.innerText = value;
        innerLink.href = contributorURL;
        innerSpan.appendChild(innerLink);
        contrDiv.appendChild(innerSpan);
      } else if (key === 'contr') {
        const innerSpan = document.createElement("span");
        innerSpan.setAttribute("class", "numberContributions");
        innerSpan.innerHTML = value;
        contrDiv.appendChild(innerSpan);
      }
    });
    elem.appendChild(contrDiv);
    parent.appendChild(elem);
    return elem;
  }

  // JS3-1 Modified line
  function renderRepoDetails(repo, ul) {
    contributorsURLArray.push({id: repo.id, url: repo.contributors_url});  //JS3-2 The contributors Array receives a new url.
    createAndAppend('li', ul, {
      text: repo.name, desc: repo.description, forks: repo.forks,
      update: repo.updated_at, url: repo.html_url
    });
  }

  // JS3-2 New Function that adds the li's for the contributors
  function renderRepoContributorDetails(repo, ul) {
    createAndAppendContributors('li', ul, {
      img: repo.avatar_url, text: repo.login, contr: repo.contributions, url: repo.html_url
    });
  }

  // JS3-1 START Function that formats the Dates
  function formatDate(sentDate) {
    let date = new Date(sentDate);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    const strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + ",  " + strTime;
  }
  // JS3-1 END
  // JS3-1 START Function that sorts an array alphabetically
  function sortArray(arrayToSort) {
    arrayToSort.sort(function (a, b) {
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      }
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    return arrayToSort;
  }
  // JS3-1 END
  // JS3-2 START Function that populates the Select Element
  function populateSelect(repos){
    selectEl.innerHTML = "";
    repos.forEach((repo, i) => {
      repositoriesOrder.push(repo.id);   // Here the reporitories of the ID's are stored in alphabetical order
      selectEl.innerHTML += `<option value="${i}">${repo.name}</option>`;
    })
  }
  // JS3-1 END

    // JS3-2 START Function that verifies the position of the UL to be stored
    function positionID(repositoryID, URLId){
      let finalId = 0;
      repositoryID.forEach((repo, i) => {
        if(repo === URLId)
          finalId = i;
      })
      return finalId;
    }
    // JS3-1 END

  // JS3-2 START Function that displays the selected Element
  function displaySelectedRepo(value = 0){
    const liEls = document.querySelectorAll(".repo-container li");
    if(liEls.length > 0){
      liEls.forEach(listelement => {
        listelement.style.display = "none";
      })
      liEls[value].style.display = "block";
    } else
      console.log("Houston, we got a problem...");
  }
  // JS3-2 END

  // JS3-2 START Function that displays the selected Element contributors
  function displayContributors(value = 0){
    if(contributorsUl.length > 0){
      contributorsUl.forEach(listelement => {
        listelement.style.display = "none";
      })
      contributorsUl[value].style.display = "block";
    } else
      console.log("Houston, we got a problem...");
  }
  // JS3-2 END
  
  //JS3-2 Auxiliary function for the contributors display
  function contributorsAux(err, contributors, id){
    const root = document.querySelector('.contributors-container');
    if (err) {
      return new Error("A contributor URL failed...");
    }
    const ul = createAndAppend('ul', root);
    contributorsUl[positionID(repositoriesOrder, id)] = ul;
    contributors.forEach(contributor => renderRepoContributorDetails(contributor, ul));
    displayContributors();  //JS3-2 After all the Li Elements are created, it keeps only the selected one visible.
  }

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.querySelector('.repo-container');
      if (err) {
        createAndAppend('div', root, {
          errText: err.message,   //JS3-1 Modified Line
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      repos = sortArray(repos);  //JS3-1 Sort the array of objects before displaying them
      populateSelect(repos);  //JS3-2 Populate the Select element.
      repos.forEach(repo => renderRepoDetails(repo, ul));
      displaySelectedRepo();  //JS3-2 After all the Li Elements are created keeps only the selected one visible.
      //fetchJSONContributors(contributorsURLArray)  //JS3-2 After the repos, comes the list of contributors
    });
  }

  let repositoriesOrder= [];
  let contributorsUl = [];  //JS3-2 List of Ul of contributors
  let contributorsURLArray = [];  //JS3-2 Contributors URL Array
  const HYF_REPOS_URL =
    'https://api.github.com/orgs/HackYourFuture/repos?per_page=10';
    window.onload = () => main(HYF_REPOS_URL);
}

'use strict';

{
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
  }

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
          console.log(innerSpan.innerHTML);
        }
        // JS3-1 END Modified Lines
        else {
          elem.setAttribute(key, value);
        }
        elem.appendChild(innerSpan);
      }
    });
    parent.appendChild(elem);
    //elem.innerHTML += "</span>";  // JS3-1 Modified Line
    return elem;
  }

  // JS3-1 Modified line
  function renderRepoDetails(repo, ul) {
    createAndAppend('li', ul, {
      text: repo.name, desc: repo.description, forks: repo.forks,
      update: repo.updated_at, url: repo.html_url
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
  // JS3-1 START Function that sorts th array
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

  function main(url) {
    fetchJSON(url, (err, repos) => {
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, {
          errText: err.message,   //JS3-1 Modified Line
          class: 'alert-error',
        });
        return;
      }
      const ul = createAndAppend('ul', root);
      repos = sortArray(repos);  //JS3-1 Sort the array of objects before displaying them
      repos.forEach(repo => renderRepoDetails(repo, ul));
    });
  }

const HYF_REPOS_URL =
  'https://api.github.com/orgs/HackYourFuture/repos?per_page=10';
  window.onload = () => main(HYF_REPOS_URL);
}

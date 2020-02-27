'use strict';

{
  const { createAndAppend } = window.Util;

  class RepoView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.selectedRepo);
      }
    }

    /**
     * Renders the repository details.
     * @param {Object} repo A repository object.
     */
    render(repos) {
      // TODO: replace this comment and the console.log with your own code
      const root = document.querySelector('#root');
      this.refreshElements(root);  
      const ul = this.createAndAppend('ul', root);
      this.createAndAppend('li', ul, {
        text: repos.name, desc: repos.description, forks: repos.forks,
        update: repos.updated_at, url: repos.html_url
      });
    }

    refreshElements(root){
      const ulArray = document.querySelectorAll("ul");
      if(ulArray.length > 0){
        ulArray.forEach(ulElement => root.removeChild(ulElement))
      }
    }

    createAndAppend(name, parent, options = {}) {
      const elem = document.createElement(name);
  
      Object.entries(options).forEach(([key, value]) => {
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
          innerSpan.innerHTML += "<strong>Update:</strong>        " + this.formatDate(value);
        } else if (key === 'url') {
        } else {
          elem.setAttribute(key, value);
        }
        elem.appendChild(innerSpan);
      });
      parent.appendChild(elem);
      return elem;
    }
    
    formatDate(sentDate) {
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

  }

  window.RepoView = RepoView;
}

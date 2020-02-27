'use strict';

{
  const { createAndAppend } = window.Util;

  class ContributorsView {
    constructor(container) {
      this.container = container;
    }

    update(state) {
      if (!state.error) {
        this.render(state.contributors);
      }
    }

    /**
     * Renders the list of contributors
     * @param {Object[]} contributors An array of contributor objects
     */
    render(contributors) {
      // TODO: replace this comment and the console.log with your own code
      console.log('ContributorsView', contributors);
      const root = document.querySelector('#root');

      const ul = document.createElement("ul");
      root.appendChild(ul);
      contributors.forEach(contributor => this.renderRepoContributorDetails(contributor, ul));
    }

    renderRepoContributorDetails(repo, ul) {
      this.createAndAppendContributors('li', ul, {
        img: repo.avatar_url, text: repo.login, contr: repo.contributions, url: repo.html_url
      });
    }

    createAndAppendContributors(name, parent, options = {}) {
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

  }

  window.ContributorsView = ContributorsView;
}

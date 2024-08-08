document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = ``;
    const myToken = '';

    console.log("Fetching repositories...");

    fetch(apiUrl, {
        method: 'GET', 
        headers: {
            'Authorization': `token ${myToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error('GitHub API returned an error: ' + JSON.stringify(err));
            });
        }
        return response.json();
    })
    .then(repos => {
      if (!Array.isArray(repos)) {
        throw new Error('Expected an array of repositories, but got:', repos);
      }
      console.log(`Fetched ${repos.length} repositories.`);
      repos.forEach(repo => {
        console.log(`Fetching README for repo: ${repo.name}`);
        fetch(repo.contents_url.replace('{+path}', 'README.md'), {
            method: 'GET',
            headers: {
                'Authorization': `token ${myToken}`,
                'Accept': 'application/vnd.github.v3.raw'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch README: ' + response.statusText);
            }
            return response.text();
        })
        .then(readmeContent => {
          const gifUrl = extractGifUrl(readmeContent);
          if (gifUrl) {
            console.log(`Found GIF URL in ${repo.name}: ${gifUrl}`);
            const rawUrl = gifUrl.replace('https://github.com', 'https://raw.githubusercontent.com').replace('/blob', '');
            displayRepository(repo, rawUrl);
          } else {
            console.log(`No GIF found in ${repo.name}`);
          }
        })
        .catch(error => console.error('Error fetching README:', error));
      });
    })
    .catch(error => console.error('Error fetching repositories:', error));
});

function extractGifUrl(markdownContent) {
    // This matches Markdown image syntax and HTML <img> tags with .gif
    const gifRegex = /!\[[^\]]*\]\((.*?.gif)\)|<img[^>]+src=["']([^"']*.gif)["']/g;
    let matches, urls = [];
    while ((matches = gifRegex.exec(markdownContent)) !== null) {
        // This will push the first captured group (Markdown) or second captured group (HTML) if it exists
        urls.push(matches[1] || matches[2]);
    }
    return urls.length > 0 ? urls[0] : null; // Return the first found URL, or null if none found
}

function displayRepository(repo, gifPath) {
    const projectsContainer = document.querySelector('.projects-container');
    if (projectsContainer) {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';

        projectDiv.innerHTML = `
            <h3>${repo.name}</h3>
            <img src="${gifPath}" alt="GIF in README of ${repo.name}" style="max-width: 100%; height: auto;">
            <a href="${repo.html_url}" target="_blank">View on GitHub</a>
        `;
        projectsContainer.appendChild(projectDiv);
        console.log(`Added ${repo.name} with GIF to the projects section.`);
    } else {
        console.error("Projects container not found!");
    }
}
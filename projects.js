const apiUrl = '__API_URL__';
const myToken = '__MY_TOKEN__';
document.addEventListener('DOMContentLoaded', function() {

    const ignoreRepos = ['doyoojk','iCounsel'];

    console.log("Fetching repositories...");
    console.log("API URL:", apiUrl);
    console.log("Token:", myToken);

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
        if (ignoreRepos.includes(repo.name)) {
            return;
        }
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
          const imageUrls = extractImageUrl(readmeContent);
          if (imageUrls.length > 0) {
            const firstImageUrl = imageUrls[0];
            const rawUrl = firstImageUrl.replace('https://github.com', 'https://raw.githubusercontent.com').replace('/blob', '');
            console.log(rawUrl);
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

function extractImageUrl(markdownContent) {
    // This regex matches Markdown image syntax and HTML <img> tags with common image file extensions
    const imageRegex = /!\[[^\]]*\]\((.*?\.(gif|jpg|jpeg|png|bmp))\)|<img[^>]+src=["']([^"']+?\.(gif|jpg|jpeg|png|bmp))["']/gi;
    let matches, urls = [];
    while ((matches = imageRegex.exec(markdownContent)) !== null) {
        // This will push the first captured group (Markdown) or third captured group (HTML) if it exists
        urls.push(matches[1] || matches[3]);
    }
    return urls; // Return all found URLs
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

document.addEventListener('DOMContentLoaded', function() {
    Papa.parse('data/experience.csv', {
        download: true,
        header: false, // CSV doesn't have a header row to treat as object keys
        complete: function(results) {
            console.log("Parsing complete:", results); // Log entire results object
            const data = results.data;

            // Extract the row data from CSV
            const tabNames = data[0].slice(1); // First row contains tab names
            const headers = data[1].slice(1); // Second row contains content headers
            const dates = data[2].slice(1); // Third row contains content dates
            const descriptions = data[3].slice(1); // Fourth row contains content descriptions

            tabNames.forEach((tabName, index) => {
                const header = headers[index] || 'No Header';
                const date = dates[index] || 'No Date';
                let description = descriptions[index] || 'No Description';

                // Add newline before each bullet point
                description = description.replace(/-\s+/g, '<br>- ');

                console.log(`Tab: ${tabName}, Header: ${header}, Date: ${date}, Description: ${description}`); // Debug log

                // Create a content div for each experience
                const contentDiv = document.createElement('div');
                contentDiv.id = tabName.replace(/\s+/g, ''); // Remove spaces for valid ID
                contentDiv.className = 'tab-content';
                contentDiv.style.display = 'none'; // Hide all except the first by default

                contentDiv.innerHTML = `
                    <class="content-header">
                        <span class="header-text">${header}</span>
                        <span class="date-text">${date}</span>
                    </div>
                    <div class="content-description">${description}</div>
                `;

                // Append the new div to the experience container
                document.querySelector('.experience-panel').appendChild(contentDiv);

                // Create a button with an icon for each tab
                const tabButton = document.createElement('button');
                tabButton.className = 'tab-button';
                tabButton.onclick = function(evt) {
                    openTab(evt, contentDiv.id);
                };

                // Add the icon and text to the button
                const icon = document.createElement('img');
                icon.src = '/data/folder.svg'; // Path to the icon
                icon.alt = 'Folder Icon';

                // Append the icon and text to the button
                tabButton.appendChild(icon);
                tabButton.appendChild(document.createTextNode(tabName));

                document.querySelector('.tabs').appendChild(tabButton);
            });

            // Display the first tab by default
            if (tabNames.length > 0) {
                const firstTab = tabNames[0].replace(/\s+/g, '');
                document.getElementById(firstTab).style.display = 'block';
                document.querySelector('.tab-button').classList.add('active');
            }
        },
        error: function(error) {
            console.error('Error loading the CSV data:', error);
        }
    });
});

function openTab(evt, tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = 'none';
    }

    // Remove 'active' class from all tabs
    const tabs = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(' active', '');
    }

    // Show the current tab and add 'active' class to the clicked tab button
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

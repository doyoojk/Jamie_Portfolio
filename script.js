let lastMouseX = 0;
let lastMouseY = 0;
const cursorEffect = document.getElementById('cursor-effect');
const homeSection = document.getElementById('home');

// Update cursor effect position based on mouse position
const updateCursorEffectPosition = () => {
    cursorEffect.style.left = `${lastMouseX + window.scrollX}px`;
    cursorEffect.style.top = `${lastMouseY + window.scrollY}px`;
};

// Function to fade out the existing maze and ghosts
const fadeOutMazeAndGhosts = (callback) => {
    const mazePaths = document.querySelectorAll('.maze-path');
    const ghosts = document.querySelectorAll('.ghost-area');
    
    mazePaths.forEach(path => path.style.opacity = 0);
    ghosts.forEach(ghost => ghost.style.opacity = 0);
    
    // Wait for the fade-out transition to complete before executing the callback
    setTimeout(callback, 500); // Duration matches CSS transition duration
};

// Initialize sections' top offsets
const sections = document.querySelectorAll('.section');
let sectionOffsets = [];

const updateSectionOffsets = () => {
    const buffer = 100; // Adjust this value as needed
    sectionOffsets = Array.from(sections).map(section => {
        const style = window.getComputedStyle(section);
        const marginTop = parseInt(style.marginTop, 10) || 0;
        const marginBottom = parseInt(style.marginBottom, 10) || 0;
        const offsetTop = section.offsetTop;
        return {
            start: offsetTop - marginTop - buffer, // Adjust for top margin and buffer
            end: offsetTop + section.offsetHeight + marginBottom - buffer // Adjust for bottom margin and buffer
        };
    });
};

let currentSectionIndex = 0;

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


//                                 EVENT LISTENERS 
// Scroll event listener
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrollY = window.scrollY;
    const documentHeight = document.body.scrollHeight - window.innerHeight;
    const ratio = scrollY / documentHeight;

    // Calculate intermediate color between #19141F and #4D637C
    const startColor = { r: 25, g: 20, b: 31 };
    const endColor = { r: 77, g: 99, b: 124 };
    const newColor = {
        r: Math.round(startColor.r + (endColor.r - startColor.r) * ratio),
        g: Math.round(startColor.g + (endColor.g - startColor.g) * ratio),
        b: Math.round(startColor.b + (endColor.b - startColor.b) * ratio),
    };
    const newColorHex = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`;

    header.style.backgroundColor = newColorHex;

    // Update cursor effect position on scroll
    updateCursorEffectPosition();

    // Check if the user has scrolled into a new section
    for (let i = 0; i < sectionOffsets.length; i++) {
        if (scrollY >= sectionOffsets[i].start && scrollY < sectionOffsets[i].end) {
            if (i !== currentSectionIndex) {
                currentSectionIndex = i;
                regenerateGhosts();
            }
            break;
        }
    }
});

// Mousemove event listener
document.addEventListener('mousemove', (e) => {
    cursorEffect.style.opacity = 1; // Show the cursor effect
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    // Update cursor effect position on mouse move
    updateCursorEffectPosition();
});

window.addEventListener('load', () => {
    updateSectionOffsets(); // Initial calculation of section offsets
    const grid = createMazePaths();
    createGhostAreas(grid);
});
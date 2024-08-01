let lastMouseX = 0;
let lastMouseY = 0;
const cursorEffect = document.getElementById('cursor-effect');
const homeSection = document.getElementById('home');

// Update cursor effect position based on mouse position
const updateCursorEffectPosition = () => {
    cursorEffect.style.left = `${lastMouseX + window.scrollX}px`;
    cursorEffect.style.top = `${lastMouseY + window.scrollY}px`;
};

// Fade out the cursor effect
const fadeOutCursorEffect = () => {
    cursorEffect.style.opacity = 0; // Fade out
};

// Fade in the cursor effect
const fadeInCursorEffect = () => {
    cursorEffect.style.opacity = 1; // Fade in
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

// Function to regenerate ghosts with a fade-in effect
const regenerateGhosts = () => {
    fadeOutMazeAndGhosts(() => {
        document.querySelectorAll('.ghost-area').forEach(ghost => ghost.remove());
        const grid = createMazePaths(); // Optionally recreate maze paths as well
        createGhostAreas(grid);

        // Ensure the CSS handles the initial opacity for fade-in
        const mazePaths = document.querySelectorAll('.maze-path');
        const ghosts = document.querySelectorAll('.ghost-area');
        
        // Fade in using CSS transition
        mazePaths.forEach(path => path.style.opacity = '0.6');
        ghosts.forEach(ghost => ghost.style.opacity = '');
    });
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

    // // Check if the scroll position is below the top of the skills section
    // const homeSectionBottom = homeSection.offsetHeight + parseInt(window.getComputedStyle(homeSection).marginBottom, 10);
    // if (scrollY >= homeSectionBottom) {
    //     fadeOutCursorEffect();
    // } else {
    //     fadeInCursorEffect();
    // }

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
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    // Update cursor effect position on mouse move
    updateCursorEffectPosition();
});

function createMazePaths() {
    const mazeBackground = document.getElementById('maze-background');
    mazeBackground.innerHTML = ''; // Clear existing paths

    const cellSize = 80;
    const rows = Math.ceil(window.innerHeight / cellSize);
    const cols = Math.ceil(window.innerWidth / cellSize);
    
    // Create a grid to track open and closed paths
    const grid = Array(rows).fill().map(() => Array(cols).fill(1));

    // Function to check if a cell is within bounds
    const isValid = (row, col) => row >= 0 && row < rows && col >= 0 && col < cols;

    // Randomly block some paths
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (Math.random() < 0.35 && // 35% chance to block a cell
                !(row === 1 && col === 1) && // Keep the top-left corner open
                !(row % 2 === 1 && col % 2 === 1)) { // Keep intersections open for ghosts
                grid[row][col] = 0;
                
                // Block adjacent cells to create larger walls
                [[0, 1], [1, 0], [0, -1], [-1, 0]].forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (isValid(newRow, newCol) && Math.random() < 0.7) {
                        grid[newRow][newCol] = 0;
                    }
                });
            }
        }
    }

    // Ensure there's always a path
    for (let row = 1; row < rows; row += 2) {
        for (let col = 1; col < cols; col += 2) {
            grid[row][col] = 1;
        }
    }

    // Create vertical paths
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            if (grid[row][col]) {
                const path = document.createElement('div');
                path.className = 'maze-path';
                path.style.left = `${col * cellSize}px`;
                path.style.top = `${row * cellSize}px`;
                path.style.width = '4px';
                path.style.height = `${cellSize}px`;
                mazeBackground.appendChild(path);
            }
        }
    }

    // Create horizontal paths
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col]) {
                const path = document.createElement('div');
                path.className = 'maze-path';
                path.style.top = `${row * cellSize}px`;
                path.style.left = `${col * cellSize}px`;
                path.style.height = '4px';
                path.style.width = `${cellSize}px`;
                mazeBackground.appendChild(path);
            }
        }
    }

    // Add dots
    for (let row = 1; row < rows - 1; row++) {
        for (let col = 1; col < cols - 1; col++) {
            if (grid[row][col]) {
                const dot = document.createElement('div');
                dot.className = 'maze-dot';
                dot.style.left = `${col * cellSize - 2}px`;
                dot.style.top = `${row * cellSize - 2}px`;
                mazeBackground.appendChild(dot);
            }
        }
    }

    return grid;
}

function createGhostAreas(grid) {
    const ghostCount = 4;
    const main = document.querySelector('main');
    const cellSize = 80;  // Match this with your cell size in the maze
    const ghostSize = 45; // Ensure ghostSize < cellSize to fit nicely
    const ghostClasses = ['ghost-red', 'ghost-pink', 'ghost-cyan', 'ghost-orange'];

    for (let i = 0; i < ghostCount; i++) {
        const ghost = document.createElement('div');
        ghost.className = `ghost-area ${ghostClasses[i]}`; // Assign a unique class
        main.appendChild(ghost);
        
        // Find an open cell to place the ghost
        let x, y;
        do {
            x = Math.floor(Math.random() * grid[0].length);
            y = Math.floor(Math.random() * grid.length);
        } while (!grid[y][x]);  // Ensure it's an open cell (not blocked)
        
        // Calculate the centered position within the cell
        const centerX = x * cellSize + (cellSize - ghostSize) / 2;
        const centerY = y * cellSize + (cellSize - ghostSize) / 2;
        
        ghost.style.left = `${centerX}px`;
        ghost.style.top = `${centerY}px`;
        ghost.style.width = `${ghostSize}px`;
        ghost.style.height = `${ghostSize}px`;
    }
}


window.addEventListener('load', () => {
    updateSectionOffsets(); // Initial calculation of section offsets
    const grid = createMazePaths();
    createGhostAreas(grid);
});
let lastMouseX = 0;
let lastMouseY = 0;
const cursorEffect = document.getElementById('cursor-effect');
const homeSection = document.getElementById('home');
const skillsSection = document.getElementById('skills');

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

    // Check if the scroll position is below the top of the skills section
    const homeSectionBottom = homeSection.offsetHeight + parseInt(window.getComputedStyle(homeSection).marginBottom);
    if (scrollY >= homeSectionBottom) {
        fadeOutCursorEffect();
    } else {
        fadeInCursorEffect();
    }

    // Update cursor effect position on scroll
    updateCursorEffectPosition();
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
    const cellSize = 40;
    const rows = Math.ceil(window.innerHeight / cellSize);
    const cols = Math.ceil(window.innerWidth / cellSize);
    
    // Create a grid to track open and closed paths
    const grid = Array(rows).fill().map(() => Array(cols).fill(1));

    // Function to check if a cell is within bounds
    const isValid = (row, col) => row >= 0 && row < rows && col >= 0 && col < cols;

    // Randomly block some paths
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (Math.random() < 0.4 && // 40% chance to block a cell
                !(row === 1 && col === 1)) { // Keep the top-left corner open
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
    const cellSize = 40;
    
    for (let i = 0; i < ghostCount; i++) {
        const ghost = document.createElement('div');
        ghost.className = 'ghost-area';
        main.appendChild(ghost);
        
        // Find an open cell to place the ghost
        let x, y;
        do {
            x = Math.floor(Math.random() * grid[0].length);
            y = Math.floor(Math.random() * grid.length);
        } while (!grid[y][x]);
        
        ghost.style.left = `${x * cellSize}px`;
        ghost.style.top = `${y * cellSize}px`;
    }
}

window.addEventListener('load', () => {
    const grid = createMazePaths();
    createGhostAreas(grid);
});

window.addEventListener('resize', () => {
    // Remove existing paths and ghosts
    const mazeBackground = document.getElementById('maze-background');
    mazeBackground.innerHTML = '';
    document.querySelectorAll('.ghost-area').forEach(ghost => ghost.remove());
    
    // Recreate paths and ghosts
    const grid = createMazePaths();
    createGhostAreas(grid);
});
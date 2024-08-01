function createMazePaths() {
    const mazeBackground = document.getElementById('maze-background');
    mazeBackground.innerHTML = ''; // Clear existing paths

    const cellSize = 80;
    const rows = Math.ceil(window.innerHeight / cellSize);
    const cols = Math.ceil(window.innerWidth / cellSize);

    const grid = Array(rows).fill().map(() => Array(cols).fill(1));

    const isValid = (row, col) => row >= 0 && row < rows && col >= 0 && col < cols;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (Math.random() < 0.35 &&
                !(row === 1 && col === 1) &&
                !(row % 2 === 1 && col % 2 === 1)) {
                grid[row][col] = 0;

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

    for (let row = 1; row < rows; row += 2) {
        for (let col = 1; col < cols; col += 2) {
            grid[row][col] = 1;
        }
    }

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
    const cellSize = 80;
    const ghostSize = 45;
    const ghostClasses = ['ghost-red', 'ghost-pink', 'ghost-cyan', 'ghost-orange'];

    const currentSection = sections[currentSectionIndex];
    const sectionStartY = currentSection.offsetTop;
    const sectionEndY = sectionStartY + currentSection.offsetHeight;

    for (let i = 0; i < ghostCount; i++) {
        const ghost = document.createElement('div');
        ghost.className = `ghost-area ${ghostClasses[i]}`;
        main.appendChild(ghost);

        let x, y, centerY;
        let attempts = 0;
        do {
            x = Math.floor(Math.random() * grid[0].length);
            y = Math.floor(Math.random() * grid.length);
            centerY = y * cellSize + (cellSize - ghostSize) / 2 + sectionStartY;
            attempts++;
            if (attempts > 100) break;

        } while (!grid[y][x] || centerY < sectionStartY || centerY > sectionEndY);

        const centerX = x * cellSize + (cellSize - ghostSize) / 2;

        ghost.style.left = `${centerX}px`;
        ghost.style.top = `${centerY}px`;
        ghost.style.width = `${ghostSize}px`;
        ghost.style.height = `${ghostSize}px`;
    }
}

function regenerateGhosts() {
    fadeOutMazeAndGhosts(() => {
        document.querySelectorAll('.ghost-area').forEach(ghost => ghost.remove());
        const grid = createMazePaths();
        createGhostAreas(grid);

        const mazePaths = document.querySelectorAll('.maze-path');
        const ghosts = document.querySelectorAll('.ghost-area');

        mazePaths.forEach(path => path.style.opacity = '0.6');
        ghosts.forEach(ghost => ghost.style.opacity = '');
    });
}



let rows = 10;
let cols = 10;
let mineCount = 10;
let grid = [];
let revealedCount = 0;
const gameContainer = document.getElementById('game');
const messageDiv = document.getElementById('message');

function createGrid() {
    gameContainer.innerHTML = '';
    grid = [];
    revealedCount = 0;
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', onCellClick);
            gameContainer.appendChild(cell);
            grid[r][c] = { mine: false, revealed: false, element: cell, count: 0 };
        }
    }

    let placed = 0;
    while (placed < mineCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!grid[r][c].mine) {
            grid[r][c].mine = true;
            placed++;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            grid[r][c].count = countNeighborMines(r, c);
        }
    }

    clearMessage();
}

function countNeighborMines(r, c) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = r + dr;
            let nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (grid[nr][nc].mine) count++;
            }
        }
    }
    return count;
}

function onCellClick(e) {
    let r = parseInt(this.dataset.row);
    let c = parseInt(this.dataset.col);
    revealCell(r, c);
}

function revealCell(r, c) {
    let cell = grid[r][c];
    if (cell.revealed) return;

    cell.revealed = true;
    revealedCount++;
    cell.element.classList.add('revealed');

    if (cell.mine) {
        cell.element.textContent = '💣';
        showMessage('💥 Game Over!');
        revealAll();
        return;
    }

    if (cell.count > 0) {
        cell.element.textContent = cell.count;
    } else {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                let nr = r + dr;
                let nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    revealCell(nr, nc);
                }
            }
        }
    }

    // Win condition
    if (revealedCount === rows * cols - mineCount) {
        showMessage('🎉 You Cleared the Minefield!');
        revealAll();
    }
}

function revealAll() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cell = grid[r][c];
            if (cell.revealed) continue;
            cell.revealed = true;
            cell.element.classList.add('revealed');
            if (cell.mine) {
                cell.element.textContent = '💣';
            } else if (cell.count > 0) {
                cell.element.textContent = cell.count;
            }
        }
    }
}

function setDifficulty(size, mines) {
    rows = size;
    cols = size;
    mineCount = mines;
    createGrid();
}

function resetGame() {
    createGrid();
}

function showMessage(msg) {
    messageDiv.textContent = msg;
    messageDiv.style.animation = 'none';
    void messageDiv.offsetWidth; // force reflow
    messageDiv.style.animation = null;
}

function clearMessage() {
    messageDiv.textContent = '';
}

// Initialize
createGrid();

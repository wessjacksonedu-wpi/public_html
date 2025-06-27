const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

const scale = 20;
const rows = canvas.height / scale;
const cols = canvas.width / scale;

let snake;
let food;
let score;
let gameInterval;
let direction;

// Initialize the game state
function init() {
    // Starting with 3 segments horizontally at positions (10,10), (9,10), (8,10)
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };   // Start moving right immediately
    placeFood();
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    messageDisplay.textContent = '';
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}


// Place food in a random location not on the snake
function placeFood() {
    food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
    };
    // If food spawns on snake, reposition it
    if (snake.some(seg => seg.x === food.x && seg.y === food.y)) {
        placeFood();
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = '#4caf50';
    snake.forEach((segment, i) => {
        ctx.fillStyle = i === 0 ? '#a5d6a7' : '#4caf50'; // lighter head
        ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
        ctx.strokeStyle = '#2e7d32';
        ctx.strokeRect(segment.x * scale, segment.y * scale, scale, scale);
    });

    // Draw food
    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.arc(food.x * scale + scale/2, food.y * scale + scale/2, scale/2 - 2, 0, Math.PI * 2);
    ctx.fill();
}

// Game loop
function gameLoop() {
    // Update snake position
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Check for wall collision
    if (
        head.x < 0 || head.x >= cols ||
        head.y < 0 || head.y >= rows
    ) {
        return gameOver();
    }

    // Check for self collision
    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        return gameOver();
    }

    snake.unshift(head);

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        placeFood();
    } else {
        snake.pop();
    }

    draw();
}

// Game over
function gameOver() {
    messageDisplay.textContent = 'Game Over! Press Restart.';
    clearInterval(gameInterval);
}

// Handle key presses
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y !== 1) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y !== -1) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x !== 1) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x !== -1) direction = { x: 1, y: 0 };
            break;
    }
});

// Restart button
restartBtn.addEventListener('click', () => {
    init();
});

// Start the game
init();

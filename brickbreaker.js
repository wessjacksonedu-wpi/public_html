const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const startBtn = document.getElementById('startBtn');

const paddleHeight = 15;
const paddleWidth = 100;
let paddleX;

const ballRadius = 10;
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;

const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 35;

let bricks = [];
let score = 0;
let lives = 3;
let isGameRunning = false;

function initBricks() {
    bricks = [];
    for(let c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(let r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function resetGame() {
    paddleX = (canvas.width - paddleWidth) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height - paddleHeight - ballRadius - 10;
    ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = -5;
    score = 0;
    lives = 3;
    isGameRunning = true;
    messageDisplay.textContent = '';
    scoreDisplay.textContent = 'Score: 0';
    initBricks();
    draw();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    const gradient = ctx.createRadialGradient(ballX, ballY, 5, ballX, ballY, ballRadius);
    gradient.addColorStop(0, '#00ffff');
    gradient.addColorStop(1, '#004d4d');
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = `hsl(${(c * 40 + r * 20) % 360}, 80%, 60%)`;
                ctx.shadowColor = `hsl(${(c * 40 + r * 20) % 360}, 80%, 70%)`;
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            const b = bricks[c][r];
            if(b.status === 1) {
                if(ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    ballSpeedY = -ballSpeedY;
                    b.status = 0;
                    score += 10;
                    drawScore();
                    if(score === brickRowCount * brickColumnCount * 10) {
                        isGameRunning = false;
                        messageDisplay.textContent = "🎉 You Win! Press Start to play again.";
                    }
                }
            }
        }
    }
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#00ffff";
    ctx.fillText("Lives: " + lives, 10, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawLives();

    if(!isGameRunning) return;

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision (left/right)
    if(ballX + ballRadius > canvas.width || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }

    // Wall collision (top)
    if(ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }
    // Paddle collision
    else if(ballY + ballRadius > canvas.height - paddleHeight - 5) {
        if(ballX > paddleX && ballX < paddleX + paddleWidth) {
            // Change angle based on hit position
            let hitPos = ballX - (paddleX + paddleWidth / 2);
            ballSpeedX = hitPos * 0.2;
            ballSpeedY = -ballSpeedY;
            // Add some flair to speed
            if(Math.abs(ballSpeedX) < 2) {
                ballSpeedX = (ballSpeedX < 0 ? -2 : 2);
            }
        }
        else {
            // Lose life
            lives--;
            if(lives === 0) {
                isGameRunning = false;
                messageDisplay.textContent = "💀 Game Over! Press Start to try again.";
            } else {
                ballX = canvas.width / 2;
                ballY = canvas.height - paddleHeight - ballRadius - 10;
                ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
                ballSpeedY = -5;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    requestAnimationFrame(draw);
}

document.addEventListener('mousemove', (e) => {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        resetGame();
        draw();
    }
});

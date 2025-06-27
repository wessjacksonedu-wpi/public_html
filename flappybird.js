const game = document.getElementById("game-container");
const bird = document.getElementById("bird");
const scoreDisplay = document.getElementById("score");

let birdTop = 200;
let gravity = 1;
let jumpStrength = 10;
let velocity = 0;
let isGameOver = false;
let score = 0;

let pipeInterval = null; // Global interval
const PIPE_SPAWN_INTERVAL = 1000; // 1 second

// Jump or restart
document.addEventListener("keydown", () => {
  if (!isGameOver) {
    velocity = -jumpStrength;
  } else {
    restartGame();
  }
});

// Start game
startGameLoop();
startPipeSpawner();

// Game loop
function startGameLoop() {
  const loop = setInterval(() => {
    if (isGameOver) {
      clearInterval(loop);
      return;
    }

    // Apply gravity
    velocity += gravity;
    birdTop += velocity;
    bird.style.top = birdTop + "px";

    // Out of bounds = game over
    if (birdTop >= 560 || birdTop <= 0) {
      endGame();
    }

    // Move pipes and check collisions
    document.querySelectorAll(".pipe").forEach(pipe => {
      let pipeLeft = parseInt(pipe.style.left.replace("px", ""));
      pipe.style.left = (pipeLeft - 2) + "px";

      // Remove offscreen pipes
      if (pipeLeft + 60 < 0) {
        pipe.remove();
        if (pipe.classList.contains("top")) {
          score++;
          scoreDisplay.textContent = `Score: ${score}`;
        }
      }

      // Collision detection
      const birdRect = bird.getBoundingClientRect();
      const pipeRect = pipe.getBoundingClientRect();

      if (
        birdRect.left < pipeRect.right &&
        birdRect.right > pipeRect.left &&
        birdRect.top < pipeRect.bottom &&
        birdRect.bottom > pipeRect.top
      ) {
        endGame();
      }
    });
  }, 20);
}

// Fixed, global pipe spawner
function startPipeSpawner() {
  if (pipeInterval) clearInterval(pipeInterval); // Prevent multiple intervals
  pipeInterval = setInterval(() => {
    if (!isGameOver) {
      createPipe();
    }
  }, PIPE_SPAWN_INTERVAL);
}

// Create pipes
function createPipe() {
  const gap = 300;
  const minHeight = 50;
  const maxHeight = 300;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
  const bottomHeight = 600 - topHeight - gap;

  // Ensure no overlap: only add pipes if the rightmost pipe is far enough away
  const existingPipes = document.querySelectorAll(".pipe.top");
  if (existingPipes.length > 0) {
    const lastPipe = existingPipes[existingPipes.length - 1];
    const lastLeft = parseInt(lastPipe.style.left.replace("px", ""));
    if (lastLeft > 300) return; // Don’t add pipe too soon
  }

  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe", "top");
  topPipe.style.height = topHeight + "px";
  topPipe.style.left = "400px";

  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe", "bottom");
  bottomPipe.style.height = bottomHeight + "px";
  bottomPipe.style.left = "400px";

  game.appendChild(topPipe);
  game.appendChild(bottomPipe);
}

// Game over handler
function endGame() {
  isGameOver = true;
  showEndMessage();
}

// Restart the game
function restartGame() {
  document.querySelectorAll(".pipe").forEach(pipe => pipe.remove());
  birdTop = 200;
  velocity = 0;
  bird.style.top = birdTop + "px";
  isGameOver = false;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  startGameLoop();
  // No need to restart spawner – it's already running consistently
}

// Show message
function showEndMessage() {
  scoreDisplay.textContent = `💀 Game Over! Final Score: ${score} — Press Any Key to Restart`;
}

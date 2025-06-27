const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Ship properties
const SHIP_SIZE = 30;
const SHIP_THRUST = 0.1;
const SHIP_FRICTION = 0.99;
const SHIP_ROT_SPEED = 0.06;
const SHIP_MAX_SPEED = 6;
const SHOT_SPEED = 7;
const SHOT_LIFE = 60;

// Asteroid properties
const ASTEROID_NUM = 5;
const ASTEROID_SIZE = 50;
const ASTEROID_SPEED_MAX = 2;
const ASTEROID_VERTICES = 10;
const ASTEROID_JAGGEDNESS = 0.4;

let score = 0;
let lives = 3;
let gameOver = false;

// Utility functions
function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Ship class
class Ship {
  constructor() {
    this.x = WIDTH / 2;
    this.y = HEIGHT / 2;
    this.radius = SHIP_SIZE / 2;
    this.angle = 0; // radians
    this.rotation = 0;
    this.thrusting = false;
    this.thrust = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.canShoot = true;
  }

  draw() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();

    const noseX = this.x + Math.cos(this.angle) * SHIP_SIZE / 2;
    const noseY = this.y + Math.sin(this.angle) * SHIP_SIZE / 2;
    const leftX = this.x + Math.cos(this.angle + 2.5) * SHIP_SIZE / 2;
    const leftY = this.y + Math.sin(this.angle + 2.5) * SHIP_SIZE / 2;
    const rightX = this.x + Math.cos(this.angle - 2.5) * SHIP_SIZE / 2;
    const rightY = this.y + Math.sin(this.angle - 2.5) * SHIP_SIZE / 2;

    ctx.moveTo(noseX, noseY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();
    ctx.stroke();

    if (this.thrusting) {
      ctx.fillStyle = "orange";
      ctx.beginPath();
      const backX = this.x - Math.cos(this.angle) * SHIP_SIZE / 2;
      const backY = this.y - Math.sin(this.angle) * SHIP_SIZE / 2;
      ctx.moveTo(backX, backY);
      ctx.lineTo(
        backX + Math.cos(this.angle + Math.PI / 2) * 7,
        backY + Math.sin(this.angle + Math.PI / 2) * 7
      );
      ctx.lineTo(
        backX + Math.cos(this.angle - Math.PI / 2) * 7,
        backY + Math.sin(this.angle - Math.PI / 2) * 7
      );
      ctx.closePath();
      ctx.fill();
    }
  }

  update() {
    this.angle += this.rotation;

    if (this.thrusting) {
      this.thrust.x += Math.cos(this.angle) * SHIP_THRUST;
      this.thrust.y += Math.sin(this.angle) * SHIP_THRUST;
    } else {
      this.thrust.x *= SHIP_FRICTION;
      this.thrust.y *= SHIP_FRICTION;
    }

    this.velocity.x = this.thrust.x;
    this.velocity.y = this.thrust.y;

    if (this.velocity.x > SHIP_MAX_SPEED) this.velocity.x = SHIP_MAX_SPEED;
    if (this.velocity.x < -SHIP_MAX_SPEED) this.velocity.x = -SHIP_MAX_SPEED;
    if (this.velocity.y > SHIP_MAX_SPEED) this.velocity.y = SHIP_MAX_SPEED;
    if (this.velocity.y < -SHIP_MAX_SPEED) this.velocity.y = -SHIP_MAX_SPEED;

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Wrap around screen
    if (this.x < 0 - this.radius) this.x = WIDTH + this.radius;
    if (this.x > WIDTH + this.radius) this.x = 0 - this.radius;
    if (this.y < 0 - this.radius) this.y = HEIGHT + this.radius;
    if (this.y > HEIGHT + this.radius) this.y = 0 - this.radius;
  }
}

// Asteroid class
class Asteroid {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vertices = ASTEROID_VERTICES;
    this.jaggedness = ASTEROID_JAGGEDNESS;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = randomRange(0.5, ASTEROID_SPEED_MAX);
    this.velocity = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed,
    };
    this.offsets = [];

    for (let i = 0; i < this.vertices; i++) {
      this.offsets.push(randomRange(1 - this.jaggedness, 1 + this.jaggedness));
    }
  }

  draw() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < this.vertices; i++) {
      let angle = (Math.PI * 2 / this.vertices) * i;
      let r = this.radius * this.offsets[i];
      let x = this.x + Math.cos(angle) * r;
      let y = this.y + Math.sin(angle) * r;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x < 0 - this.radius) this.x = WIDTH + this.radius;
    if (this.x > WIDTH + this.radius) this.x = 0 - this.radius;
    if (this.y < 0 - this.radius) this.y = HEIGHT + this.radius;
    if (this.y > HEIGHT + this.radius) this.y = 0 - this.radius;
  }
}

// Shot class
class Shot {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.radius = 3;
    this.speed = SHOT_SPEED;
    this.angle = angle;
    this.velocity = {
      x: Math.cos(angle) * this.speed,
      y: Math.sin(angle) * this.speed,
    };
    this.life = SHOT_LIFE;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.life--;

    if (this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT) {
      this.life = 0;
    }
  }
}

// Game state
let ship;
let asteroids = [];
let shots = [];

function createAsteroids(num) {
  asteroids = [];
  for (let i = 0; i < num; i++) {
    let x, y;
    do {
      x = Math.random() * WIDTH;
      y = Math.random() * HEIGHT;
    } while (distance(x, y, ship.x, ship.y) < 100);

    asteroids.push(new Asteroid(x, y, ASTEROID_SIZE));
  }
}

function splitAsteroid(asteroid) {
  if (asteroid.radius > 15) {
    let newRadius = asteroid.radius / 2;
    asteroids.push(new Asteroid(asteroid.x, asteroid.y, newRadius));
    asteroids.push(new Asteroid(asteroid.x, asteroid.y, newRadius));
  }
}

function updateScoreboard() {
  document.getElementById("scoreboard").textContent = `Score: ${score} | Lives: ${lives}`;
}

function resetGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  ship = new Ship();
  createAsteroids(ASTEROID_NUM);
  shots = [];
  updateScoreboard();
  document.getElementById("restartBtn").style.display = "none";
  loop();
}

function gameOverScreen() {
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2 - 30);
  ctx.font = "25px Arial";
  ctx.fillText(`Final Score: ${score}`, WIDTH / 2, HEIGHT / 2 + 20);
  document.getElementById("restartBtn").style.display = "inline-block";
}

// Controls
// Controls
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function handleInput() {
  if (keys["KeyA"]) {
    ship.rotation = -SHIP_ROT_SPEED;
  } else if (keys["KeyD"]) {
    ship.rotation = SHIP_ROT_SPEED;
  } else {
    ship.rotation = 0;
  }

  ship.thrusting = keys["KeyW"];

  if (keys["Space"] && ship.canShoot) {
    shots.push(new Shot(ship.x + Math.cos(ship.angle) * SHIP_SIZE / 2, ship.y + Math.sin(ship.angle) * SHIP_SIZE / 2, ship.angle));
    ship.canShoot = false;
    setTimeout(() => { ship.canShoot = true; }, 300);
  }
}


// Main game loop
function loop() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  handleInput();

  ship.update();
  ship.draw();

  shots.forEach((shot, si) => {
    shot.update();
    if (shot.life <= 0) {
      shots.splice(si, 1);
    } else {
      shot.draw();
    }
  });

  asteroids.forEach((asteroid, i) => {
    asteroid.update();
    asteroid.draw();

    // Collision with ship
    if (distance(ship.x, ship.y, asteroid.x, asteroid.y) < asteroid.radius + ship.radius) {
      lives--;
      updateScoreboard();
      asteroids.splice(i, 1);
      if (lives <= 0) {
        gameOver = true;
        gameOverScreen();
      }
    }

    // Collision with shots
    shots.forEach((shot, si) => {
      if (distance(shot.x, shot.y, asteroid.x, asteroid.y) < asteroid.radius) {
        score += 10;
        updateScoreboard();
        shots.splice(si, 1);

        if (asteroid.radius > 15) {
          splitAsteroid(asteroid);
        }
        asteroids.splice(i, 1);
      }
    });
  });

  if (!gameOver) {
    if (asteroids.length === 0) {
      createAsteroids(ASTEROID_NUM + Math.floor(score / 100));
    }
    requestAnimationFrame(loop);
  }
}

document.getElementById("restartBtn").addEventListener("click", () => {
  resetGame();
});

resetGame();

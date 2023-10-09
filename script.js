const paddleSpeed = 10;

const topPaddle = document.getElementById("topPaddle");
const bottomPaddle = document.getElementById("bottomPaddle");
const ball = document.querySelector(".ball");
const pong = document.querySelector(".pong");

let topPaddleX = 150;
let bottomPaddleX = 150;
let topPaddleY = 20;
let bottomPaddleY = 760;

let bottomPaddleChargeLevel = 0;
let topPaddleChargeLevel = 0;

let ballX = 190;
let ballY = 390;
let ballSpeedX = 2; //2
let ballSpeedY = 5; //5

//MAP BOUNDARIES AS VARIABLES
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;

const COLLISION_SQUARE = 20;

const BALL_SIZE = 20;

const LEFT_WALL = 0;
const RIGHT_WALL = 400;
const TOP_WALL = 0;
const BOTTOM_WALL = 800;
const CENTER_LINE = BOTTOM_WALL / 2;

//KEYBOARD EVENTS
const keys = {}; // Object to store pressed keys

document.addEventListener("keydown", function (event) {
  keys[event.key] = true;
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});

function updateBall() {
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
  ballX += ballSpeedX;
  ballY += ballSpeedY;
}

function updatePaddles() {
  //TOP PLAYER KEYS
  if (keys["a"] && topPaddleX > LEFT_WALL) {
    topPaddleX -= paddleSpeed;
  }
  if (keys["d"] && topPaddleX < RIGHT_WALL - PADDLE_WIDTH) {
    topPaddleX += paddleSpeed;
  }
  if (keys["w"] && topPaddleY > TOP_WALL) {
    topPaddleY -= paddleSpeed;
  }
  if (keys["s"] && topPaddleY < CENTER_LINE - PADDLE_HEIGHT) {
    topPaddleY += paddleSpeed;
  }

  //BOTTOM PLAYER KEYS
  if (keys["ArrowLeft"] && bottomPaddleX > LEFT_WALL) {
    bottomPaddleX -= paddleSpeed;
  }

  if (keys["ArrowRight"] && bottomPaddleX < RIGHT_WALL - PADDLE_WIDTH) {
    bottomPaddleX += paddleSpeed;
  }

  if (keys["ArrowUp"] && bottomPaddleY > CENTER_LINE) {
    bottomPaddleY -= paddleSpeed;
  }
  if (keys["ArrowDown"] && bottomPaddleY < BOTTOM_WALL - PADDLE_HEIGHT) {
    bottomPaddleY += paddleSpeed;
  }

  topPaddle.style.left = topPaddleX + "px";
  topPaddle.style.top = topPaddleY + "px";
  bottomPaddle.style.left = bottomPaddleX + "px";
  bottomPaddle.style.top = bottomPaddleY + "px";
}

function gameLoop() {
  // Ball collision with top and bottom walls
  if (ballX <= LEFT_WALL || ballX >= RIGHT_WALL - BALL_SIZE) {
    ballSpeedX = -ballSpeedX;
  }

  //collision with paddle
  if (
    (ballY - 10 <= topPaddleY + PADDLE_HEIGHT &&
      ballY + 10 >= topPaddleY &&
      ballX >= topPaddleX &&
      ballX <= topPaddleX + PADDLE_WIDTH) ||
    (ballY - 10 <= bottomPaddleY + PADDLE_HEIGHT &&
      ballY + 10 >= bottomPaddleY &&
      ballX >= bottomPaddleX &&
      ballX <= bottomPaddleX + PADDLE_WIDTH)
  ) {
    ballSpeedY = -ballSpeedY;
  }

  // Reset ball position if it goes out of the screen horizontally
  if (ballY <= 0 || ballY >= 790) {
    ballX = 190;
    ballY = 390;
    ballSpeedX = 2;
    ballSpeedY = -5; // Change the initial direction if you prefer
  }
  updatePaddles();
  updateBall();
}

setInterval(function () {
  gameLoop();
}, 20);

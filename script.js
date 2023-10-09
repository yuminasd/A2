let paddleSpeed = 10;

const topPaddle = document.getElementById("topPaddle");
const bottomPaddle = document.getElementById("bottomPaddle");
const ball = document.querySelector(".ball");
const pong = document.querySelector(".pong");

let topPaddleX = 150;
let bottomPaddleX = 150;
let topPaddleY = 20;
let bottomPaddleY = 760;

let isSwinging = false;
let swingDuration = 0; // Time the swing state has been active (in milliseconds)
let isPaddleCooldownActive = false; // Flag to track if the paddle collision cooldown is active

let ballX = 190;
let ballY = 390;
let ballSpeedX = 2; //2
let ballSpeedY = 5; //5

//MAP BOUNDARIES AS VARIABLES
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;

const COLLISION_SQUARE = 20;
const PADDLE_COLLISION_COOLDOWN = 200; // 200 ms

const BALL_SIZE = 20;

const LEFT_WALL = 0;
const RIGHT_WALL = 400;
const TOP_WALL = 0;
const BOTTOM_WALL = 800;
const CENTER_LINE = BOTTOM_WALL / 2;

//KEYBOARD EVENTS
const keys = {}; // Object to store pressed keys

//Handle User Swing and Movement
document.addEventListener("keydown", function (event) {
  if ((event.key === " " || event.key.toLowerCase() === "n") && !isSwinging) {
    isSwinging = true;
    // Optionally, you can add logic for swing animations or actions here
  } else {
    keys[event.key] = true;
  }
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});

function updatePaddles() {
  // Increment swing duration if swinging
  if (isSwinging) {
    swingDuration += 20; // Assuming the game loop runs every 20 milliseconds
    // Optionally, you can add logic for swing animations or actions here
  }

  // Reset swing state after 2 seconds
  if (swingDuration >= 200) {
    isSwinging = false;
    swingDuration = 0;
    // Optionally, you can reset paddle appearance or perform other actions here
  }
  if (!isSwinging) {
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
  }

  // Change paddle appearance based on swing state
  if (isSwinging) {
    topPaddle.classList.add("swinging"); // Assuming "swinging" class turns the paddle red
    bottomPaddle.classList.add("swinging");
  } else {
    topPaddle.classList.remove("swinging");
    bottomPaddle.classList.remove("swinging");
  }

  topPaddle.style.left = topPaddleX + "px";
  topPaddle.style.top = topPaddleY + "px";
  bottomPaddle.style.left = bottomPaddleX + "px";
  bottomPaddle.style.top = bottomPaddleY + "px";
}

function updateBall() {
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
  ballX += ballSpeedX;
  ballY += ballSpeedY;
}

function handleCollisions() {
  // Ball collision with top and bottom walls
  if (ballX <= LEFT_WALL || ballX >= RIGHT_WALL - BALL_SIZE) {
    ballSpeedX = -ballSpeedX;
  }

  // Collision with paddles
  if (
    checkCollision(topPaddleX, topPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT) ||
    checkCollision(bottomPaddleX, bottomPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT)
  ) {
    // Handle ball collision based on swing state
    if (isSwinging && !isPaddleCooldownActive) {
      // Ball speed increases when colliding with a swinging paddle
      ballSpeedY = -ballSpeedY * 1.1; // Increase the Y speed (can adjust the factor)

      isPaddleCooldownActive = true; // Activate the paddle collision cooldown
      setTimeout(() => {
        isPaddleCooldownActive = false; // Deactivate the paddle collision cooldown after 200 milliseconds
      }, PADDLE_COLLISION_COOLDOWN);
    } else {
      //   ballSpeedY = -ballSpeedY;
    }
  }

  // Reset ball position if it goes out of the screen horizontally
  if (ballY <= 0 || ballY >= 790) {
    ballX = 190;
    ballY = 390;
    ballSpeedX = 2;
    ballSpeedY = -5; // Change the initial direction if you prefer
    paddleSpeed = 10;
  }
}

//CHECKS COLLISION WITH THE PADDLES
function checkCollision(paddleX, paddleY, paddleWidth, paddleHeight) {
  return (
    ballX + 10 >= paddleX &&
    ballX - 10 <= paddleX + paddleWidth &&
    ballY + 10 >= paddleY &&
    ballY - 10 <= paddleY + paddleHeight
  );
}

function gameLoop() {
  handleCollisions();
  updatePaddles();
  updateBall();
}

setInterval(function () {
  gameLoop();
}, 20);

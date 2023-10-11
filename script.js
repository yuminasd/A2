//CONSTANTS
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

//GAME VARIABLES
let paddleSpeed = 10;

const topPaddle = document.getElementById("topPaddle");
const bottomPaddle = document.getElementById("bottomPaddle");
const ball = document.querySelector(".ball");
const pong = document.querySelector(".pong");

let topPaddleX = 150;
let bottomPaddleX = 150;
let topPaddleY = 20;
let bottomPaddleY = 760;

let topPaddleSwinging = false;
let topPaddleSwingDuration = 0; // Time the swing state has been active (in milliseconds)
let topPaddleCooldownActive = false; // Flag to track if the paddle collision cooldown is active

let bottomPaddleSwinging = false;
let bottomPaddleSwingDuration = 0; // Time the swing state has been active (in milliseconds)
let bottomPaddleCooldownActive = false; // Flag to track if the paddle collision cooldown is active

let ballX = 190;
let ballY = 390;
let ballSpeedX = 2; //2
let ballSpeedY = 5; //5

//SERVING STATE
let server = "top";

//POINTS SYSTEM
let topPaddlePoints = 0;
let bottomPaddlePoints = 0;

//KEYBOARD EVENTS
const keys = {}; // Object to store pressed keys

//Handle User Swing
document.addEventListener("keydown", function (event) {
  if (
    event.key === " " &&
    !topPaddleSwinging &&
    gameState === GameState.IN_PLAY
  ) {
    topPaddleSwinging = true;
  }
  if (
    event.key.toLowerCase() === "n" &&
    !bottomPaddleSwinging &&
    gameState === GameState.IN_PLAY
  ) {
    bottomPaddleSwinging = true;
  }

  keys[event.key] = true;
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});

//STATE MANAGER
const GameState = {
  SERVING: "serving",
  IN_PLAY: "inPlay",
  GAME_OVER: "gameOver",
};

let gameState = GameState.IN_PLAY; // Initial game state is serving

function handleServingState() {
  serve_handlePaddles();
  serve_updateBall();
}

function handleGameOverState() {
  // Logic for game over state
  // ...
}

function handleInPlayState() {
  handleCollisions();
  updatePaddles();
  updateBall();
}

//SERVING FUNCTIONS
function serve_handlePaddles() {
  topPlayerMovement();
  bottomPlayerMovement();
}

function serve_updateBall() {
  ballX = bottomPaddleX + 40;
  ballY = bottomPaddleY - (PADDLE_HEIGHT - 5);
}

//PLAYING FUNCTIONS
function updatePaddles() {
  // Increment swing duration if swinging
  if (topPaddleSwinging) {
    topPaddleSwingDuration += 20; // Assuming the game loop runs every 20 milliseconds
    // Optionally, you can add logic for swing animations or actions here
  }
  if (bottomPaddleSwinging) {
    bottomPaddleSwingDuration += 20; // Assuming the game loop runs every 20 milliseconds
    // Optionally, you can add logic for swing animations or actions here
  }

  // Reset swing state after 2 seconds
  if (topPaddleSwingDuration >= 200) {
    topPaddleSwinging = false;
    topPaddleSwingDuration = 0;
    // Optionally, you can reset paddle appearance or perform other actions here
  }

  // Reset swing state after 2 seconds
  if (bottomPaddleSwingDuration >= 200) {
    bottomPaddleSwinging = false;
    bottomPaddleSwingDuration = 0;
    // Optionally, you can reset paddle appearance or perform other actions here
  }
  if (!topPaddleSwinging) {
    topPlayerMovement();
  }
  if (!bottomPaddleSwinging) {
    bottomPlayerMovement();
  }
}

function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
}

function handleCollisions() {
  // Ball collision with top and bottom walls
  if (ballX <= LEFT_WALL || ballX >= RIGHT_WALL - BALL_SIZE) {
    ballSpeedX = -ballSpeedX;
  }

  // Collision with paddles
  if (checkCollision(topPaddleX, topPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT)) {
    // Handle ball collision based on swing state
    if (topPaddleSwinging && !topPaddleCooldownActive) {
      // Ball speed increases when colliding with a swinging paddle
      ballSpeedY = -ballSpeedY * 1.1;
      topPaddleCooldownActive = true;
      setTimeout(() => {
        topPaddleCooldownActive = false; // Deactivate the paddle collision cooldown after 200 milliseconds
      }, PADDLE_COLLISION_COOLDOWN);
    }
  }
  if (
    checkCollision(bottomPaddleX, bottomPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT)
  ) {
    if (bottomPaddleSwinging && !bottomPaddleCooldownActive) {
      ballSpeedY = -ballSpeedY * 1.1;
      bottomPaddleCooldownActive = true;
      setTimeout(() => {
        bottomPaddleCooldownActive = false;
      }, PADDLE_COLLISION_COOLDOWN);
    }
  }
  // Reset ball position if it goes out of the screen horizontally and update scores
  if (ballY <= 0) {
    topPaddlePoints++;
    updateScores();
  } else if (ballY >= 790) {
    bottomPaddlePoints++;
    updateScores();
  }

  if (ballY < 0) {
    ballX = topPaddleX + 40;
    ballY = topPaddleY + (PADDLE_HEIGHT - 5);
    ballSpeedX = 0; //2;
    ballSpeedY = 0; //-5; // Change the initial direction if you prefer
    gameState = GameState.SERVING;
    server = "top";
  }

  if (ballY >= 790) {
    ballX = bottomPaddleX + 40;
    ballY = bottomPaddleY - (PADDLE_HEIGHT - 5);
    ballSpeedX = 0; //2;
    ballSpeedY = 0; //-5; // Change the initial direction if you prefer
    gameState = GameState.SERVING;
    server = "bottom";
  }
}

function updateScores() {
  document.getElementById("topPaddlePoints").textContent = topPaddlePoints;
  document.getElementById("bottomPaddlePoints").textContent =
    bottomPaddlePoints;
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
  switch (gameState) {
    case GameState.SERVING:
      handleServingState();
      break;
    case GameState.IN_PLAY:
      handleInPlayState();
      break;
    case GameState.GAME_OVER:
      handleGameOverState();
      break;
    default:
      break;
  }
}

function topPlayerMovement() {
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
}
function bottomPlayerMovement() {
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

//Updates all the interactive elements to the game
function draw() {
  //Draw the ball
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  //Draw the Paddles
  topPaddle.style.left = topPaddleX + "px";
  topPaddle.style.top = topPaddleY + "px";
  bottomPaddle.style.left = bottomPaddleX + "px";
  bottomPaddle.style.top = bottomPaddleY + "px";
  // Change paddle appearance based on swing state
  if (topPaddleSwinging) {
    topPaddle.classList.add("swinging");
  } else {
    topPaddle.classList.remove("swinging");
  }

  if (bottomPaddleSwinging) {
    bottomPaddle.classList.add("swinging");
  } else {
    bottomPaddle.classList.remove("swinging");
  }
}

setInterval(function () {
  gameLoop();
  draw();
}, 20);

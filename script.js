//CONSTANTS
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 100;

const COLLISION_SQUARE = 20;
const PADDLE_COLLISION_COOLDOWN = 800; // 200 ms

const BALL_SIZE = 20;

const LEFT_WALL = 0;
const RIGHT_WALL = 400;
const TOP_WALL = 0;
const BOTTOM_WALL = 800;
const CENTER_LINE = BOTTOM_WALL / 2;

const menu = document.querySelector(".gameOver");
const topPaddle = document.getElementById("topPaddle");
const bottomPaddle = document.getElementById("bottomPaddle");
const ball = document.querySelector(".ball");
const pong = document.querySelector(".pong");

const START_GAME = document.getElementById("startGame");
START_GAME.addEventListener("click", function () {
  pong.style.visibility = "visible";
  menu.style.visibility = "hidden";
  initializeGame();
});
//GAME VARIABLES
let paddleSpeed = 10;

let topPaddleX = 150;
let bottomPaddleX = 150;
let topPaddleY = 100;
let bottomPaddleY = 700;

let topPaddleSwinging = false;
let topPaddleSwingDuration = 100; // Time the swing state has been active (in milliseconds)
let topPaddleCooldownActive = false; // Flag to track if the paddle collision cooldown is active

let bottomPaddleSwinging = false;
let bottomPaddleSwingDuration = 100; // Time the swing state has been active (in milliseconds)
let bottomPaddleCooldownActive = false; // Flag to track if the paddle collision cooldown is active

let ballX = 190;
let ballY = 390;
let ballSpeedX = 2; //2
let ballSpeedY = 5; //5

//Restart Game
function initializeGame() {
  //TopPaddle
  topPaddleX = 150;
  topPaddleY = 100;
  topPaddleSwinging = false;
  topPaddleSwingDuration = 500;
  topPaddleCooldownActive = false;
  //bottomPaddle
  bottomPaddleX = 150;
  bottomPaddleY = 700;
  bottomPaddleSwinging = false;
  bottomPaddleSwingDuration = 200;
  bottomPaddleCooldownActive = false;

  //Ball
  ballX = 190;
  ballY = 390;
  ballSpeedX = 2;
  ballSpeedY = 5;
  bottomPaddlePoints = 0;
  topPaddlePoints = 0;
  gameState = GameState.SERVING;
  server = "bottom";
  document.getElementById("topPaddlePoints").textContent = topPaddlePoints;
  document.getElementById("bottomPaddlePoints").textContent =
    bottomPaddlePoints;
}
//SERVING STATE
let server = "bottom";

//POINTS SYSTEM
let topPaddlePoints = 0;
let bottomPaddlePoints = 0;

//KEYBOARD EVENTS
const keys = {};
document.addEventListener("keydown", function (event) {
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

let gameState = GameState.GAME_OVER; // Initial game state is serving

function handleServingState() {
  serve_handlePaddles();
  serve_updateBall();
}

function handleGameOverState() {
  //Literally can't do anything except click Start Game :) This is intended
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
  if (server === "bottom") {
    ballX = bottomPaddleX + 40;
    ballY = bottomPaddleY + 50;
  } else {
    ballX = topPaddleX + 40;
    ballY = topPaddleY + 50;
  }
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

  if (ballY < 0) {
    ballX = topPaddleX + 40;
    ballY = topPaddleY + (PADDLE_HEIGHT - 5);
    ballSpeedX = 2; //2;
    ballSpeedY = -5; //5; // Change the initial direction if you prefer
    gameState = GameState.SERVING;
    server = "top";
    topPaddlePoints++;
    updateScores();
  }

  if (ballY >= 790) {
    ballX = bottomPaddleX + 40;
    ballY = bottomPaddleY - (PADDLE_HEIGHT - 5);
    ballSpeedX = 2; //2;
    ballSpeedY = 5; //-5; // Change the initial direction if you prefer
    gameState = GameState.SERVING;
    server = "bottom";
    bottomPaddlePoints++;
    updateScores();
  }
}

function updateScores() {
  document.getElementById("topPaddlePoints").textContent = topPaddlePoints;
  document.getElementById("bottomPaddlePoints").textContent =
    bottomPaddlePoints;

  if (bottomPaddlePoints === 5) {
    gameState = GameState.GAME_OVER;
    pong.style.visibility = "hidden";
    menu.style.visibility = "visible";
  }
  if (topPaddlePoints === 5) {
    gameState = GameState.GAME_OVER;
    pong.style.visibility = "hidden";
    menu.style.visibility = "visible";
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

  if (keys[" "] && !topPaddleSwinging && gameState === GameState.IN_PLAY) {
    topPaddleSwinging = true;
  }

  if (keys[" "] && gameState === GameState.SERVING && server === "top") {
    gameState = GameState.IN_PLAY;
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

  if (keys["n"] && !bottomPaddleSwinging && gameState === GameState.IN_PLAY) {
    bottomPaddleSwinging = true;
  }

  if (keys["n"] && gameState === GameState.SERVING && server === "bottom") {
    gameState = GameState.IN_PLAY;
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

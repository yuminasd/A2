//  Course: SENG 513
//  Date: OCT 18, 2023
//  Assignment 2
//  Name: Jia-Gang Chang
//  UCID: 30046735

//CONSTANTS-----------------------------------------------------------------------------------------------
const PADDLE_WIDTH = 50;
const PADDLE_HEIGHT = 70;

const COLLISION_SQUARE = 20;
const PADDLE_COLLISION_COOLDOWN = 800; // the time before you can swing again
const PADDLE_SWINGING_TIME = 400;

const BALL_SIZE = 10;

const LEFT_WALL = 0;
const RIGHT_WALL = 300;
const TOP_WALL = 0;
const BOTTOM_WALL = 600;
const CENTER_LINE = BOTTOM_WALL / 2;

const menu = document.querySelector(".gameOver");
const RESTART = document.getElementById("restart");
RESTART.addEventListener("click", function () {
  gameState = GameState.GAME_OVER;
  gameScene.style.display = "none";
  menu.style.display = "flex";
  controlsList.forEach(function (controlElement) {
    controlElement.style.visibility = "hidden";
  });
});
const instructions = document.querySelector(".instructions");
const INSTRUCTIONS_BUTTON = document.getElementById("instructionsButton");
INSTRUCTIONS_BUTTON.addEventListener("click", function () {
  if (instructions.style.display === "none") {
    instructions.style.display = "block";
  } else {
    instructions.style.display = "none";
  }
});

const topPaddle = document.getElementById("topPaddle");
const bottomPaddle = document.getElementById("bottomPaddle");
const ball = document.querySelector(".ball");
const gameScene = document.querySelector(".gameScene");
const controlsList = document.querySelectorAll(".controls");

const topShootButton = document.getElementById("topShootButton");
const topUpButton = document.getElementById("topUpButton");
const topDownButton = document.getElementById("topDownButton");
const topLeftButton = document.getElementById("topLeftButton");
const topRightButton = document.getElementById("topRightButton");

const bottomShootButton = document.getElementById("bottomShootButton");
const bottomUpButton = document.getElementById("bottomUpButton");
const bottomDownButton = document.getElementById("bottomDownButton");
const bottomLeftButton = document.getElementById("bottomLeftButton");
const bottomRightButton = document.getElementById("bottomRightButton");

const START_GAME = document.getElementById("startGame");
START_GAME.addEventListener("click", function () {
  gameScene.style.display = "block";
  menu.style.display = "none";
  controlsList.forEach(function (controlElement) {
    controlElement.style.visibility = "visible";
  });
  initializeGame();
});

//GAME VARIABLES----------------------------------------------------------------------------------------------------
let paddleSpeed;

let topPaddleX;
let bottomPaddleX;
let topPaddleY;
let bottomPaddleY;

let topPaddleSwinging;
let topPaddleSwingDuration; // Time the swing state has been active (in milliseconds)
let topPaddleCooldownActive; // Flag to track if the paddle collision cooldown is active
let canTopPaddleSwing;

let topShootButtonPressed;
let topUpButtonPressed;
let topDownButtonPressed;
let topLeftButtonPressed;
let topRightButtonPressed;

let bottomPaddleSwinging;
let bottomPaddleSwingDuration;
let bottomPaddleCooldownActive;
let canBottomPaddleSwing;

let bottomShootButtonPressed;
let bottomUpButtonPressed;
let bottomDownButtonPressed;
let bottomLeftButtonPressed;
let bottomRightButtonPressed;

let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;

let server; // player to shoot the ball

function initializeGame() {
  paddleSpeed = 10;
  initializePlayerPosition();

  //Ball
  ballX = 190;
  ballY = 390;
  ballSpeedX = 2;
  ballSpeedY = -5;
  bottomPaddlePoints = 0;
  topPaddlePoints = 0;
  updateScores();
  gameState = GameState.SERVING;
  server = "bottom";
}

function initializePlayerPosition() {
  //TopPaddle
  topPaddleX = 150;
  topPaddleY = 100;
  topPaddleSwinging = false;
  topPaddleSwingDuration = 0;
  topPaddleCooldownActive = false;
  canTopPaddleSwing = true;
  //bottomPaddle
  bottomPaddleX = 150;
  bottomPaddleY = 500;
  bottomPaddleSwinging = false;
  bottomPaddleSwingDuration = 0;
  bottomPaddleCooldownActive = false;
  canBottomPaddleSwing = true;
}
//POINTS SYSTEM----------------------------------------------------------------------------------------------
let topPaddlePoints = 0;
let bottomPaddlePoints = 0;
document.getElementById("topPaddlePoints").textContent = topPaddlePoints;
document.getElementById("bottomPaddlePoints").textContent = bottomPaddlePoints;
//KEYBOARD EVENTS--------------------------------------------------------------------------------------------
const keys = {};
document.addEventListener("keydown", function (event) {
  keys[event.key] = true;
});
document.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});

//Top Mouse Keys
topShootButton.addEventListener("mousedown", function () {
  topShootButtonPressed = true;
});
topShootButton.addEventListener("mouseup", function () {
  topShootButtonPressed = false;
});

topUpButton.addEventListener("mousedown", function () {
  topUpButtonPressed = true;
});
topUpButton.addEventListener("mouseup", function () {
  topUpButtonPressed = false;
});

topDownButton.addEventListener("mousedown", function () {
  topDownButtonPressed = true;
});
topDownButton.addEventListener("mouseup", function () {
  topDownButtonPressed = false;
});

topLeftButton.addEventListener("mousedown", function () {
  topLeftButtonPressed = true;
});
topLeftButton.addEventListener("mouseup", function () {
  topLeftButtonPressed = false;
});

topRightButton.addEventListener("mousedown", function () {
  topRightButtonPressed = true;
});
topRightButton.addEventListener("mouseup", function () {
  topRightButtonPressed = false;
});

//Bottom Mouse Keys
bottomShootButton.addEventListener("mousedown", function () {
  bottomShootButtonPressed = true;
});
bottomShootButton.addEventListener("mouseup", function () {
  bottomShootButtonPressed = false;
});

bottomUpButton.addEventListener("mousedown", function () {
  bottomUpButtonPressed = true;
});
bottomUpButton.addEventListener("mouseup", function () {
  bottomUpButtonPressed = false;
});

bottomDownButton.addEventListener("mousedown", function () {
  bottomDownButtonPressed = true;
});
bottomDownButton.addEventListener("mouseup", function () {
  bottomDownButtonPressed = false;
});

bottomLeftButton.addEventListener("mousedown", function () {
  bottomLeftButtonPressed = true;
});
bottomLeftButton.addEventListener("mouseup", function () {
  bottomLeftButtonPressed = false;
});

bottomRightButton.addEventListener("mousedown", function () {
  bottomRightButtonPressed = true;
});
bottomRightButton.addEventListener("mouseup", function () {
  bottomRightButtonPressed = false;
});

//STATE MANAGER ----------------------------------------------------------------------------------------------
//There are 3 states to the game:
const GameState = {
  SERVING: "serving", //Player that loses points start with the ball. Press shoot to change to next state
  IN_PLAY: "inPlay", //Dodge the ball or hit it with shoot button
  GAME_OVER: "gameOver", // menu interactions
};

let gameState = GameState.GAME_OVER; // Initial game state is in the loading screen

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

//SERVING FUNCTIONS---------------------------------------------------------------------------------------------
function serve_handlePaddles() {
  topPlayerMovement();
  bottomPlayerMovement();
}

function serve_updateBall() {
  //ball will follow the server in this state
  if (server === "bottom") {
    ballX = bottomPaddleX + 20;
    ballY = bottomPaddleY - 30;
  } else {
    ballX = topPaddleX + 20;
    ballY = topPaddleY + 90;
  }
}

//INPLAY FUNCTIONS-----------------------------------------------------------------------------------------------
function updatePaddles() {
  // Increment swing duration if swinging
  if (topPaddleSwinging) {
    topPaddleSwingDuration += 20;
  }
  if (bottomPaddleSwinging) {
    bottomPaddleSwingDuration += 20;
  }
  // Reset swing state after 2 seconds
  if (topPaddleSwingDuration >= PADDLE_COLLISION_COOLDOWN) {
    topPaddleSwinging = false;
    topPaddleSwingDuration = 0;
    setTimeout(() => {
      canTopPaddleSwing = true;
    }, "1000");
  }

  // Reset swing state after 2 seconds
  if (bottomPaddleSwingDuration >= PADDLE_COLLISION_COOLDOWN) {
    bottomPaddleSwinging = false;
    bottomPaddleSwingDuration = 0;
    setTimeout(() => {
      canBottomPaddleSwing = true;
    }, "1000");
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

//Checks collision with the Paddle
function checkCollision(paddleX, paddleY, paddleWidth, paddleHeight) {
  return (
    ballX + 10 >= paddleX &&
    ballX - 10 <= paddleX + paddleWidth &&
    ballY + 10 >= paddleY &&
    ballY - 10 <= paddleY + paddleHeight
  );
}

function handleCollisions() {
  // Collision with paddles
  if (checkCollision(topPaddleX, topPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT)) {
    //Collide with Paddle while it's swinging
    if (topPaddleSwinging && !topPaddleCooldownActive) {
      ballSpeedY = -ballSpeedY * 1.1;
      ballSpeedX = -ballSpeedX * 1.1;
    } else {
      //hit player so lose a point
      gameState = GameState.SERVING;
      initializePlayerPosition();
      server = "top";
      ballSpeedY = 5;
      bottomPaddlePoints++;
      updateScores();
    }
  } else if (
    checkCollision(bottomPaddleX, bottomPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT)
  ) {
    //Collide with Paddle while it's swinging
    if (bottomPaddleSwinging && !bottomPaddleCooldownActive) {
      ballSpeedY = -ballSpeedY * 1.1;
      ballSpeedX = -ballSpeedX * 1.1;
    } else {
      //hit player so lose a point
      gameState = GameState.SERVING;
      initializePlayerPosition();
      server = "bottom";
      ballSpeedY = -5;
      topPaddlePoints++;
      updateScores();
    }
  }
  // Ball collision with left and right walls
  else if (ballX <= LEFT_WALL || ballX >= RIGHT_WALL - BALL_SIZE) {
    ballSpeedX = -ballSpeedX;
  }

  // Ball collision with top and bottom walls
  else if (ballY < TOP_WALL) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY >= BOTTOM_WALL - 10) {
    ballSpeedY = -ballSpeedY;
  }
}

function updateScores() {
  document.getElementById("topPaddlePoints").textContent = topPaddlePoints;
  document.getElementById("bottomPaddlePoints").textContent =
    bottomPaddlePoints;

  if (bottomPaddlePoints === 10) {
    gameState = GameState.GAME_OVER;
    gameScene.style.display = "none";
    menu.style.display = "flex";

    controlsList.forEach(function (controlElement) {
      controlElement.style.visibility = "hidden";
    });
  }
  if (topPaddlePoints === 10) {
    gameState = GameState.GAME_OVER;
    gameScene.style.display = "none";
    menu.style.display = "flex";

    controlsList.forEach(function (controlElement) {
      controlElement.style.visibility = "hidden";
    });
  }
}

//Core Game Loop
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
  if (
    (topRightButtonPressed && topPaddleX > LEFT_WALL) ||
    (keys["a"] && topPaddleX > LEFT_WALL)
  ) {
    topPaddleX -= paddleSpeed;
  }
  if (
    (topLeftButtonPressed && topPaddleX < RIGHT_WALL - PADDLE_WIDTH) ||
    (keys["d"] && topPaddleX < RIGHT_WALL - PADDLE_WIDTH)
  ) {
    topPaddleX += paddleSpeed;
  }
  if (
    (topDownButtonPressed && topPaddleY > TOP_WALL) ||
    (keys["w"] && topPaddleY > TOP_WALL)
  ) {
    topPaddleY -= paddleSpeed;
  }
  if (
    (topUpButtonPressed && topPaddleY < CENTER_LINE - PADDLE_HEIGHT) ||
    (keys["s"] && topPaddleY < CENTER_LINE - PADDLE_HEIGHT)
  ) {
    topPaddleY += paddleSpeed;
  }

  if (
    (topShootButtonPressed &&
      canTopPaddleSwing &&
      !topPaddleSwinging &&
      gameState === GameState.IN_PLAY) ||
    (keys[" "] && !topPaddleSwinging && gameState === GameState.IN_PLAY)
  ) {
    topPaddleSwinging = true;
    canTopPaddleSwing = false;
  }

  if (
    (topShootButtonPressed &&
      gameState === GameState.SERVING &&
      server === "top") ||
    (keys[" "] && gameState === GameState.SERVING && server === "top")
  ) {
    gameState = GameState.IN_PLAY;
  }
}

function bottomPlayerMovement() {
  if (
    (bottomLeftButtonPressed && bottomPaddleX > LEFT_WALL) ||
    (keys["ArrowLeft"] && bottomPaddleX > LEFT_WALL)
  ) {
    bottomPaddleX -= paddleSpeed;
  }

  if (
    (bottomRightButtonPressed && bottomPaddleX < RIGHT_WALL - PADDLE_WIDTH) ||
    (keys["ArrowRight"] && bottomPaddleX < RIGHT_WALL - PADDLE_WIDTH)
  ) {
    bottomPaddleX += paddleSpeed;
  }

  if (
    (bottomUpButtonPressed && bottomPaddleY > CENTER_LINE) ||
    (keys["ArrowUp"] && bottomPaddleY > CENTER_LINE)
  ) {
    bottomPaddleY -= paddleSpeed;
  }
  if (
    (bottomDownButtonPressed && bottomPaddleY < BOTTOM_WALL - PADDLE_HEIGHT) ||
    (keys["ArrowDown"] && bottomPaddleY < BOTTOM_WALL - PADDLE_HEIGHT)
  ) {
    bottomPaddleY += paddleSpeed;
  }

  if (
    (bottomShootButtonPressed &&
      canBottomPaddleSwing &&
      !bottomPaddleSwinging &&
      gameState === GameState.IN_PLAY) ||
    (keys["n"] && !bottomPaddleSwinging && gameState === GameState.IN_PLAY)
  ) {
    bottomPaddleSwinging = true;
    canBottomPaddleSwing = false;
  }

  if (
    (bottomShootButtonPressed &&
      gameState === GameState.SERVING &&
      server === "bottom") ||
    (keys["n"] && gameState === GameState.SERVING && server === "bottom")
  ) {
    gameState = GameState.IN_PLAY;
  }
}

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
    topPaddle.style.backgroundColor = "rgba(255, 0, 0, .5)";
  } else {
    topPaddle.classList.remove("swinging");
    topPaddle.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  }

  if (bottomPaddleSwinging) {
    bottomPaddle.classList.add("swinging");
    bottomPaddle.style.backgroundColor = "rgba(255, 0, 0, .5)";
  } else {
    bottomPaddle.classList.remove("swinging");
    bottomPaddle.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  }
}

setInterval(function () {
  gameLoop();
  draw();
}, 20);

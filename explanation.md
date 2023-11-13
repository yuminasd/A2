# Explanation

### Character Movement

As you can see in the gameplay you have the ability to move the characters with the keyboard "wasd, spacebar", " arrow keys, n " or with the buttons. This was to account for mobile.
The way the code is structured looks like this

I define a list of buttons with an unique id in index.html:

```
 <button id="topUpButton" style="width: 50px; height: 38px">Up</button>
```

Within js I relate a const to the button:

```
const topUpButton = document.getElementById("topUpButton");
```

Then I add an event listener to the button which toggles a boolean

```
topUpButton.addEventListener("mouseup", function () {
  topUpButtonPressed = false;
});
```

In the player movement function I then do all the logic handling on the keypress and increment the player

```
  if (
    (topUpButtonPressed && topPaddleY < CENTER_LINE - PADDLE_HEIGHT) ||
    (keys["s"] && topPaddleY < CENTER_LINE - PADDLE_HEIGHT)
  ) {
    topPaddleY += paddleSpeed;
  }
```

This is duplicated for each character key so a total of 10 times.

#### AI Usage

I used AI to discuss if I should seperate the playermovement into two functions or 1. ChaptGPT suggested I used two functions `topPlayerMovement()` and `bottomPlayerMovement()` for users and for every function to define if they are topPlayers or bottomPlayers

\
\

### Swinging

Users are able to press the spacebar or n key to swing the ball. If you miss the timing and get hit, oppponent wins a points, the ball states becomes `Serving`, and allowing you to serve the the ball.

Here are the constants, I wrote to easily balance the game mechanics:

```
const COLLISION_SQUARE = 20; // how large a players swing hitbox is
const PADDLE_COLLISION_COOLDOWN = 800; // the time before you can swing again
const PADDLE_SWINGING_TIME = 400; //the duration the hitbox is spawned
```

Each player has a few variables to interact with

```
let topPaddleSwinging; // boolean to see if user is swinging
let topPaddleSwingDuration; // Time the swing state has been active (in milliseconds)
let topPaddleCooldownActive; // Flag to track swing cooldown
let canTopPaddleSwing; // bbolean to see if user can swing
```

We add listeners to the shooting buttons as defined in Player Movement explanation. In the player movement we have two versions of shoot:

If player is in the `InPlay` state set user as swinging and begin all timers

```
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
```

If a player is in the `Serving` state the gameplay goes to `InPlay` state

```
  if (
    (topShootButtonPressed &&
      gameState === GameState.SERVING &&
      server === "top") ||
    (keys[" "] && gameState === GameState.SERVING && server === "top")
  ) {
    gameState = GameState.IN_PLAY;
  }
```

The collision functions check for for ball hit, and handles logic.

1. Check if ball collides with paddle

```
function checkCollision(paddleX, paddleY, paddleWidth, paddleHeight) {
  return (
    ballX + 10 >= paddleX &&
    ballX - 10 <= paddleX + paddleWidth &&
    ballY + 10 >= paddleY &&
    ballY - 10 <= paddleY + paddleHeight
  );
}
```

2. Check if user is swinging and it's cooldown timer isnt on.
3. If it is reutrn the ball with a 10% speed boost
4. Else if user is hit make the game the serving state with reset

```
  if (checkCollision(topPaddleX, topPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT)) {
    //Collide with Paddle while it's swinging
    if (topPaddleSwinging && !topPaddleCooldownActive) {
      ballSpeedY = -ballSpeedY * 1.1;
    } else {
      //hit player so lose a point
      gameState = GameState.SERVING;
      initializePlayerPosition();
      server = "top";
      ballSpeedY = 5;
      bottomPaddlePoints++;
      updateScores();
    }
```

#### AI Usage

I used AI to discuss if I should seperate the playermovement into two functions or 1. ChaptGPT suggested I used two functions `topPlayerMovement()` and `bottomPlayerMovement()` for users and for every function to define if they are topPlayers or bottomPlayers

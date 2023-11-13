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

This is duplicated for each character key so a total of 10 times

### Swinging
Users are able to press the spacebar or n key to swing the ball. What this does is it removes a hitbox from the character and instantiates a new one that basically 
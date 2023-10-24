Course: SENG 513
Date: OCT 15, 2023
Assignment 12
Name: Jia-Gang Chang
UCID: 30046735

# Hot Potato

### Target Platform:

Desktop and Mobile

### Game Genre:

Sports/Dodgeball

### Game Objective:

Reach 10 points to win the game.

## Rules of the Game:

Hot Potato is a game of dodgeball, players must hit each other with the ball to score points.

- One player starts out serving, pressing shoot will launch the ball to wall.
- Users have to dodge the ball to keep the game going
- Users can press the shoot button when the ball is about to touch them to pass to ball back and increase the ball speed
- Users that get hit by the ball or miss the timing to return the ball will lose the round
- When a player reaches 10 points they win the game

## Player Controls:

### Top Player:

WASD to move
Spacebar to shoot

### Bottom Player:

Arrow Keys to move
"n" to shoot

To allow for Mobile users can press the buttons to control the character

## Game Mechanics:

- Game uses a Finite State Machine, there are 3 states:

  - Serving, the players can move anywhere one the map. However one player holds the ball, the player can press shoot to start the play
  - In Play, the ball is live and bounces on all the walls
  - Game Over, the menu screen (not really a mechanic)

- Game has an interactive ball:

  - Upon serving the ball is live and will bounce on all the walls
  - when the ball hits a player when the swinging hitbox is inactive the player will lose the round and give the other player a point

- Game has a swinging/shooting mechanic:
  - Upon hitting the ball when the swinging hitbox is active, the ball will rebound and increase it's speed by 10%

The game doesn't feature many mechanics because I felt like it's important for the core-gameplay to be interactive and fun, adding new mechanics like dashing, invisibility, powerups are out of scope in my opinions

// This file implements the Enemy and Player classes

// =============================================================================

// Initial X and Y coordinates for the player
var INITIAL_X = 202;
var INITIAL_Y = 415;
var COLLIDED  = 50;
var speeds    = [310, 300, 210];
var score     = 0;

// =============================================================================

// Enemy
var Enemy = function(x, y) {
  this.sprite = 'images/enemy-bug.png';
  this.speed  = speeds[Math.floor(Math.random() * speeds.length)];
  this.x      = x;
  this.y      = y;
};

// Updates enemies' position
Enemy.prototype.update = function(dt) {
  // Moviment is multiplied by 'dt' so it will ensure the game runs at the same speed for all computers
  this.x += this.speed * dt;
  // Canvas width is set to 505 (see engine.js line 28), therefore when the player reaches this point, or further, they will be set back to point 0 on the x-axis
  if (this.x >= 505) {
    this.x = 0;
  }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// =============================================================================

// Player
var Player = function(x, y) {
  this.sprite = 'images/char-cat-girl.png';
  this.x      = x;
  this.y      = y;
};

// The player's position will de updated when they reach water
Player.prototype.update = function(dt) {
  if (this.y <= 0) {
    this.reset(INITIAL_X, INITIAL_Y);
    alertify.alert('You win!', 'Congratulations!<br>You got Catgirl to the water!');
    score += 1;
    $('#score').text(score);
  }
};

// Draw the player on the screen
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Handles key input recieved by the player:
// (1) Walks one square when left key, right key, up key or down key is pressed
// (2) Does not let player wander off canvas
Player.prototype.handleInput = function(key) {
  if (key === 'left' && this.x > 0) {
    this.x -= 101;
  } else if (key === 'right' && this.x < 400) {
    this.x += 101;
  } else if (key === 'up' && this.y > 0) {
    this.y -= 93;
  } else if (key === 'down' && this.y < 400) {
    this.y += 93;
  }
};

// Resets player position to bottom middle of the canvas
Player.prototype.reset = function(x, y) {
  this.x = x;
  this.y = y;
};

// =============================================================================

// Instantiating all enemies and the player

var allEnemies = [
  new Enemy(0, 60),
  new Enemy(202, 145),
  new Enemy(404, 230)
];

var player = new Player(INITIAL_X, INITIAL_Y);

// =============================================================================

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

// Checks if the player COLLIDED with an enemy, resets score back to zero, shows the player an alert informing what happened, then resets player's position back to the start
function checkCollisions(allEnemies, player) {
  for(i = 0; i < allEnemies.length; i++) {
    if ((player.y >= allEnemies[i].y - COLLIDED && player.y <= allEnemies[i].y + COLLIDED) && (player.x >= allEnemies[i].x - COLLIDED && player.x <= allEnemies[i].x + COLLIDED)) {
      alertify.alert('Collision detected!', 'Oops, looks like Catgirl just hit a bug!<br>Your score is <strong>reset</strong> and you go back to the start!');
      score = 0;
      $('#score').text(score);
      player.reset(INITIAL_X, INITIAL_Y);
    }
  }
};

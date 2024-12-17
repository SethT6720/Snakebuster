
function get(id) { //Shortened version of document.getElementById()
  return document.getElementById(id);
}

function show(element) { //Shows an element
  element.classList.remove('hide');
}

function hide(element) { //Hides an element
  element.classList.add('hide');
}

function returnToShop(currentPage) { //Brings you whereever you are back to the shop
  hide(currentPage);
  show(shop);
}

function goToGame(currentPage) { //Brings you to the game wherever you are
  hide(currentPage);
  show(game)
}

function buttonOnClick(button, func) { //adds an event listener to a button
   button.addEventListener('click', func); 
}

const sleep = (ms) => { //timeout function for asynchronous functions, especially helpful in while(true) loop situations
  return new Promise(resolve => setTimeout(resolve, ms))
}

//Element gets/variables
//Divs
const titleScreen = get('titleScreen');
const shop = get('shop');
const game = get('game'); //CANVAS ELEMENT
const gameStyle = game.style; //CSS STUFF DONT TOUCH
const ctx = game.getContext('2d'); //CANVAS CONTEXT super important
const dead = get('dead');
const win = get('win');
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const statDisplay = get('statDisplay');





//visual based stuff
game.width = screenWidth * 0.8 //gets the width of the browser and changes canvas to half of it
game.height = screenHeight * 0.8 //same here but with height
if (game.width > game.height) {//makes the dimensions equal so it's a square
  game.width = game.height;

  gameStyle.marginLeft = ((screenWidth - game.width) / 2).toString() + 'px'; //calculates the method of centering the canvas
}
else {
  game.height = game.width;
  gameStyle.marginLeft = ((screenWidth - game.width) / 2).toString() + 'px';
};



let squareSizeFactor = 20; //this describes how big or small each square is, lower is bigger, higher is smaller
let snakeColor = [125, 255, 150];
let headColor = [0, 255, 0];

function squareSize() { //calculates the dimensions of the square based on the screen size
  return game.width / squareSizeFactor;
}

function createBackGround() { //creates a black grid
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'white';
  for (let i = 0; i < gridX; i++) {
    for (let j = 0; j < gridY; j++) {
      let x = i * size;
      let y = j * size;
      ctx.fillRect(x, y, size, size);
      ctx.strokeRect(x, y, size, size);
    }
  }
}
   
function drawRegSquare(x, y) { //Draws a background/black square at the specified x and y positions USE PIXELS NOT SQUARES
  ctx.fillStyle = 'black';
  ctx.fillRect(x, y, size, size);
  ctx.strokeRect(x, y, size, size);
}

function drawSnakeSquare(x, y, head) { //draws a square at the given x and y using snake parameters
  if (head) ctx.fillStyle = `rgb(${headColor[0]}, ${headColor[1]}, ${headColor[2]})`;
  if (!head) ctx.fillStyle = `rgb(${snakeColor[0]} ${snakeColor[1]} ${snakeColor[2]})`; //takes colors and just makes them the fill style
  ctx.fillRect(x, y, size, size);
  ctx.strokeRect(x, y, size, size);
}

function drawApple(x, y) {
  ctx.fillStyle = 'red';
  ctx.fillRect(x, y, size, size);
  ctx.strokeRect(x, y, size, size);
}

function createRandomApple() {
  let randX = Math.floor(Math.random() * gridX);
  let randY = Math.floor(Math.random() * gridY);
  let applePosition = [randX, randY];

  let snakeThere = arrayIncludes(previousPosition, applePosition);
  while (snakeThere) {
    applePosition[0] = Math.floor(Math.random() * gridX);
    applePosition[1] = Math.floor(Math.random() * gridY);

    snakeThere = arrayIncludes(previousPosition, applePosition);
  }
  
}

//variables for size and stuff
let size = squareSize(); //Pixel size of each square, assigned to a variable for easier use
let gridX = squareSizeFactor; //How many squares there are horizontally
let gridY = squareSizeFactor; //How many squares there are vertically

function updateGrids() {
  gridX = squareSizeFactor
  gridY = squareSizeFactor
  size = squareSize();
  createBackGround();
}


//buttons
const initButton = get('initButton');
const deadToShop = get('deadToShop');
const winToShop = get('winToShop');
const shopToGame = get('goToGame');
const cheatCodeButton = get('cheatCodeButton');


//Nav event listeners
buttonOnClick(initButton, () => {
  returnToShop(titleScreen);
});

buttonOnClick(deadToShop, () => {
  returnToShop(dead);
});

buttonOnClick(winToShop, () => {
  returnToShop(win);
});

buttonOnClick(shopToGame, () => {
  inGame = true;
  draw();
  move();
  goToGame(shop);
});

buttonOnClick(cheatCodeButton, () => {
  let promptAnswer = prompt('CODE:')
  if (promptAnswer == 'imadev') {
    speed = Number(prompt('Speed: '));
    snakeLength = Number(prompt('Snake Length: '));
    squareSizeFactor = Number(prompt('Square size factor: '));
    updateGrids();
  }
});

//psuedo code ish
/*
start at shop
buy stuff or continue
go to game

game code here

die -> display earnings and go to shop
win -> display earnings and go to shop with option to prestige
prestige -> doesn't reset upgrades, new difficulty with icnreased earnings
loop back to top
*/ 


function arrayIncludes(array, item) { // Converts arrays into strings then checks if it contains a specified array
  let a = JSON.stringify(array);
  let b = JSON.stringify(item);
  let c = a.indexOf(b);
  if (c === -1) {
    return false;
  } else {
    return true;
  }
}




//Game Vars
let direction = 'none'; //Direction snake is facing
let speed = 20; //How fast the snake moves
let inGame = false; //Are you in Battle?
let hitSelf = false;  //Is the snake hitting itself
let horizontal = false; //True if snake is travelling horizontally
let vertical = false; //True if snake is traveling vertically
let position = [0, 0]; //The snake head's position 
let snakeLength = 10; //# of blocks that make up the snake
let previousPosition = [[0, 0]]; //Positions of all other blocks of the snake beside the head


async function move() { //Call this function to initiate the game, lets you move the snake, and checks for out of bounds and if it's hitting itself. It resets itself and is ready to run again immediately after it returns

  function keyTracker(key) { //Function to change direction based off of what key is being pressed
    switch (key) { //key needs to be from a window eventlistener with the keydown specification
      case 'ArrowUp': //Should be self-explanatory, switches direction of the snake when arrow key is pressed
        if (!vertical) {
          direction = 'up';
          console.log('up', direction);
        }
        break;
      case 'ArrowDown':
        if (!vertical) {
          direction = 'down';
          console.log('down', direction);
        }
        break;
      case 'ArrowLeft':
        if (!horizontal) {
          direction = 'left';
          console.log('left', direction);
        }
        break;
      case 'ArrowRight':
        if (!horizontal) {
          direction = 'right';
          console.log('right', direction);
        }
        break;
      default:
        break;
    }
  }

  function lose() { //This is called when something happens that makes you lose
    controller.abort(); //This cancels the arrow key event listener to make sure direction is only being changed while ingame and multiple eventlisteners aren't being added at the same time
    inGame = false; //resets stuff
    hitSelf = false;
    vertical = false;
    horizontal = false;
    position[0] = 0;
    position[1] = 0;
    previousPosition = [[0, 0]];
    game.classList.add('hide'); //go to dead page
    dead.classList.remove('hide');
    direction = 'none';
  }

  const controller = new AbortController(); //This is necessary to abort the event listener
  window.addEventListener('keydown', (e) => { //Tracks the keys pressed and inputs it into the keyTracker() function
    keyTracker(e.key);
  }, { signal: controller.signal }); //The { signal: controller.signal } allows you to abort the listener by calling controller.abort(); 
  
  while (inGame) { //The game loop and momving around and such
    await sleep(4000 / speed); //Tick/move speed
        
    switch (direction) { //Changes position based on which direction the snake is facing which is found based on key inputs
      case 'up':
        position[1] -= 1;
        vertical = true;
        horizontal = false;
        break;
      case 'down':
        position[1] += 1;
        vertical = true;
        horizontal = false;
        break;
      case 'right':
        position[0] += 1;
        vertical = false;
        horizontal = true;
        break;
      case 'left':
        position[0] -= 1;
        vertical = false;
        horizontal = true;
        break;
      case 'none':
        break;
      default:
        break;
    }

    if (!(position[0] >= 0 && position[0] <= (gridX -1) && position[1] >= 0 && position[1] <= (gridY - 1))) { //This makes sure the snake is within the bounds of play, if it calls lose(); and takes you to the death screen
      lose();
      return;
    }

    if (direction !== 'none') { //This is the canvas settings this specicfic if makes sure the snake doesn't move until after the first key input
      console.log(position[0], position[1]);
      let temp = [[position[0].valueOf(), position[1].valueOf()]]; //Temporary array that is going to be put into previousPosition for storage
      previousPosition = previousPosition.concat(temp); //Adds in the current position into previousPosition
    
      if (previousPosition.length > snakeLength) { //Checks if there are more drawn squares than the snake shoul have and deletes excess
        drawRegSquare(previousPosition[0][0] * size, previousPosition[0][1] * size); //Draws a black square at the oldest position
        previousPosition = previousPosition.slice(1); //Removes the last position from previousPosition
        
      }

      let check = previousPosition.slice(0, previousPosition.length - 3); //This cuts off the first three positions from previousPosition so it can be inserted into the next function to check if the snake is hitting itself. This is necessary so it doesn't think the head of the snake is constantly hitting itself and you don't lose instantly
      if (arrayIncludes(check, position)) { //Checks the head position is within the body, or if the the snake is hitting itself
        hitSelf = true;
        lose();
        return;
      }

      let length = previousPosition.length
      length -= 2;
      drawSnakeSquare(previousPosition[length][0] * size, previousPosition[length][1] * size, false); //Replaces the previous head with a regular square
      drawSnakeSquare(position[0] * size, position[1] * size, true); //Draws the new head at the new position
    }
  }  
}


function draw() {
  createBackGround();
  drawSnakeSquare(position[0] * squareSizeFactor, position[1] * squareSizeFactor, true);
}

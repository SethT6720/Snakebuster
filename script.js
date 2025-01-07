
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



let squareSizeFactor = 21; //Number of squares in the X and Y directions, MAKE SURE THIS IS ODD
let snakeColor = [125, 255, 150]; // Color of the snake body
let headColor = [0, 255, 0]; // Color of the snake head

function squareSize() { //calculates the dimensions of each square based on the screen size
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

function drawSnakeSquare(x, y, head) { //draws a square at the given x and y using snake parameters. The head parameter checks if the square is the head and colors it differently
  if (head) ctx.fillStyle = `rgb(${headColor[0]}, ${headColor[1]}, ${headColor[2]})`;
  if (!head) ctx.fillStyle = `rgb(${snakeColor[0]} ${snakeColor[1]} ${snakeColor[2]})`; //takes colors and just makes them the fill style
  ctx.fillRect(x, y, size, size);
  ctx.strokeRect(x, y, size, size);
}

function drawApple(x, y) { //Draws an apple at the specified coordinates
  ctx.fillStyle = 'red';
  ctx.fillRect(x, y, size, size);
  ctx.strokeRect(x, y, size, size);
}

function createRandomApple() { //Creates a new apple at a randomized position, also removes old apple positions from applePosition and adds the new one as well as draws it
  if (arrayIncludes(applePosition, position)) { //Checks if the snake is eating an apple
    const whichApple = (array) => array[0] === position[0].valueOf() && array[1] === position[1].valueOf(); // This is the entire reason multiple apples works, it checks each array within applePositions and finds the one that overlaps with position

    let index = applePosition.findIndex(whichApple); //This is calling the aformentioned whichApple function thingy and finds the index of the apple that's being eaten
    applePosition.splice(index, 1); //Removes the eaten apple from applePosition
  }

  let randX = Math.floor(Math.random() * gridX); //Generates a random X and Y coordinates between the max X and Y dimensions
  let randY = Math.floor(Math.random() * gridY);
  
  let snakeThere = arrayIncludes(previousPosition, [randX, randY]); //This and the next line check if the snake or a different apple is already in the same square as the randomly generated coordinates
  let appleThere = arrayIncludes(applePosition, [randX, randY]);
  while (snakeThere || appleThere) { //This while function repeats the previous 4(5) lines of code until the generated coordinates aren't shared with the snake or a different apple
    randX = Math.floor(Math.random() * gridX);
    randY = Math.floor(Math.random() * gridY);

    snakeThere = arrayIncludes(previousPosition, [randX, randY]);
    appleThere = arrayIncludes(applePosition, [randX, randY]);
  }

  applePosition.push([randX.valueOf(), randY.valueOf()]);//This adds the generated values into the applePosition array, storing its position
  drawApple(randX * size, randY * size); //This actually draws the apple on the canvas
}

//variables for size and stuff
let size = squareSize(); //Pixel size of each square, assigned to a variable for easier use
let gridX = squareSizeFactor; //How many squares there are horizontally
let gridY = squareSizeFactor; //How many squares there are vertically

function update() {
  if (squareSizeFactor < 9) squareSizeFactor = 9;
  gridX = squareSizeFactor
  gridY = squareSizeFactor
  size = squareSize();
  createBackGround();
  startingPosition = [2, Math.round(gridY / 2) - 1];
  appleStartingPosition = [startingPosition[0] + (Math.round(gridX / 2)), startingPosition[1]];
  applePosition = [appleStartingPosition[0].valueOf(), appleStartingPosition[1].valueOf()];
  position = [startingPosition[0].valueOf(), startingPosition[1].valueOf()];
  previousPosition = [[position[0].valueOf(), position[1].valueOf()]];
}

function updateStatDisplay() { //Does what is says
  statDisplay.innerHTML = `<p>Speed: ${speed}</p> <p>HP: Placeholder</p> <p>Max Apples: ${maxApples}</p> <p>Screen Size: ${gridX} x ${gridY}</p> <p>Difficulty: Placeholder</p> <p>Armor: Placeholder</p> <p>HP Regen: Placeholder</p>`;
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

buttonOnClick(cheatCodeButton, () => { //Cheat codes/change certain variables
  let promptAnswer = prompt('CODE:')
  if (promptAnswer == 'imadev') {
    speed = Number(prompt('Speed: '));
    snakeLength = Number(prompt('Snake Length: '));
    squareSizeFactor = Number(prompt('Square size factor: '));
    maxApples = Number(prompt('Max Apples'));
    update();
    updateStatDisplay();
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

let inGame = false; //Are you in Battle?
let hitSelf = false;  //Is the snake hitting itself

let horizontal = false; //True if snake is travelling horizontally
let vertical = false; //True if snake is traveling vertically

let startingSnakeLength = 3;
let snakeLength = startingSnakeLength; //# of blocks that make up the snake

let startingPosition = [2, Math.round(gridY / 2) - 1];
let appleStartingPosition = [startingPosition[0] + (Math.round(gridX / 2)), startingPosition[1]];

let applePosition = [[appleStartingPosition[0].valueOf(), appleStartingPosition[1].valueOf()]];
let position = [startingPosition[0].valueOf(), startingPosition[1].valueOf()]; //The snake head's position 
let previousPosition = [[position[0].valueOf(), position[1].valueOf()]]; //Positions of all other blocks of the snake beside the head

//Actual Stats (Probably)

let HP = 10;
let speed = 20; //How fast the snake moves
let maxApples = 5;
let armor = 0;
let regen = 0;
let prestigeLevel = 0;


async function move() { //Call this function to initiate the game, lets you move the snake, and checks for out of bounds and if it's hitting itself. It resets itself and is ready to run again immediately after it returns

  function keyTracker(key) { //Function to change direction based off of what key is being pressed
    switch (key) { //key needs to be from a window eventlistener with the keydown specification
      case 'ArrowUp': //Should be self-explanatory, switches direction of the snake when arrow key is pressed
        if (!vertical) {
          direction = 'up';
        }
        break;
      case 'ArrowDown':
        if (!vertical) {
          direction = 'down';
        }
        break;
      case 'ArrowLeft':
        if (!horizontal) {
          direction = 'left';
        }
        break;
      case 'ArrowRight':
        if (!horizontal) {
          direction = 'right';
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
    snakeLength = startingSnakeLength;
    position[0] = startingPosition[0].valueOf();
    position[1] = startingPosition[1].valueOf();
    previousPosition = [[position[0].valueOf(), position[1].valueOf()]];
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
    
    while (applePosition.length < maxApples) {
      createRandomApple();
    }

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
      let temp = [[position[0].valueOf(), position[1].valueOf()]]; //Temporary array that is going to be put into previousPosition for storage
      previousPosition = previousPosition.concat(temp); //Adds in the current position into previousPosition
    
      if (previousPosition.length > snakeLength) { //Checks if there are more drawn squares than the snake shoul have and deletes excess
        drawRegSquare(previousPosition[0][0] * size, previousPosition[0][1] * size); //Draws a black square at the oldest position
        previousPosition = previousPosition.slice(1); //Removes the last position from previousPosition
        
      }

      let checkSnake = previousPosition.slice(0, previousPosition.length - 3); //This cuts off the first three positions from previousPosition so it can be inserted into the next function to check if the snake is hitting itself. This is necessary so it doesn't think the head of the snake is constantly hitting itself and you don't lose instantly
      if (arrayIncludes(checkSnake, position)) { //Checks the head position is within the body, or if the the snake is hitting itself
        hitSelf = true;
        lose();
        return;
      }

      if (arrayIncludes(applePosition, position)) { //AFTER APPLE IS EATEN///////////////////////////////
        createRandomApple();
        snakeLength++;
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
  drawSnakeSquare(startingPosition[0] * size, startingPosition[1] * size, true);
  drawApple(appleStartingPosition[0] * size, appleStartingPosition[1] * size);
  applePosition = [[appleStartingPosition[0].valueOf(), appleStartingPosition[1].valueOf()]];
}

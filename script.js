
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
  
  const sleep = (ms) => {
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
  
  
  
  const squareSizeFactor = 20 //this describes how big or small each square is, lower is bigger, higher is smaller
  const snakeColor = [255, 255, 0]
  
  function squareSize() { //calculates the dimensions of the square based on the screen size
    return game.width / squareSizeFactor;
  }
  
  function createBackGround() { //creates a black and white grid
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'white';
    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        let x = i * squareSize();
        let y = j * squareSize();
        ctx.fillRect(x, y, size, size);
        ctx.strokeRect(x, y, size, size);
      }
    }
  }
  
  function drawRegSquare(x, y) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, size, size);
    ctx.strokeRect(x, y, size, size);
  }
  
  function drawSnakeSquare(x, y) { //draws a square at the given x and y using snake parameters
    ctx.fillStyle = `rgb(${snakeColor[0]} ${snakeColor[1]} ${snakeColor[2]})`; //takes colors and just makes them the fill style
    ctx.fillRect(x, y, squareSize(), squareSize());
    ctx.strokeRect(x, y, squareSize(), squareSize());
  }
  
  //variables for size and stuff
  let size = squareSize();
  let gridX = squareSizeFactor;
  let gridY = squareSizeFactor;
  
  
  //buttons
  const initButton = get('initButton');
  const deadToShop = get('deadToShop');
  const winToShop = get('winToShop');
  const shopToGame = get('goToGame');
  
  
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
  })
  
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
  
  
  function arrayIncludes(array, item) {
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
  let direction = 'none';
  let speed = 20;
  let inGame = false;
  let hitSelf = false;
  let position = [0, 0];
  let snakeLength = 10;
  let previousPosition = [[0, 0]];
  
  
  async function move() {
  
    function keyTracker(key) {
      switch (key) {
        case 'ArrowUp':
          if (direction !== 'down') {
            direction = 'up';
            console.log('up', direction);
          }
          break;
        case 'ArrowDown':
          if (direction !== 'up') {
            direction = 'down';
            console.log('down', direction);
          }
          break;
        case 'ArrowLeft':
          if (direction !== 'right') {
            direction = 'left';
            console.log('left', direction);
          }
          break;
        case 'ArrowRight':
          if (direction !== 'left') {
            direction = 'right';
            console.log('right', direction);
          }
          break;
        default:
          break;
      }
    }
  
    const controller = new AbortController();
    window.addEventListener('keydown', (e) => {
      keyTracker(e.key);
    }, { signal: controller.signal });
    
    while (inGame) {
      await sleep(10000 / speed);
      if (!(position[0] >= 0 && position[0] <= 19 && position[1] >= 0 && position[1] <= 19) || hitSelf) {
        controller.abort();
        inGame = false;
        hitSelf = false;
        position[0] = 0;
        position[1] = 0;
        previousPosition = [[0, 0]];
        game.classList.add('hide');
        dead.classList.remove('hide');
        direction = 'none';
        return;
      }
      
      switch (direction) {
        case 'up':
          position[1] -= 1;
          break;
        case 'down':
          position[1] += 1;
          break;
        case 'right':
          position[0] += 1;
          break;
        case 'left':
          position[0] -= 1;
          break;
        case 'none':
          break;
      }
  
  
      if (direction !== 'none') {
        console.log(position[0], position[1]);
        let temp = [[position[0].valueOf(), position[1].valueOf()]];
        previousPosition = previousPosition.concat(temp);
      
        if (previousPosition.length > snakeLength) {
          drawRegSquare(previousPosition[0][0] * size, previousPosition[0][1] * size);
          previousPosition = previousPosition.slice(1);
          let check = previousPosition.slice(0, previousPosition.length - 3);
          if (arrayIncludes(check, position)) {
            hitSelf = true;
          }
        }
        drawSnakeSquare(position[0] * size, position[1] * size);
      }
    }  
  }
  
  
  function draw(){
    createBackGround();
    drawSnakeSquare(position[0] * squareSizeFactor, position[1] * squareSizeFactor);
  }
let grid;
let cols = 20;
let rows = 20;
const w = 40;
const totalBees = 10;
let gameIsOver = false;
let gameIsWon = false;
let gametimeStart;
let shape1;

function setup() {
    createCanvas(400, 600);
    cols = floor(width / w);
    rows = floor((height-200) / w);
    grid = make2DArray(cols, rows);
    initializeGame();
}

function draw() {
    background(255);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    shape1.over();
    shape1.update();
    shape1.show();
}
  
  function mouseReleased() {
    shape1.released();  
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {                
                // Set marker
                grid[i][j].marker = true;     
                // return to draggable start  
                shape1.x = 150;
                shape1.y = 450;            
            }
        }
    }  
  }

function mousePressed() {
    shape1.pressed();

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                if (mouseButton == 'left') {
                    grid[i][j].reveal(false);
                    if (grid[i][j].bee)
                        gameOver();
                } else {
                    // Set marker
                    grid[i][j].marker = true;                    
                }
            }
        }
    }
}

function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i]  = new Array(rows);
    }
    return arr;
}

function initializeGame() {
    gametimeStart = new Date();
    let gameIsOver = false;
    let gameIsWon = false;

    shape1 = new Draggable(100, 450, 40, 40);

    // Create Cells
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j]  = new Cell(i, j, w);
        }
    }
    // Assign Bees
    let options = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            options.push([i, j]);
        }
    }
    for (let n = 0;n < totalBees; n++) {
        const index = floor(random(options.length));
        const choice = options[index];
        const i = choice[0];
        const j = choice[1];
        options.splice(index, 1);
        grid[i][j].bee = true;
    }

    // Count neighbors
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j].countNeighborBees();
        }
    }
}

function gameOver() {    
    if (!gameIsOver) {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                grid[i][j].reveal(true);
            }
        }
        const div = createP('GAME OVER!');             
        restartGame(div);
    }    
}

function restartGame(div) {
    const restart = createButton('Restart?');
        restart.mousePressed(()=>{            
            initializeGame();
            div.remove();
            restart.remove();
            gameIsOver = false;
        });
}

function calculateGameTime() {
    const now = new Date();
    var diff = now.getTime() - gametimeStart.getTime();
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -=  days * (1000 * 60 * 60 * 24);
    var hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    var mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    var seconds = Math.floor(diff / (1000));
    diff -= seconds * (1000);
    let retext = '';
    if (seconds > 0) retext = `${seconds} segons`;
    if (mins > 0) retext = `${mins} minuts` + retext;
    if (hours > 0) retext = `${hours} hores` + retext;
    if (days > 0) retext = `${days} dies` + retext;
    return retext;
}
class Cell {
    constructor(i, j, w) {
        this.i = i;
        this.j = j;
        this.x = i * w;
        this.y = j * w;
        this.w = w;
        this.neighborCount = 0;
       
        this.bee = false;
        this.marker = false;
        this.revealed = false;
    }

    show() {
        stroke(51);
        noFill();
        if (this.marker) {
            textAlign(CENTER);            
            //fill(255,0,150,75);
            rect(this.x, this.y, this.w, this.w);
            fill(255);
            textSize(20);
            text('⚡', this.x + this.w * 0.5, this.y + this.w - 8);
            
        } else 
            rect(this.x, this.y, this.w, this.w); 

        if (this.revealed) {
            if (this.bee) {   
                noStroke();
                if (gameIsWon) {
                    fill(255);
                    rect(this.x, this.y, this.w, this.w); 
                    textSize(20);
                    text('🍭', this.x + this.w * 0.5, this.y + this.w - 8);
                } else {
                    fill(255);
                    rect(this.x, this.y, this.w, this.w); 
                    textSize(20);
                    text('☠️', this.x + this.w * 0.5, this.y + this.w - 8);
                }
                             
                
            } else {
                fill(200);
                rect(this.x, this.y, this.w, this.w);
                if (this.neighborCount > 0) {
                    textAlign(CENTER);
                    fill(0);
                    textSize(19);
                    text(this.neighborCount, this.x + this.w * 0.5, this.y + this.w - 8);
                }
            }
        }
    }

    contains(x, y) {
        return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
    }

    reveal(isGameOver) {
        this.revealed = true;
        if (this.neighborCount == 0) {
            this.floodFill(isGameOver);
        }
        // Check if game finished
        if (!isGameOver) {
            let unrevealed = 0;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if (!grid[i][j].revealed)
                        unrevealed++;
                }
            }
            if (unrevealed == totalBees && !gameIsWon) {
                let div = createP('FELICITATS!');
                const gametime = calculateGameTime();
                let div2 = createP(`Temps empleat: ${gametime}`);
                gameIsWon = true;
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        grid[i][j].reveal(true);
                    }
                }
                restartGame(div);
            }
        }
    }

    countNeighborBees() {
        if (this.bee) {
            this.neighborCount = -1;
            return;
        }
        let total =0;
        
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                const i = this.i + xoff;
                const j = this.j + yoff;
                if (i > -1 && i < cols && j > -1 && j < rows) {
                    const neighbor = grid[i][j]; 
                    if (neighbor.bee)
                        total++;
                }
            }
        }
        this.neighborCount = total;
    }

    floodFill(isGameOver) {
        for (let xoff = -1; xoff <= 1; xoff++) {
            for (let yoff = -1; yoff <= 1; yoff++) {
                const i = this.i + xoff;
                const j = this.j + yoff;
                if (i > -1 && i < cols && j > -1 && j < rows) {
                    const neighbor = grid[i][j]; 
                    if (!neighbor.bee && !neighbor.revealed)
                        neighbor.reveal(isGameOver);
                }
            }
        }
    }

}


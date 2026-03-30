class SnakeGame {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.spawnFood();
        this.score = 0;
        this.isRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.eatAnimations = [];
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.style.border = '3px solid #00FF00';
        this.canvas.style.backgroundColor = '#0a0a0a';
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '20px auto';
        this.canvas.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
        document.body.appendChild(this.canvas);
        this.canvas.width = gridSize * 25;
        this.canvas.height = gridSize * 25;
        this.cellSize = 25;
        this.setupControls();
        this.createUI();
    }

    createUI() {
        const uiContainer = document.createElement('div');
        uiContainer.style.textAlign = 'center';
        uiContainer.style.color = '#00FF00';
        uiContainer.style.fontFamily = 'Arial, sans-serif';
        uiContainer.style.marginTop = '20px';
        
        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.style.fontSize = '24px';
        this.scoreDisplay.style.marginBottom = '10px';
        this.scoreDisplay.style.fontWeight = 'bold';
        this.scoreDisplay.textContent = `🐍 Score: 0 | Length: 1`;
        
        this.statusDisplay = document.createElement('div');
        this.statusDisplay.style.fontSize = '16px';
        this.statusDisplay.style.color = '#FFD700';
        this.statusDisplay.textContent = '▶ PLAYING - Arrow Keys/WASD to move • Space to pause • R to restart';
        
        uiContainer.appendChild(this.scoreDisplay);
        uiContainer.appendChild(this.statusDisplay);
        document.body.appendChild(uiContainer);
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            
            switch (key) {
                case 'arrowup':
                case 'w':
                    if (this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
                    event.preventDefault();
                    break;
                case 'arrowdown':
                case 's':
                    if (this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
                    event.preventDefault();
                    break;
                case 'arrowleft':
                case 'a':
                    if (this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
                    event.preventDefault();
                    break;
                case 'arrowright':
                case 'd':
                    if (this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
                    event.preventDefault();
                    break;
                case ' ':
                    event.preventDefault();
                    this.gamePaused = !this.gamePaused;
                    this.statusDisplay.textContent = this.gamePaused ? '⏸ PAUSED - Press Space to resume' : '▶ PLAYING - Arrow Keys/WASD to move';
                    break;
                case 'r':
                    this.restart();
                    break;
            }
        });
    }

    spawnFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    update() {
        if (!this.isRunning || this.gamePaused) return;

        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };
        
        // Wrap around boundaries
        head.x = (head.x + this.direction.x + this.gridSize) % this.gridSize;
        head.y = (head.y + this.direction.y + this.gridSize) % this.gridSize;

        // Self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            this.isRunning = false;
            this.statusDisplay.textContent = '💀 GAME OVER! Press R to restart';
            this.statusDisplay.style.color = '#FF0000';
            return;
        }

        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.eatAnimations.push({
                x: this.food.x,
                y: this.food.y,
                life: 15,
                maxLife: 15
            });
            this.food = this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.updateUI();
    }

    updateUI() {
        this.scoreDisplay.textContent = `🐍 Score: ${this.score} | Length: ${this.snake.length}`;
    }

    drawSnake() {
        const head = this.snake[0];
        
        for (let i = this.snake.length - 1; i > 0; i--) {
            const segment = this.snake[i];
            const x = segment.x * this.cellSize;
            const y = segment.y * this.cellSize;
            
            const hue = (i / this.snake.length) * 60 + 120;
            this.context.fillStyle = `hsl(${hue}, 100%, 50%)`;
            this.context.fillRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
            
            this.context.strokeStyle = '#00FF00';
            this.context.lineWidth = 1;
            this.context.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
        }
        
        const headX = head.x * this.cellSize;
        const headY = head.y * this.cellSize;
        
        this.context.fillStyle = '#00FF00';
        this.context.beginPath();
        this.context.arc(headX + this.cellSize / 2, headY + this.cellSize / 2, this.cellSize / 2 - 2, 0, Math.PI * 2);
        this.context.fill();
        
        this.context.strokeStyle = '#FFFF00';
        this.context.lineWidth = 2;
        this.context.stroke();
        
        this.drawSnakeEyes(head, headX, headY);
    }

    drawSnakeEyes(head, headX, headY) {
        this.context.fillStyle = '#000';
        const eyeRadius = 2.5;
        
        if (this.direction.x === 1) {
            this.context.beginPath();
            this.context.arc(headX + 8, headY + 6, eyeRadius, 0, Math.PI * 2);
            this.context.fill();
            this.context.beginPath();
            this.context.arc(headX + 8, headY + 15, eyeRadius, 0, Math.PI * 2);
            this.context.fill();
        } else if (this.direction.x === -1) {
            this.context.beginPath();
            this.context.arc(headX + 4, headY + 6, eyeRadius, 0, Math.PI * 2);
            this.context.fill();
            this.context.beginPath();
            this.context.arc(headX + 4, headY + 15, eyeRadius, 0, Math.PI * 2);
            this.context.fill();
        } else if (this.direction.y === -1) {
            this.context.beginPath();
            this.context.arc(headX + 6, headY + 4, eyeRadius, 0, Math.PI * 2);
            this.context.fill();
            this.context.beginPath();
            this.context.arc(headX + 15, headY + 4, eyeRadius, 0, Math.PI * 2);
            this.context.fill();
        } else if (this.direction.y === 1) {
            this.context.beginPath();
            this.context.arc(headX + 6, headY + 15, eyeRadius, 0, Math.PI * 2);
            this.context.fill();
            this.context.beginPath();
            this.context.arc(headX + 15, headY + 15, eyeRadius, 0, Math.PI * 2);
            this.context.fill();
        }
    }

    drawFood() {
        const foodX = this.food.x * this.cellSize + this.cellSize / 2;
        const foodY = this.food.y * this.cellSize + this.cellSize / 2;
        
        const time = Date.now() / 100;
        const scale = 1 + 0.15 * Math.sin(time);
        
        this.context.fillStyle = '#FF4444';
        this.context.beginPath();
        this.context.arc(foodX, foodY, 6 * scale, 0, Math.PI * 2);
        this.context.fill();
        
        this.context.fillStyle = '#FFAAAA';
        this.context.beginPath();
        this.context.arc(foodX - 2.5, foodY - 2.5, 2.5 * scale, 0, Math.PI * 2);
        this.context.fill();
        
        this.context.strokeStyle = '#88AA00';
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo(foodX, foodY - 6);
        this.context.lineTo(foodX + 1, foodY - 10);
        this.context.stroke();
    }

    drawEatAnimations() {
        this.eatAnimations = this.eatAnimations.filter(anim => anim.life > 0);
        
        this.eatAnimations.forEach(anim => {
            const x = anim.x * this.cellSize + this.cellSize / 2;
            const y = anim.y * this.cellSize + this.cellSize / 2;
            const progress = (anim.maxLife - anim.life) / anim.maxLife;
            
            this.context.strokeStyle = `rgba(255, 255, 0, ${1 - progress})`;
            this.context.lineWidth = 3;
            this.context.beginPath();
            this.context.arc(x, y, 8 + progress * 25, 0, Math.PI * 2);
            this.context.stroke();
            
            this.context.fillStyle = `rgba(255, 255, 0, ${1 - progress})`;
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 12 + progress * 25;
                const px = x + Math.cos(angle) * distance;
                const py = y + Math.sin(angle) * distance;
                this.context.beginPath();
                this.context.arc(px, py, 1.5, 0, Math.PI * 2);
                this.context.fill();
            }
            
            anim.life--;
        });
    }

    render() {
        this.context.fillStyle = '#0a0a0a';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.context.strokeStyle = '#1a3a1a';
        this.context.lineWidth = 0.5;
        for (let i = 0; i <= this.gridSize; i++) {
            const pos = i * this.cellSize;
            this.context.beginPath();
            this.context.moveTo(pos, 0);
            this.context.lineTo(pos, this.canvas.height);
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(0, pos);
            this.context.lineTo(this.canvas.width, pos);
            this.context.stroke();
        }
        
        this.drawFood();
        this.drawSnake();
        this.drawEatAnimations();
    }

    start() {
        this.isRunning = true;
        this.gameOver = false;
        this.gamePaused = false;
        this.statusDisplay.style.color = '#FFD700';
        this.statusDisplay.textContent = '▶ PLAYING - Arrow Keys/WASD to move • Space to pause';
        this.gameLoop();
    }

    restart() {
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.food = this.spawnFood();
        this.score = 0;
        this.eatAnimations = [];
        this.updateUI();
        this.start();
    }

    gameLoop() {
        this.update();
        this.render();
        setTimeout(() => this.gameLoop(), 100);
    }
}

const game = new SnakeGame(20);
game.start();

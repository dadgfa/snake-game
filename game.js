class SnakeGame {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.snake = [{ x: 1, y: 1 }];
        this.direction = { x: 0, y: 0 };
        this.food = this.spawnFood();
        this.isRunning = false;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        this.canvas.width = gridSize * 20;
        this.canvas.height = gridSize * 20;
        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp': this.direction = { x: 0, y: -1 }; break;
                case 'ArrowDown': this.direction = { x: 0, y: 1 }; break;
                case 'ArrowLeft': this.direction = { x: -1, y: 0 }; break;
                case 'ArrowRight': this.direction = { x: 1, y: 0 }; break;
                case 'p': this.pause(); break;
                case 'r': this.restart(); break;
            }
        });
    }

    spawnFood() {
        const x = Math.floor(Math.random() * this.gridSize);
        const y = Math.floor(Math.random() * this.gridSize);
        return { x, y };
    }

    update() {
        if (!this.isRunning) return;
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;

        if (this.checkCollision(head)) {
            this.isRunning = false;
            alert('Game Over!');
            return;
        }

        this.snake.unshift(head);
        if (head.x === this.food.x && head.y === this.food.y) {
            this.food = this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.render();
    }

    checkCollision(head) {
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            return true;
        }
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        return false;
    }

    render() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'green';
        this.snake.forEach(segment => {
            this.context.fillRect(segment.x * 20, segment.y * 20, 20, 20);
        });
        this.context.fillStyle = 'red';
        this.context.fillRect(this.food.x * 20, this.food.y * 20, 20, 20);
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    pause() {
        this.isRunning = false;
    }

    restart() {
        this.snake = [{ x: 1, y: 1 }];
        this.direction = { x: 0, y: 0 };
        this.food = this.spawnFood();
        this.start();
    }

    gameLoop() {
        this.update();
        setTimeout(() => this.gameLoop(), 100);
    }
}

const game = new SnakeGame(20);
game.start();
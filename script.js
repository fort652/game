const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let bird;
let pipes;
let score;
let gameover;
let frames = 0;

// Game constants
const birdX = 50;
const gravity = 0.25;
const jump = -4.6;

function setup() {
    bird = {
        y: canvas.height / 2,
        velocity: 0
    };
    pipes = [];
    score = 0;
    gameover = false;
    // Add a pipe every 100 frames
    frames = 0;
}

function draw() {
    // Background
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameover) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
        return;
    }

    // Bird
    ctx.fillStyle = "#fddb63";
    ctx.beginPath();
    ctx.arc(birdX, bird.y, 12, 0, 2 * Math.PI);
    ctx.fill();

    // Pipes
    ctx.fillStyle = "#74bf2e";
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        ctx.fillRect(p.x, 0, p.width, p.y);
        ctx.fillRect(p.x, p.y + p.gap, p.width, canvas.height - p.y - p.gap);
    }

    // Score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function update() {
    if (gameover) return;

    // Bird
    bird.velocity += gravity;
    bird.y += bird.velocity;

    // Pipes
    if (frames % 100 === 0) {
        let pipeY = Math.random() * (canvas.height - 200) + 50;
        pipes.push({ x: canvas.width, y: pipeY, width: 50, gap: 100 });
    }
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;
    }

    // Remove offscreen pipes
    if (pipes.length > 0 && pipes[0].x < -50) {
        pipes.shift();
    }

    // Collision detection
    // Ground
    if (bird.y > canvas.height - 12) {
        gameover = true;
    }
    // Pipes
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        if (birdX + 12 > p.x && birdX - 12 < p.x + p.width &&
            (bird.y - 12 < p.y || bird.y + 12 > p.y + p.gap)) {
            gameover = true;
        }
    }

    // Score
    for (let i = 0; i < pipes.length; i++) {
        let p = pipes[i];
        if (p.x + p.width < birdX && !p.scored) {
            score++;
            p.scored = true;
        }
    }


    frames++;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if(gameover) {
            setup();
        } else {
            bird.velocity = jump;
        }
    }
});

canvas.addEventListener('click', function(event) {
    if(gameover) {
        setup();
    } else {
        bird.velocity = jump;
    }
});


setup();
gameLoop();

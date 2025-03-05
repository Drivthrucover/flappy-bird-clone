
// Copy the canvas
const canvas = document.getElementById('gameCanvas');

// Ctx brush
const ctx = canvas.getContext('2d');

// Match the canvas size
canvas.width = 400;
canvas.height = 600;

// Score global
let score = 0;

// Start button
let gameStarted = false;

// Game Over marker
let gameOver = false;

// Create the bird
const bird = {
    x: 50,
    y: canvas.height /2,
    width: 35,
    height: 25,
    gravity: 0.5, // gravity Strength
    velocity: 0, // initial Speed
    jumpStrength: -8, // flap Strength
    rotation: 0
}

// Pipe setup
const pipes = [];
const pipe_width = 60;
const pipe_gap = 150;
const pipe_speed = 2;

// Create the pipe
function createPipe() {
    const topPipeHeight = Math.random() * (canvas.height - pipe_gap - 100) + 50;
    pipes.push({
        x: canvas.width, // start from the right
        top_height: topPipeHeight,
        bottomY: topPipeHeight + pipe_gap,
        passed: false
    });
}

// Display the first pipe
createPipe();

// Loop the game at 60fps
function update() {

    // Copy the color
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
        // Draw the bird sitting in place
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

        // Draw the Start text
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press Space or Click to Start', canvas.width / 2, (canvas.height / 2) - 20);

        // Repeat until action is taken
        requestAnimationFrame(update);
        return;
    }

    if (gameOver) {
        drawGameOverScreen();
        return
    }

    // Draw the bird
    ctx.save(); // Save the current state
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2); // Move origin to the bird's center
    ctx.rotate(bird.rotation); // Rotate the canvas
    ctx.fillStyle = 'yellow';
    ctx.fillRect(-bird.width / 2, -bird.height / 2, bird.width, bird.height); // Draw the bird centered
    ctx.restore(); // Restore the original state
    

    // Apply gravity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Bird Rotation
    bird.rotation = Math.min((bird.velocity / 10) * Math.PI / 4, Math.PI / 2);

    // Draw the score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 50, 30);

    // Move and draw the pipes
    ctx.fillStyle = 'green';
    pipes.forEach((pipe, index) => {    
        pipe.x -= pipe_speed;   

        // Draw the top pipe
        ctx.fillRect(pipe.x, 0, pipe_width, pipe.top_height);

        // Draw the bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, pipe_width, canvas.height - pipe.bottomY);

        // Check for collision
        if (
            // If hits top of canvas
            bird.y < 0 ||
            // If hits bottom of canvas
            bird.y + bird.height > canvas.height ||
            // If hits the pipes
            bird.x < pipe.x + pipe_width &&
            bird.x + bird.width > pipe.x &&
            (
                bird.y < pipe.top_height ||
                bird.y + bird.height > pipe.bottomY
            )
        ){
            endGame();
            return;
        }

        // Remove the pipes when they pass the screen
        if (pipe.x + pipe_width < 0) {
            pipes.splice(index, 1);
            createPipe();
        }

        // Increase the score when the bird passes the pipe
        if (!pipe.passed && pipe.x + pipe_width < bird.x) {
            pipe.passed = true;
            score++;
        }
    });

    requestAnimationFrame(update);
}

// flap function
function flap() {
    bird.velocity = bird.jumpStrength;
}

function endGame() {
    gameOver = true;
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Game over text
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center'; 

    ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);

    // Display the score
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Score: ' + score, canvas.width / 2, (canvas.height / 2) + 20);

    // Replay button text
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press Space or Click to Restart', canvas.width / 2, (canvas.height / 2) + 80);
}

function restartGame() {
    // Reset Everything as if its a new game
    score = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    createPipe();
    gameOver = false;
    gameStarted = true;
    update();
}

// Look for spacebar press
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space') {
        // To start the game
        if (!gameStarted) {
            gameStarted = true;
        } else if (gameOver) {
            restartGame();
        }
        flap();
    }
});

// Look for mouseclick or screentap
canvas.addEventListener('click', function () {
    // To start the game
    if (!gameStarted) {
        gameStarted = true;
    } else if (gameOver) {
        restartGame();
    }
    flap();
});

update();
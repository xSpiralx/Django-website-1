const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let player1Score = 0;
let player2Score = 0;

// Ball object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
};

// Paddle object
const paddleWidth = 10;
const paddleHeight = 100;

const player = {
    x: 0, // left side
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "WHITE",
    score: 0
};

const ai = {
    x: canvas.width - paddleWidth, // right side
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "WHITE",
    score: 0
};

// Draw rectangle function
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Draw circle function
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw text function
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

// Render function
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");

    // Draw the net
    drawNet();

    // Draw scores
    drawText(player1Score, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(player2Score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

    // Draw the paddles
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

    // Draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Game initialization
function game() {
    update();
    render();
}

// Collision detection
function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// Reset the ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

// Update function
function update() {
    // Move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Simple AI to control the paddle
    ai.y += (ball.y - (ai.y + ai.height / 2)) * 0.1;

    // When the ball collides with the top or bottom wall
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Determine which paddle to check collision with (player or ai)
    let playerPaddle = (ball.x < canvas.width / 2) ? player : ai;

    // If the ball hits the paddle
    if (collision(ball, playerPaddle)) {
        // Where the ball hit the paddle
        let collidePoint = (ball.y - (playerPaddle.y + playerPaddle.height / 2));

        // Normalize the value of collidePoint, we need to get numbers between -1 and 1
        collidePoint = collidePoint / (playerPaddle.height / 2);

        // Calculate the angle in radians
        let angleRad = collidePoint * Math.PI / 4;

        // X direction of the ball when it's hit
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;

        // Change velocity of the ball
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Increase speed
        ball.speed += 5;
    }

    // Update the score
    if (ball.x - ball.radius < 0) {
        // AI scores a point
        player2Score++;
        document.getElementById('player2Score').innerText = `Player 2: ${player2Score}`;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        // Player scores a point
        player1Score++;
        document.getElementById('player1Score').innerText = `Player 1: ${player1Score}`;
        resetBall();
    }
}

// Draw the net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "WHITE");
    }
}

// Start the game loop
const framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);

// Move player paddle
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;
}

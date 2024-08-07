document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pongCanvas');
    const context = canvas.getContext('2d');

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    const ballRadius = 10;

    const paddleWidth = 10;
    const paddleHeight = 100;
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;
    const paddleSpeed = 10;

    function drawRect(x, y, width, height, color) {
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }

    function drawCircle(x, y, radius, color) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, true);
        context.fill();
    }

    function drawNet() {
        for (let i = 0; i < canvas.height; i += 40) {
            drawRect(canvas.width / 2 - 1, i, 2, 20, 'white');
        }
    }

    function draw() {
        drawRect(0, 0, canvas.width, canvas.height, 'black');
        drawNet();
        drawRect(0, paddle1Y, paddleWidth, paddleHeight, 'white');
        drawRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight, 'white');
        drawCircle(ballX, ballY, ballRadius, 'white');
    }

    function update() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX + ballRadius > canvas.width) {
            if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            } else {
                ballX = canvas.width / 2;
                ballY = canvas.height / 2;
                ballSpeedX = -ballSpeedX;
            }
        }

        if (ballX - ballRadius < 0) {
            if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            } else {
                ballX = canvas.width / 2;
                ballY = canvas.height / 2;
                ballSpeedX = -ballSpeedX;
            }
        }

        if (ballY > paddle2Y + paddleHeight / 2) {
            paddle2Y += paddleSpeed;
        } else {
            paddle2Y -= paddleSpeed;
        }
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        const mouseY = event.clientY - rect.top - root.scrollTop;
        paddle1Y = mouseY - paddleHeight / 2;
    });

    gameLoop();
});

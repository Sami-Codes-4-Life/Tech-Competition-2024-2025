const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 0.8;
let friction = 0.9;

const spriteImage = new Image();
spriteImage.src = "http://www.avatarsinpixels.com/minipix/eyJQYW50cyI6IjEiLCJKYWNrZXQiOiI0IiwiSGF0IjoiNSJ9/1/show.png";

const player1 = {
    x: 100,
    y: canvas.height - 150,
    width: 50, 
    height: 50, 
    dx: 0,
    dy: 0,
    speed: 5,
    jumpPower: -15,
    grounded: false,
  };

const player2 = {
    x: 300,
    y: canvas.height - 150,
    width: 50, 
    height: 50, 
    dx: 0,
    dy: 0,
    speed: 5,
    jumpPower: -15,
    grounded: false,
    };

const platform = {
    x: 50,
    y: canvas.height - 100,
    width: 800,
    height: 20,
    color: "#0d47a1",
    z-index: 9999;
};

const keys = {
    right1: false,
    left1: false,
    up1: false,
    right2: false,
    left2: false,
    up2: false,
};

document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowRight") keys.right1 = true;
    if (event.code === "ArrowLeft") keys.left1 = true;
    if (event.code === "ArrowUp" && player1.grounded) {
        player1.dy = player1.jumpPower;
        player1.grounded = false;
    }
    if (event.code === "KeyD") keys.right2 = true;
    if (event.code === "KeyA") keys.left2 = true;
    if (event.code === "KeyW" && player2.grounded) {
        player2.dy = player2.jumpPower;
        player2.grounded = false;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowRight") keys.right1 = false;
    if (event.code === "ArrowLeft") keys.left1 = false;
    if (event.code === "KeyD") keys.right2 = false;
    if (event.code === "KeyA") keys.left2 = false;
});

function update() {
    if (keys.right1) {
        player1.dx = player1.speed;
    } else if (keys.left1) {
        player1.dx = -player1.speed;
    } else {
        player1.dx *= friction;
    }

    if (keys.right2) {
        player2.dx = player2.speed;
    } else if (keys.left2) {
        player2.dx = -player2.speed;
    } else {
        player2.dx *= friction;
    }

    player1.dy += gravity;
    player2.dy += gravity;

    player1.x += player1.dx;
    player2.x += player2.dx;

    player1.y += player1.dy;
    player2.y += player2.dy;

    if (player1.y + player1.height >= platform.y && player1.x + player1.width >= platform.x && player1.x <= platform.x + platform.width) {
        player1.y = platform.y - player1.height;
        player1.dy = 0;
        player1.grounded = true;
    } else {
        player1.grounded = false;
    }

    if (player2.y + player2.height >= platform.y && player2.x + player2.width >= platform.x && player2.x <= platform.x + platform.width) {
        player2.y = platform.y - player2.height;
        player2.dy = 0;
        player2.grounded = true;
    } else {
        player2.grounded = false;
    }

    if (player1.y + player1.height >= canvas.height) {
        player1.y = canvas.height - player1.height;
        player1.dy = 0;
        player1.grounded = true;
    }

    if (player2.y + player2.height >= canvas.height) {
        player2.y = canvas.height - player2.height;
        player2.dy = 0;
        player2.grounded = true;
    }

    if (player1.x < 0) {
        player1.x = 0;
    } else if (player1.x + player1.width > canvas.width) {
        player1.x = canvas.width - player1.width;
    }

    if (player2.x < 0) {
        player2.x = 0;
    } else if (player2.x + player2.width > canvas.width) {
        player2.x = canvas.width - player2.width;
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    ctx.drawImage(spriteImage, player1.x, player1.y, player1.width, player1.height);
    ctx.drawImage(spriteImage, player2.x, player2.y, player2.width, player2.height);
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

spriteImage.onload = gameLoop;

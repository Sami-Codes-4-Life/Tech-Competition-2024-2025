const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1.5;
let fallSpeedModifier = 0.4;
let friction = 0.9;

const spriteImage = new Image();
spriteImage.src = "http://www.avatarsinpixels.com/minipix/eyJQYW50cyI6IjEiLCJKYWNrZXQiOiI0IiwiSGF0IjoiNSJ9/1/show.png";

spriteImage.onerror = () => {
    console.error("Image failed to load.");
};

const player1 = {
    x: 100,
    y: canvas.height - 150,
    width: 85, 
    height: 85, 
    dx: 0,
    dy: 0,
    speed: 5,
    jumpPower: -15,
    grounded: false,
};

const player2 = {
    x: 300,
    y: canvas.height - 150,
    width: 85, 
    height: 85, 
    dx: 0,
    dy: 0,
    speed: 5,
    jumpPower: -15,
    grounded: false,
};

const platform = {
    x: 50,
    y: canvas.height - 100,
    width: 800000,
    height: 20,
    color: "#006400",
};

// Moving wall object
const movingWall = {
    x: 400,
    y: canvas.height - 100,
    width: 20,
    height: 125,
    color: "#FF5722",
    dx: 2, // Speed of the moving wall
};

const keys = {
    right1: false,
    left1: false,
    up1: false,
    right2: false,
    left2: false,
    up2: false,
};

// Camera object
const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
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

function updateCamera() {
    camera.x = player1.x + player1.width / 2 - camera.width / 2;
    camera.y = player1.y + player1.height / 2 - camera.height / 2;
    camera.x = Math.max(0, Math.min(camera.x, canvas.width - camera.width));
    camera.y = Math.max(0, Math.min(camera.y, canvas.height - camera.height));
}

function checkWallCollision(player, wall) {
    if (player.x + player.width >= wall.x && 
        player.x <= wall.x + wall.width && 
        player.y + player.height >= wall.y - wall.height && 
        player.y <= wall.y) {
        
        if (player.dy > 0) {
            player.y = wall.y - player.height;
            player.dy = 0;
            player.grounded = true;
        } else {
            if (player.x < wall.x) {
                player.x = wall.x - player.width;
            } else {
                player.x = wall.x + wall.width;
            }
            player.dx = 0;
        }
    }
}

// Update function for the moving wall
function updateMovingWall() {
    movingWall.x += movingWall.dx;

    // Reverse direction when the wall hits the edge of the screen
    if (movingWall.x + movingWall.width > canvas.width || movingWall.x < 0) {
        movingWall.dx = -movingWall.dx;
    }
}

function update() {
    if (keys.right1) {
        player1.dx = player1.speed;
    } else if (keys.left1) {
        player1.dx = -player1.speed;
    } else {
        player1.dx = 0;
    }

    if (keys.right2) {
        player2.dx = player2.speed;
    } else if (keys.left2) {
        player2.dx = -player2.speed;
    } else {
        player2.dx = 0;
    }

    if (!player1.grounded) {
        player1.dy += gravity * fallSpeedModifier;
    }
    
    if (!player2.grounded) {
        player2.dy += gravity * fallSpeedModifier;
    }

    player1.x += player1.dx;
    player2.x += player2.dx;

    player1.y += player1.dy;
    player2.y += player2.dy;

    // Platform collision detection
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

    // Check collisions with the moving wall
    checkWallCollision(player1, movingWall);
    checkWallCollision(player2, movingWall);

    // Update the moving wall
    updateMovingWall();

    // Prevent players from falling below the ground
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

    // Prevent players from going off-screen
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

    updateCamera(); 
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Draw the moving wall
    ctx.fillStyle = movingWall.color;
    ctx.fillRect(movingWall.x, movingWall.y - movingWall.height, movingWall.width, movingWall.height);

    ctx.drawImage(spriteImage, player1.x, player1.y, player1.width, player1.height);
    ctx.drawImage(spriteImage, player2.x, player2.y, player2.width, player2.height);

    ctx.restore();
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

spriteImage.onload = () => {
    gameLoop();
    console.log("Game loop started.");
};

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Adjust gravity and add fall speed modifier
let gravity = 1.5; // Original gravity
let fallSpeedModifier = 0.4; // Slow down the fall speed
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


// Wall object
const wall = {
    x: 400, // X position of the wall
    y: canvas.height - 100, // Y position of the wall
    width: 20, // Width of the wall
    height: 125, // Height of the wall
    color: "#FF5722", // Color of the wall
}

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
    // Center the camera on player1
    camera.x = player1.x + player1.width / 2 - camera.width / 2;
    camera.y = player1.y + player1.height / 2 - camera.height / 2;

    // Optional: Limit camera movement within the game world
    camera.x = Math.max(0, Math.min(camera.x, canvas.width - camera.width));
    camera.y = Math.max(0, Math.min(camera.y, canvas.height - camera.height));
}

function checkWallCollision(player) {
    if (player.x + player.width >= wall.x && 
        player.x <= wall.x + wall.width && 
        player.y + player.height >= wall.y - wall.height && 
        player.y <= wall.y) {
        
        // Check if the player is falling down
        if (player.dy > 0) {
            player.y = wall.y - player.height; // Place player on top of the wall
            player.dy = 0; // Reset the vertical velocity
            player.grounded = true; // Set grounded to true
        } else {
            // Handle player hitting the wall horizontally
            if (player.x < wall.x) {
                player.x = wall.x - player.width; // Move player to the left of the wall
            } else {
                player.x = wall.x + wall.width; // Move player to the right of the wall
            }
            player.dx = 0; // Stop player movement
        }
    }
}

function update() {
    if (keys.right1) {
        player1.dx = player1.speed;
    } else if (keys.left1) {
        player1.dx = -player1.speed;
    } else {
        player1.dx = 0; // Reset dx to prevent sliding
    }

    if (keys.right2) {
        player2.dx = player2.speed;
    } else if (keys.left2) {
        player2.dx = -player2.speed;
    } else {
        player2.dx = 0; // Reset dx to prevent sliding
    }

    // Modify gravity application to use the fall speed modifier
    if (!player1.grounded) {
        player1.dy += gravity * fallSpeedModifier; // Slow down falling
    }
    
    if (!player2.grounded) {
        player2.dy += gravity * fallSpeedModifier; // Slow down falling
    }

    player1.x += player1.dx;
    player2.x += player2.dx;

    player1.y += player1.dy;
    player2.y += player2.dy;

    // Collision detection with platform
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

    // Check collisions with the wall
    checkWallCollision(player1);
    checkWallCollision(player2);

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

    updateCamera(); // Update camera position
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Adjust drawing to camera
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Draw the wall
    ctx.fillStyle = wall.color;
    ctx.fillRect(wall.x, wall.y - wall.height, wall.width, wall.height); // Draw the wall

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

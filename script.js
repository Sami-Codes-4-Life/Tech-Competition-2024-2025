const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1.5; // Original gravity
let fallSpeedModifier = 0.4; // Slow down the fall speed
let friction = 0.9;

// Load new sprite images for characters
const player1Image = new Image();
player1Image.src = "https://www.avatarsinpixels.com/minipix/eyJTaG9lcyI6IjEiLCJQYW50cyI6IjEiLCJKYWNrZXQiOiIyIiwiSGF0IjoiNSIsImV5ZXNUb25lIjoiMDBhZWVmIiwicGFudHNUb25lIjoiMDA5OWRkIiwicGFudHNUb25lMiI6IjAwOTlkZCIsInNob2VzVG9uZSI6IjAwOTlkZCIsImhhdFRvbmUiOiIwMDk5ZGQiLCJoYXRUb25lMiI6IjAwYWVlZiIsImphY2tldFRvbmUiOiIwMDk5ZGQiLCJqYWNrZXRUb25lMiI6IjAwOTlkZCJ9/1/show.png";

const player2Image = new Image();
player2Image.src = "https://www.avatarsinpixels.com/minipix/eyJTaG9lcyI6IjEiLCJQYW50cyI6IjEiLCJKYWNrZXQiOiIyIiwiSGF0IjoiNSIsImV5ZXNUb25lIjoiMDBhZWVmIiwicGFudHNUb25lIjoiZGQwMDAwIiwicGFudHNUb25lMiI6ImRkMDAwMCIsInNob2VzVG9uZSI6ImRkMDAwMCIsImhhdFRvbmUiOiJkZDAwMDAiLCJoYXRUb25lMiI6ImRkMDAwMCIsImphY2tldFRvbmUiOiJkZDAwMDAiLCJqYWNrZXRUb25lMiI6ImRkMDAwMCJ9/1/show.png";

player1Image.onerror = () => {
    console.error("Player 1 image failed to load.");
};

player2Image.onerror = () => {
    console.error("Player 2 image failed to load.");
};

const player1 = {
    x: 100,
    y: canvas.height - 150,
    width: 85, 
    height: 85, 
    dx: 0,
    dy: 0,
    speed: 5, // Reset speed for player1
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
    speed: 5, // Reset speed for player2
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

// Moving wall 1
let movingWall = {
    x: canvas.width, // Start from the right edge of the screen
    y: canvas.height - 100,
    width: 20,
    height: 125,
    color: "#FF5722",
    dx: -3, // Speed for the first wall
};

// Moving wall 2 (faster and shorter)
let movingWall2 = null; // Initially set to null, will be created after movingWall disappears

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

// Update function for the moving walls
function updateMovingWalls() {
    if (movingWall) {
        movingWall.x += movingWall.dx;
        if (movingWall.x + movingWall.width < 0) {
            movingWall = null; // Remove the wall (it disappears)
            // Create the second moving wall after the first disappears
            movingWall2 = {
                x: canvas.width, // Start from the right edge of the screen
                y: canvas.height - 100,
                width: 20,
                height: 75, // Shorter than the first wall
                color: "#FF0000", // Different color
                dx: -5, // Speed for the second wall
            };
        }
    }

    if (movingWall2) {
        movingWall2.x += movingWall2.dx;
        if (movingWall2.x + movingWall2.width < 0) {
            movingWall2 = null; // Remove the second wall (it disappears)
        }
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

    // Check collisions with both moving walls
    if (movingWall) {
        checkWallCollision(player1, movingWall);
        checkWallCollision(player2, movingWall);
    }

    if (movingWall2) {
        checkWallCollision(player1, movingWall2);
        checkWallCollision(player2, movingWall2);
    }

    // Update the moving walls
    updateMovingWalls();

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

    // Draw the moving walls
    if (movingWall) {
        ctx.fillStyle = movingWall.color;
        ctx.fillRect(movingWall.x, movingWall.y - movingWall.height, movingWall.width, movingWall.height); // Draw the first moving wall
    }

    if (movingWall2) {
        ctx.fillStyle = movingWall2.color;
        ctx.fillRect(movingWall2.x, movingWall2.y - movingWall2.height, movingWall2.width, movingWall2.height); // Draw the second moving wall
    }

    // Draw characters
    ctx.drawImage(player1Image, player1.x, player1.y, player1.width, player1.height);
    ctx.drawImage(player2Image, player2.x, player2.y, player2.width, player2.height);
    
    ctx.restore();
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

player1Image.onload = () => {
    player2Image.onload = () => {
        gameLoop();
        console.log("Game loop started.");
    };
};

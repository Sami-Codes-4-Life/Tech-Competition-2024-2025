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

// Moving walls
let movingWalls = [
    { x: canvas.width, y: canvas.height - 100, width: 20, height: 125, color: "#FF5722", dx: -3 }, // Wall 1
    null, // Wall 2
    null, // Wall 3
    null  // Wall 4
];

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
    for (let i = 0; i < movingWalls.length; i++) {
        if (movingWalls[i]) {
            movingWalls[i].x += movingWalls[i].dx;
            if (movingWalls[i].x + movingWalls[i].width < 0) {
                movingWalls[i] = null; // Remove the wall (it disappears)
                
                // Create a new wall only if the current index is less than 3
                if (i < 3) {
                    movingWalls[i + 1] = {
                        x: canvas.width, // Start from the right edge of the screen
                        y: canvas.height - 100,
                        width: 20,
                        height: 75 - (i * 10), // Different heights for each wall
                        color: i === 0 ? "#FF0000" : (i === 1 ? "#0000FF" : "#FFFF00"), // Different colors
                        dx: -(3 + i) // Increase speed for each subsequent wall
                    };
                }
            }
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

    // Apply gravity if not grounded
    if (!player1.grounded) {
        player1.dy += gravity * fallSpeedModifier;
    }
    
    if (!player2.grounded) {
        player2.dy += gravity * fallSpeedModifier;
    }

    // Update positions
    player1.x += player1.dx;
    player1.y += player1.dy;
    player2.x += player2.dx;
    player2.y += player2.dy;

    // Prevent player1 from going off-screen horizontally
    if (player1.x < 0) {
        player1.x = 0; // Prevent going past the left edge
    } else if (player1.x + player1.width > canvas.width) {
        player1.x = canvas.width - player1.width; // Prevent going past the right edge
    }

    // Prevent player1 from going off-screen vertically
    if (player1.y < 0) {
        player1.y = 0; // Prevent going above the top
        player1.dy = 0; // Stop upward velocity
    } else if (player1.y + player1.height > canvas.height) {
        player1.y = canvas.height - player1.height; // Prevent going below the bottom
        player1.dy = 0; // Stop downward velocity
        player1.grounded = true; // Assume player lands on the ground
    }

    // Prevent player2 from going off-screen horizontally
    if (player2.x < 0) {
        player2.x = 0;
    } else if (player2.x + player2.width > canvas.width) {
        player2.x = canvas.width - player2.width;
    }

    // Prevent player2 from going off-screen vertically
    if (player2.y < 0) {
        player2.y = 0;
        player2.dy = 0;
    } else if (player2.y + player2.height > canvas.height) {
        player2.y = canvas.height - player2.height;
        player2.dy = 0;
        player2.grounded = true;
    }

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

    // Check collisions with all moving walls
    movingWalls.forEach(wall => {
        if (wall) {
            checkWallCollision(player1, wall);
            checkWallCollision(player2, wall);
        }
    });

    updateMovingWalls();
    updateCamera();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw platform
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    // Draw players
    ctx.drawImage(player1Image, player1.x, player1.y, player1.width, player1.height);
    ctx.drawImage(player2Image, player2.x, player2.y, player2.width, player2.height);

    // Draw moving walls
    movingWalls.forEach(wall => {
        if (wall) {
            ctx.fillStyle = wall.color;
            ctx.fillRect(wall.x, wall.y - wall.height, wall.width, wall.height);
        }
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

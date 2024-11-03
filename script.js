const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1.5;
let fallSpeedModifier = 0.4;

const player1Image = new Image();
player1Image.src = "Character_Image_1.png";

const player2Image = new Image();
player2Image.src = "Character_Image_2.png";

const player1 = {
    x: 100,
    y: canvas.height - 150,
    width: 85,
    height: 85,
    dx: 0,
    dy: 0,
    speed: 7,
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
    speed: 7,
    jumpPower: -15,
    grounded: false,
};

const platform = {
    x: 50,
    y: canvas.height - 100,
    width: 500000,
    height: 10,
    color: "#56BA3F",
};

let movingWalls = [
    { x: canvas.width, y: canvas.height - 100, width: 20, height: 125, color: "#FF5722", dx: -5 }
];

let platformCounter = 0;
let platforms = [];

const initialPlatforms = [
    { x: 100, y: canvas.height - 200, width: 100, height: 10, color: "#0000FF" },
    { x: 400, y: canvas.height - 250, width: 120, height: 10, color: "#FF0000" },
    { x: 700, y: canvas.height - 300, width: 120, height: 10, color: "#FFFF00" },
    { x: 1000, y: canvas.height - 350, width: 120, height: 10, color: "#00FF00" },
    { x: 1300, y: canvas.height - 400, width: 120, height: 10, color: "#FF00FF" }
];

const keys = {
    right1: false,
    left1: false,
    up1: false,
    right2: false,
    left2: false,
    up2: false,
};

const camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
};

let player1Score = 0;
let player2Score = 0;

const flag = {
    x: 0,
    y: 0,
    width: 20,
    height: 70,
    color: "#FFFFFE",
    visible: false,
};

let gameOver = false;
let winMessage = "";
let gameStarted = false;
let instructionsDisplayed = false;

// New variable to track the pop-up state
let popUpVisible = true;

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

// Update click event to start the game and hide the pop-up
canvas.addEventListener("click", () => {
    if (popUpVisible) {
        gameStarted = true;
        popUpVisible = false;  // Hide the pop-up after starting the game
        instructionsDisplayed = false;
    }
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
            // Player lands on top of the wall
            player.y = wall.y - player.height;
            player.dy = 0;
            player.grounded = true;
        } else {
            // Handle collision from the sides
            if (player.x < wall.x) {
                // Collision from the left side
                player.x = wall.x - player.width;
                player.dx = wall.dx; // Push player with wall's speed
            } else {
                // Collision from the right side
                player.x = wall.x + wall.width;
                player.dx = wall.dx; // Push player with wall's speed
            }
        }
    }
}



function updateMovingWalls() {
    movingWalls.forEach((wall, i) => {
        if (wall) {
            wall.x += wall.dx;
            if (wall.x + wall.width < 0) {
                movingWalls[i] = null;
                platformCounter++;
                if (i < 3) {
                    movingWalls[i + 1] = {
                        x: canvas.width,
                        y: canvas.height - 100,
                        width: 20,
                        height: 120 - (i * 12),
                        color: i === 0 ? "#51414F" : (i === 1 ? "#7B3F00" : "#FFFF00"),
                        dx: -(3 + i)
                    };
                }
            }
        }
    });

    if (platformCounter >= 4 && platforms.length === 0) {
        initialPlatforms.forEach(platformData => {
            platforms.push(platformData);
        });
        flag.x = platforms[platforms.length - 1].x + platforms[platforms.length - 1].width / 2 - flag.width / 2;
        flag.y = platforms[platforms.length - 1].y - flag.height;
        flag.visible = true;
    }
}

function checkFlagCollision(player) {
    if (flag.visible &&
        player.x + player.width >= flag.x &&
        player.x <= flag.x + flag.width &&
        player.y + player.height >= flag.y &&
        player.y <= flag.y + flag.height) {
        if (player === player1) {
            console.log("player 1 touched the flag");
            player1Score++;
            winMessage = "CHARACTER 1 TOUCHED THE FLAG!";
            document.body.classList.add("background_tech_competition_2"); // Change background
        } else if (player === player2) {
            console.log("player 2 touched the flag");
            player2Score++;
            winMessage = "CHARACTER 2 TOUCHED THE FLAG!";
            document.body.classList.add("background_tech_competition_2"); // Change background
        }
        flag.visible = false; // Hide the flag after it's touched
        // Hide sky and buildings here if they are drawn in a specific way
        platform.visible = false;
    }
}

function checkPlatformCollision(player) {
    let isOnPlatform = false;

    if (player.y + player.height >= platform.y && player.x + player.width >= platform.x && player.x <= platform.x + platform.width) {
        player.y = platform.y - player.height;
        player.dy = 0;
        player.grounded = true;
        isOnPlatform = true;
    }

    platforms.forEach(p => {
        if (player.x + player.width >= p.x && player.x <= p.x + p.width && player.y + player.height >= p.y && player.y <= p.y + p.height) {
            if (player.dy > 0) {
                player.y = p.y - player.height;
                player.dy = 0;
                player.grounded = true;
                isOnPlatform = true;
            }
        }
    });

    if (!isOnPlatform) {
        player.grounded = false;
    }

    checkFlagCollision(player);
}

function update() {
    if (gameOver) return;

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

    // Apply gravity to players
    if (!player1.grounded) {
        player1.dy += gravity * fallSpeedModifier;
    }
    if (!player2.grounded) {
        player2.dy += gravity * fallSpeedModifier;
    }

    // Update players' positions
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Prevent players from falling below ground
    if (player1.y + player1.height > canvas.height - platform.height) {
        player1.y = canvas.height - platform.height - player1.height;
        player1.dy = 0;
        player1.grounded = true;
    }

    if (player2.y + player2.height > canvas.height - platform.height) {
        player2.y = canvas.height - platform.height - player2.height;
        player2.dy = 0;
        player2.grounded = true;
    }

    // Move players according to their speed
    player1.x += player1.dx;
    player2.x += player2.dx;

    if (player1.x < 0) player1.x = 0;
    if (player1.x + player1.width > canvas.width) player1.x = canvas.width - player1.width;
    if (player2.x < 0) player2.x = 0;
    if (player2.x + player2.width > canvas.width) player2.x = canvas.width - player2.width;


    // Check collisions with moving walls
    movingWalls.forEach(wall => {
        if (wall) {
            checkWallCollision(player1, wall);
            checkWallCollision(player2, wall);
        }
    });

    checkPlatformCollision(player1);
    checkPlatformCollision(player2);

    updateMovingWalls();
    updateCamera();
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Check if the background image should be drawn
    if (document.body.classList.contains("background_tech_competition_2")) {
        const backgroundImage = new Image();
        backgroundImage.src = "Tech_competition_background_2.png";
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        // Draw the sky and buildings here if applicable
    }

    // Draw ground, platforms, and walls as before...
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

    platforms.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.width, p.height);
    });

    movingWalls.forEach(wall => {
        if (wall) {
            ctx.fillStyle = wall.color;
            ctx.fillRect(wall.x, wall.y - wall.height, wall.width, wall.height);
        }
    });

    // Draw players
    ctx.drawImage(player1Image, player1.x, player1.y, player1.width, player1.height);
    ctx.drawImage(player2Image, player2.x, player2.y, player2.width, player2.height);

    // Display the flag if visible
    if (flag.visible) {
        ctx.fillStyle = flag.color;
        ctx.fillRect(flag.x, flag.y, flag.width, flag.height);
    }

    // Display scores and game messages as before...
    ctx.fillStyle = "#FFD700";
    ctx.font = "24px Arial";
    ctx.fillText(`Player 1 Score: ${player1Score}`, 10, 30);
    ctx.fillText(`Player 2 Score: ${player2Score}`, 10, 60);

    if (gameOver) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 - 50, 300, 100);
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.fillText(winMessage, canvas.width / 2 - 100, canvas.height / 2);
    }

    // Draw the pop-up if it is still visible
    if (popUpVisible) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(canvas.width / 2 - 400, canvas.height / 2 - 150, 800, 300);
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.fillText("Hello! Your goal is to get the flag before the other player gets the points.", canvas.width / 2 - 380, canvas.height / 2 - 100);
        ctx.fillText("The Buttons for Player One are W, A, and D.", canvas.width / 2 - 380, canvas.height / 2 - 60);
        ctx.fillText("The Controls for Player 2 are the Up arrow, and the Left/Right arrow.", canvas.width / 2 - 380, canvas.height / 2 - 20);
        ctx.fillText("As you move from world to world, it gets harder and harder.", canvas.width / 2 - 380, canvas.height / 2 + 20);
        ctx.fillText("But now it's easy. All you have to do is jump over the walls and reach the last platform.", canvas.width / 2 - 380, canvas.height / 2 + 60);
        ctx.fillText("But it's ok if you get hit by them now, but that won't be true in the future.", canvas.width / 2 - 380, canvas.height / 2 + 100);
        ctx.fillText("Click anywhere to start.", canvas.width / 2 - 380, canvas.height / 2 + 140);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

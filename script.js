const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1.5;
let fallSpeedModifier = 0.4;
let friction = 0.9;

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
    speed: 4,
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
    speed: 4,
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

let movingWalls = [
    { x: canvas.width, y: canvas.height - 100, width: 20, height: 125, color: "#FF5722", dx: -2 },
];

let platformCounter = 0;
let platforms = [];

const initialPlatforms = [
    { x: 200, y: canvas.height - 200, width: 100, height: 15, color: "#0000FF" },
    { x: 400, y: canvas.height - 250, width: 120, height: 15, color: "#FF0000" },
    { x: 600, y: canvas.height - 300, width: 150, height: 15, color: "#FFFF00" },
    { x: 800, y: canvas.height - 350, width: 120, height: 15, color: "#00FF00" },
    { x: 1000, y: canvas.height - 400, width: 150, height: 15, color: "#FF00FF" },
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
                        dx: -(1 + i)
                    };
                }
            }
        }
    });

    if (platformCounter >= 4 && platforms.length === 0) {
        initialPlatforms.forEach(platformData => {
            platforms.push(platformData);
        });
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
    player1.y += player1.dy;
    player2.x += player2.dx;
    player2.y += player2.dy;

    if (player1.x < 0) player1.x = 0;
    if (player2.x < 0) player2.x = 0;

    checkPlatformCollision(player1);
    checkPlatformCollision(player2);

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
    
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x - camera.x, platform.y - camera.y, platform.width, platform.height);
    
    movingWalls.forEach(wall => {
        if (wall) {
            ctx.fillStyle = wall.color;
            ctx.fillRect(wall.x - camera.x, wall.y - camera.y - wall.height, wall.width, wall.height);
        }
    });
    
    platforms.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - camera.x, p.y - camera.y, p.width, p.height);
    });
    
    ctx.drawImage(player1Image, player1.x - camera.x, player1.y - camera.y, player1.width, player1.height);
    ctx.drawImage(player2Image, player2.x - camera.x, player2.y - camera.y, player2.width, player2.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

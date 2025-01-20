const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

console.log(`Canvas Width: ${canvas.width}, Canvas Height: ${canvas.height}`);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gravity = 1.5;
let fallSpeedModifier = 0.4;

const player1Image = new Image();
player1Image.src = "Character_Image_1.png";

const player2Image = new Image();
player2Image.src = "Character_Image_2.png";


const backgroundMusic = new Audio("Song_for_Tech_Competition_2024-2025.mp3"); 
backgroundMusic.loop = true; 
backgroundMusic.volume = 0.4; 

function startBackgroundMusic() {
    backgroundMusic.play().catch(error => {
        console.error("Error playing background music:", error);
    });
}

function stopBackgroundMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; 
}

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
    isOnPlatform: false,
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
    isOnPlatform: false,
};

const platform = {
    x: 50,
    y: canvas.height - 100,
    width: 500000,
    height: 10,
    color: "#FFFFFF00",
};

let movingWalls = [
    { x: canvas.width, y: canvas.height - 100, width: 20, height: 125, color: "#FF5722", dx: -5 }
];

let platformCounter = 0;
let platforms = [];

const FloatingPlatforms = [
    { x: 100, y: canvas.height - 300, width: 100, height: 10, color: "#0000FF"},
    { x: 400, y: canvas.height - 350, width: 120, height: 10, color: "#FF0000"},
    { x: 700, y: canvas.height - 400, width: 120, height: 10, color: "#FFFF00"},
    { x: 1000, y: canvas.height - 450, width: 120, height: 10, color: "#00FF00"},
    { x: 1300, y: canvas.height - 500, width: 120, height: 10, color: "#FF00FF"},
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
    width: 90,
    height: 90,
    visible: false,
};

const flagImage = new Image();
flagImage.src = "Portal_for_Video_game.png";

let gameOver = false;
let winMessage = "";
let gameStarted = false;
let instructionsDisplayed = false;

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

canvas.addEventListener("click", () => {
    if (popUpVisible) {
        gameStarted = true;
        popUpVisible = false;
        instructionsDisplayed = false;

       
        startBackgroundMusic();
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
            
            player.y = wall.y - player.height;
            player.dy = 0;
            player.grounded = true;
        } else {
            
            if (player.x < wall.x) {
                
                player.x = wall.x - player.width;
                player.dx = wall.dx;
            } else {
                
                player.x = wall.x + wall.width;
                player.dx = wall.dx; 
            }
        }
    }
}

function updateMovingWalls() {
    if (popUpVisible) return;
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
        FloatingPlatforms.forEach(platformData => {
            platforms.push(platformData);
        });
        flag.x = platforms[platforms.length - 1].x + platforms[platforms.length - 1].width / 2 - flag.width / 2;
        flag.y = platforms[platforms.length - 1].y - flag.height;
        flag.visible = true;

    }
}

let showSecondPopup = false;
let drawThirdPopup = false;
let showFourthPopup = false;
let showFifthPopup = false;
let drawSixthPopup = false;
let drawSeventhPopup = false;
let draweigthPopup = false;
let drawninthPopup = false;
let drawtenthPopup = false;
let drawEleventhPopup = false;
let drawTwelfthPopup = false;
let drawThirteenthPopup = false;
let drawFourteenthPopup = false;
let drawFifteenthPopup = false;

function checkFlagCollision(player) {
    if (flag.visible &&
        player.x + player.width >= flag.x &&
        player.x <= flag.x + flag.width &&
        player.y + player.height >= flag.y &&
        player.y <= flag.y + flag.height) {
        if (player === player1) {
            console.log("player 1 touched the flag");
            player1Score+= 5;
            document.body.classList.add("background_tech_competition_2"); 
        } else if (player === player2) {
            console.log("player 2 touched the flag");
            player2Score+= 5;
            document.body.classList.add("background_tech_competition_2");
        }
        flag.visible = false;
        showSecondPopup = true;}
}
function checkPlatformCollision(player) {
    let isOnPlatform = false;
    player.isOnPlatform = false;
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
                player.isOnPlatform = true;
            }
        }
    });

    if (!isOnPlatform) {
        player.grounded = false;
    }

    checkFlagCollision(player);
}




function CheckfloatingplatformCollision(player) {
    let isOnPlatform = false;
    player.isOnPlatform = false;
    if (player.y + player.height >= platform.y && player.x + player.width >= platform.x && player.x <= platform.x + platform.width) {
        player.y = platform.y - player.height;
        player.dy = 0;
        player.grounded = true;
        isOnPlatform = true;
    }
FloatingPlatforms.forEach(p => {
        if (player.x + player.width >= p.x && player.x <= p.x + p.width && player.y + player.height >= p.y && player.y <= p.y + p.height) {
            if (player.dy > 0) {
                player.y = p.y - player.height;
                player.dy = 0;
                player.grounded = true;
                isOnPlatform = true;
                player.isOnPlatform = true;
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

   
    if (!player1.grounded) {
        player1.dy += gravity * fallSpeedModifier;
    }
    if (!player2.grounded) {
        player2.dy += gravity * fallSpeedModifier;
    }

    player1.y += player1.dy;
    player2.y += player2.dy;

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

 
    player1.x += player1.dx;
    player2.x += player2.dx;

    if (player1.x < 0) player1.x = 0;
    if (player1.x + player1.width > canvas.width) player1.x = canvas.width - player1.width;
    if (player2.x < 0) player2.x = 0;
    if (player2.x + player2.width > canvas.width) player2.x = canvas.width - player2.width;

    
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

let flagCollectionCount = 0; 

function checkFlagCollision(player) {
    if (
        flag.visible &&
        player.x + player.width >= flag.x &&
        player.x <= flag.x + flag.width &&
        player.y + player.height >= flag.y &&
        player.y <= flag.y + flag.height
    ) {
        flag.visible = false; 

       
        if (player === player1) {
            player1Score += 5;
            console.log("Player 1 touched the flag and gained 5 points.");
        } else if (player === player2) {
            player2Score += 5;
            console.log("Player 2 touched the flag and gained 5 points.");
        }

        document.body.classList.add("background_tech_competition_2");

      
        if (flagCollectionCount === 0) {
            showSecondPopup = true; 
        } else if (flagCollectionCount === 1) {
            drawFourteenthPopup = true;
            document.body.classList.add("World_3_background");
        } else if (flagCollectionCount === 2) {
            drawtenthPopup = true;
        }
 
        flagCollectionCount++; 
    }
}

canvas.addEventListener("click", function () {
    if (showSecondPopup) {
        showSecondPopup = false;
        drawThirdPopup = true;
        console.log("Second popup dismissed, third popup triggered.");
    } else if (drawThirdPopup) {
        drawThirdPopup = false;
        showFourthPopup = true;
        console.log("Third popup dismissed, fourth popup triggered.");
    } else if (showFourthPopup) {
        showFourthPopup = false;
        showFifthPopup = true;
        console.log("Fourth popup dismissed, fifth popup triggered.");
    }  else if (showFifthPopup) {
        showFifthPopup = false;
        drawSixthPopup = true;
        console.log("Fifth popup dismissed, sixth popup triggered.");
    }  else  if (drawSixthPopup) {
        drawSixthPopup = false;
        drawThirteenthPopup = true;
        console.log("Sixth popup dismissed, thirteenth popup triggered.")
    }  else if (drawSeventhPopup) {
        drawSeventhPopup = false;
        draweigthPopup = true;
        console.log("seventh popup dismissed, eight popup triggered.")
    }  else if (draweigthPopup) {
        draweigthPopup = false;
        drawninthPopup = true;
        console.log("eight popup dismissed, ninth popup triggered.")
    }  else if (drawninthPopup) {
        drawninthPopup = false;
        drawFifteenthPopup = true;
        xIncrease = 2;
        console.log("ninth popup dismissed, fifteenth popup triggered.")
    } else if (drawtenthPopup) {
        drawtenthPopup = false;
        drawEleventhPopup = true;
        console.log("tenth popup dismissed, eleventh popup triggered.")
    } else if (drawEleventhPopup) {
        drawEleventhPopup = false;
        console.log("Eleventh popup dismissed, twelfth popup triggered.")
    } else if (drawTwelfthPopup) {
        drawTwelfthPopup = false;
        console.log("twelfth popup dismissed.")
    } else if (drawThirteenthPopup) {
        drawThirteenthPopup = false; 
        coinVisible = true; 
        generateRandomCoins(20);
        console.log("Thirteenth popup dismissed, 20 coins created.");
    } else if (drawFourteenthPopup) {
        drawFourteenthPopup= false; 
        drawSeventhPopup = true;
        console.log("Fourteenth popup dismissed, seventh popup triggered.");
    } else if (drawFifteenthPopup) {
        drawFifteenthPopup = false;
        console.log("Fifteenth popup dismissed.");
        document.body.classList.add("hidden-background");
        document.body.classList.add("background_world_3");
        const backgroundImage = new Image();
        backgroundImage.src = "World_3_background.png";
        backgroundImage.onload = () => {
            console.log("New background image loaded successfully.");
            ctx.clearRect(600, 600, gameCanvas.width, gameCanvas.height); 
            ctx.drawImage(backgroundImage, 0, 0, gameCanvas.width, gameCanvas.height); 
            console.log("Background changed to World_3_background.png.");
        };
        backgroundImage.onerror = () => {
            console.error("Failed to load World_3_background.png. Check the file path.");
        };
        flag.visible = true;
    }
    
});

const pointPositions = [
    { x: FloatingPlatforms[0].x + FloatingPlatforms[0].width / 2, y: FloatingPlatforms[0].y - 30 },
    { x: FloatingPlatforms[1].x + FloatingPlatforms[1].width / 2, y: FloatingPlatforms[1].y - 30 },
    { x: FloatingPlatforms[2].x + FloatingPlatforms[2].width / 2, y: FloatingPlatforms[2].y - 30 },
    { x: FloatingPlatforms[3].x + FloatingPlatforms[3].width / 2, y: FloatingPlatforms[3].y - 30 }
];

function drawPoints(ctx) {
    ctx.save(); 
    pointPositions.forEach(position => {
        ctx.beginPath();
        ctx.arc(position.x, position.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = "gold";
        ctx.fill();
        ctx.strokeStyle = "darkgoldenrod";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    });
    ctx.restore(); 
}

platform


function drawCanvas() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (document.body.classList.contains("background_tech_competition_2")) {
       
        if (!document.body.classList.contains("background_world_3")) {
            const backgroundImage = new Image();
            backgroundImage.src = "Tech_competition_background_2.png";
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        }  
    }
    this.drawRectangle(ctx);

    movingWalls.forEach(wall => {
        if (wall) {
            ctx.fillStyle = wall.color;
            ctx.fillRect(wall.x, wall.y - wall.height, wall.width, wall.height);
        }
    });

    ctx.drawImage(player1Image, player1.x, player1.y, player1.width, player1.height);
    ctx.drawImage(player2Image, player2.x, player2.y, player2.width, player2.height);
    if (flag.visible) {
        ctx.drawImage(flagImage, flag.x, flag.y, flag.width, flag.height);
    }

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
movingWalls

    if (popUpVisible) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(canvas.width / 2 - 400, canvas.height / 2 - 150, 800, 340);
        ctx.fillStyle = "#000";
        ctx.font = "24px Arial";
        ctx.fillText("Hello! Welcome to the Leap of Legands.", canvas.width / 2 - 380, canvas.height / 2 - 100);
        ctx.fillText("As you see, you have a competetor, which you need to beat.", canvas.width / 2 - 380, canvas.height / 2 - 60);
        ctx.fillText("Who ever gets the most points will win.", canvas.width / 2 - 380, canvas.height / 2 - 20);
        ctx.fillText("You will also Encounter Questions you will answer together.", canvas.width / 2 - 380, canvas.height / 2 + 20);
        ctx.fillText("But now you will see obsticals coming to you, and try to dogde them.", canvas.width / 2 - 380, canvas.height / 2 + 60);
        ctx.fillText("Controls for Blue Character Are WAS.", canvas.width / 2 - 380, canvas.height / 2 + 100);
        ctx.fillText("Controls for Red Character Are Up Left and Right arrow.", canvas.width / 2 - 380, canvas.height / 2 + 140);
        ctx.fillText("Click Anywhere to start the Game!(Have Fun!)", canvas.width / 2 - 380, canvas.height / 2 + 180);
    }
    if (showSecondPopup) {
        ctx.fillStyle = "rgba(300, 300, 300, 0.9)";

        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#000000";
        ctx.font = "32px Arial";

        ctx.fillText("Good Job Getting Past the First World! Now Let's Start to Learn About Programming!", canvas.width / 2 - 600, canvas.height / 2 - 120);
        ctx.fillText("There are 3 Coding Languages I used to Code this game.", canvas.width / 2 - 600, canvas.height / 2 - 80);
        ctx.fillText("I used HTML, CSS, and JavaScript. We Will Learn More About These.", canvas.width / 2 - 600, canvas.height / 2 - 40);
        ctx.fillText("Click Anywhere to Learn More!", canvas.width / 2 - 600, canvas.height / 2);
    }

    if (drawThirdPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "48px Arial";
        ctx.fillText("HTML: The Structure of the Web", canvas.width / 2 - 180, canvas.height / 2 - 100);
        ctx.font = "32px Arial";
        ctx.fillText("HTML stands for HyperText Markup Language.", canvas.width / 2 - 380, canvas.height / 2 - 60);
        ctx.fillText("It is the standard language used to create the structure of web pages.", canvas.width / 2 - 380, canvas.height / 2 - 20);
        ctx.fillText("HTML organizes content like text, images, and links into a structured layout.", canvas.width / 2 - 380, canvas.height / 2 + 20);
        ctx.fillText("Click Anywhere to Continue!", canvas.width / 2 - 380, canvas.height / 2 + 60);
    }

    if (showFourthPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "32px Arial";
        ctx.fillText("What is HTML?", canvas.width / 2 - 140, canvas.height / 2 - 100);
        ctx.font = "24px Arial";
        
        ctx.fillText("1. HyperText Markup Language", canvas.width / 2 - 200, canvas.height / 2 - 40);
        ctx.fillText("2. HyperText Machine Language", canvas.width / 2 - 200, canvas.height / 2);
        ctx.fillText("3. HyperText Modular Language", canvas.width / 2 - 200, canvas.height / 2 + 40);
    
        ctx.font = "20px Arial";
        ctx.fillText("Click Anywhere to Continue", canvas.width / 2 - 180, canvas.height / 2 + 100);
        
    }
    if (showFifthPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "32px Arial";
        ctx.fillText("Answer: What is HTML?", canvas.width / 2 - 170, canvas.height / 2 - 100);
        ctx.font = "24px Arial";
        
        ctx.fillText("HTML stands for HyperText Markup Language.", canvas.width / 2 - 220, canvas.height / 2 - 40);
        ctx.fillText("It is the standard language used to create the structure of web pages.", canvas.width / 2 - 320, canvas.height / 2);
        ctx.fillText("It organizes content like text, images, and links into a structured layout.", canvas.width / 2 - 320, canvas.height / 2 + 40);
    
        ctx.font = "20px Arial";
        ctx.fillText("Click Anywhere to Continue", canvas.width / 2 - 180, canvas.height / 2 + 100);

    }
    if (drawSixthPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "32px Arial";
        ctx.fillText("Congratulations!", canvas.width / 2 - 150, canvas.height / 2 - 100);
        
        ctx.font = "24px Arial";
        ctx.fillText("You have finished Lesson 1.", canvas.width / 2 - 200, canvas.height / 2 - 20);
        ctx.fillText("You know Now everything you need to know About HTML!", canvas.width / 2 - 200, canvas.height / 2);
        ctx.fillText("Once you complete world 2, you will learn more about CSS.", canvas.width / 2 - 200, canvas.height / 2 + 20);
        ctx.fillText("Click anywhere to continue.", canvas.width / 2 - 200, canvas.height / 2 + 40);
    }
    
     if (drawSeventhPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "48px Arial";
        ctx.fillText("CSS: The Style of the Web", canvas.width / 2 - 180, canvas.height / 2 - 100);
        ctx.font = "32px Arial";
        ctx.fillText("CSS stands for Cascading Style Sheets.", canvas.width / 2 - 380, canvas.height / 2 - 60);
        ctx.fillText("It is used to style and design the layout of web pages.", canvas.width / 2 - 380, canvas.height / 2 - 20);
        ctx.fillText("CSS controls things like colors, fonts, and spacing.", canvas.width / 2 - 380, canvas.height / 2 + 20);
        ctx.fillText("Click Anywhere to Continue!", canvas.width / 2 - 380, canvas.height / 2 + 60);
    }
     if (draweigthPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "32px Arial";
        ctx.fillText("What is CSS?", canvas.width / 2 - 90, canvas.height / 2 - 100);
        ctx.font = "24px Arial";
        
        ctx.fillText("1. A programming language", canvas.width / 2 - 140, canvas.height / 2 - 40);
        ctx.fillText("2. Cascading Style Sheets", canvas.width / 2 - 140, canvas.height / 2);
        ctx.fillText("3. A database management system", canvas.width / 2 - 140, canvas.height / 2 + 40);
    
        ctx.font = "20px Arial";
        ctx.fillText("Click Anywhere to know the answer", canvas.width / 2 - 180, canvas.height / 2 + 100);
    }
    if (drawninthPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "32px Arial";
        ctx.fillText("Answer to What is CSS?", canvas.width / 2 - 160, canvas.height / 2 - 100);
        ctx.font = "24px Arial";
        
        ctx.fillText("CSS stands for Cascading Style Sheets.", canvas.width / 2 - 200, canvas.height / 2 - 40);
        ctx.fillText("It describes the presentation of a web page.", canvas.width / 2 - 200, canvas.height / 2);
    
        ctx.font = "20px Arial";
        ctx.fillText("Click Anywhere to continue", canvas.width / 2 - 140, canvas.height / 2 + 60);
    } 

     if (drawtenthPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "48px Arial";
        ctx.fillText("JavaScript: The Interactivity of the Web", canvas.width / 2 - 220, canvas.height / 2 - 100);
        ctx.font = "32px Arial";
        ctx.fillText("JavaScript is the programming language of the web.", canvas.width / 2 - 380, canvas.height / 2 - 60);
        ctx.fillText("It is used to add interactivity, or to allow people to interact to web pages.", canvas.width / 2 - 380, canvas.height / 2 - 20);
        ctx.fillText("JavaScript makes websites dynamic and responsive.", canvas.width / 2 - 380, canvas.height / 2 + 20);
        ctx.fillText("Click Anywhere to Take the Review Test!", canvas.width / 2 - 380, canvas.height / 2 + 60);
    }

    if (drawEleventhPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "32px Arial";
        ctx.fillText("What is JavaScript?", canvas.width / 2 - 140, canvas.height / 2 - 100);
        
        ctx.font = "24px Arial";
        ctx.fillText("1. A programming language", canvas.width / 2 - 180, canvas.height / 2 - 40);
        ctx.fillText("2. A type of coffee", canvas.width / 2 - 180, canvas.height / 2);
        ctx.fillText("3. A web browser", canvas.width / 2 - 180, canvas.height / 2 + 40);
        
        ctx.font = "20px Arial";
        ctx.fillText("Click Anywhere to know the answer", canvas.width / 2 - 180, canvas.height / 2 + 80);
    }
    if (drawTwelfthPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "32px Arial";
        ctx.fillText("Answer: What is JavaScript?", canvas.width / 2 - 200, canvas.height / 2 - 100);
        
        ctx.font = "24px Arial";
        ctx.fillText("JavaScript is a programming language used", canvas.width / 2 - 180, canvas.height / 2 - 40);
        ctx.fillText("to create interactive effects within web browsers.", canvas.width / 2 - 180, canvas.height / 2);
        
        ctx.font = "20px Arial";
        ctx.fillText("Click Anywhere to continue", canvas.width / 2 - 180, canvas.height / 2 + 60);
    }

        if (drawThirteenthPopup) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000";
            ctx.font = "32px Arial";
            ctx.fillText("OH NO!", canvas.width / 2 - 200, canvas.height / 2 - 100);
            
            ctx.font = "24px Arial";
            ctx.fillText("It appears that as we were going through the portal, we lost some of our coins!", canvas.width / 2 - 180, canvas.height / 2 - 40);
            ctx.fillText("But wait a minute, it appears as if the Platforms stayed with us as we went through the portal.", canvas.width / 2 - 180, canvas.height / 2);
            ctx.fillText("Use the Platforms to get to the Coins. Every Coin you collect will give you 2 points!", canvas.width / 2 - 180, canvas.height / 2 + 20);
            ctx.font = "20px Arial";
            ctx.fillText("Click Anywhere to continue", canvas.width / 2 - 180, canvas.height / 2 + 60);
        }
        
        if (drawFourteenthPopup) {
            ctx.fillStyle = "rgba(300, 300, 300, 0.9)";
    
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = "#000000";
            ctx.font = "32px Arial";
    
            ctx.fillText("Good Job Getting Past the Second World! Now Let's Start learning about CSS!", canvas.width / 2 - 600, canvas.height / 2 - 120);
            ctx.fillText("CSS is the 2nd Coding Languege I used in my Project.", canvas.width / 2 - 600, canvas.height / 2 - 80);
            ctx.fillText("Click Anywhere to Learn More!", canvas.width / 2 - 600, canvas.height / 2 - 40);
        }
        if (drawFifteenthPopup) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000";
            ctx.font = "32px Arial";
            ctx.fillText("Congratulations!", canvas.width / 2 - 150, canvas.height / 2 - 100);
            
            ctx.font = "24px Arial";
            ctx.fillText("You have finished Lesson 2.", canvas.width / 2 - 200, canvas.height / 2 - 20);
            ctx.fillText("You know Now the basics of CSS!", canvas.width / 2 - 200, canvas.height / 2);
            ctx.fillText("Once you complete the final world, world 3, you will learn more about JavaScript.", canvas.width / 2 - 200, canvas.height / 2 + 20);
            ctx.fillText("Click anywhere to continue.", canvas.width / 2 - 200, canvas.height / 2 + 40);
        }
}
let rectX = [100, 400, 700, 1000, 1300];
let xIncrease = 0;
let moveRight = true;

function drawRectangle(ctx){
    ctx.fillStyle = platform.color;
    canCall = false;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    for (let i = 0; i < platforms.length; i++) {  
        ctx.fillStyle = platforms[i].color;
        ctx.fillRect(rectX[i], platforms[i].y, platforms[i].width, platforms[i].height);
        if (moveRight) {
            if (rectX[i] + xIncrease < canvas.width) {
                rectX[i] += xIncrease;
                if(player1.isOnPlatform){
                    player1.x += xIncrease;
                }
                if(player2.isOnPlatform){
                    player2.x += xIncrease;
                }
            } else {
                moveRight = false;
            }
        }
        else
        {
            if (rectX[i] - xIncrease > 0) {
                rectX[i] -= xIncrease;
                if(player1.isOnPlatform){
                    player1.x -= xIncrease;
                }
                if(player2.isOnPlatform){
                    player2.x -= xIncrease;
                }
            } else {
                moveRight = true;
            }
        }

    }
}





let drawcoin = [];
let coinVisible = false;
let totalCoinsCollected = 0;

const canvasWidth = 800; 
const canvasHeight = 600;

function createCoin(x, y) {
    let coin = {
        x: x,
        y: y,
        radius: 10,
        fillColor: 'gold',
        strokeColor: 'darkgoldenrod',
        lineWidth: 3
    };
    drawcoin.push(coin);
    console.log(`Coin created at (${x}, ${y}). Total coins: ${drawcoin.length}`);
}

function checkCoinCollision() {
    if (drawcoin.length === 0) {
        coinVisible = false;
        return;
    }

    drawcoin.forEach((coin, index) => {
        if (player1.x < coin.x + coin.radius &&
            player1.x + player1.width > coin.x - coin.radius &&
            player1.y < coin.y + coin.radius &&
            player1.y + player1.height > coin.y - coin.radius) {
            player1Score += 2;
            drawcoin.splice(index, 1);
            totalCoinsCollected++;
            console.log(`Player 1 collected a coin! Score: ${player1Score}, Total Coins: ${totalCoinsCollected}`);
        }

        if (player2.x < coin.x + coin.radius &&
            player2.x + player2.width > coin.x - coin.radius &&
            player2.y < coin.y + coin.radius &&
            player2.y + player2.height > coin.y - coin.radius) {
            player2Score += 2;
            drawcoin.splice(index, 1);
            totalCoinsCollected++;
            console.log(`Player 2 collected a coin! Score: ${player2Score}, Total Coins: ${totalCoinsCollected}`);
        }
    });

    if (drawcoin.length === 0) {
        coinVisible = false;
    }

    if (totalCoinsCollected === 20) {
        flag.visible = true;
        console.log("All coins collected! Flag is now visible.");
    }
}

function gameLoop() {
    update(); 
    checkCoinCollision(); 
    draw();

    if (coinVisible) {
        console.log("Drawing coins...");
        drawcoin.forEach(coin => {
            drawCoin(coin.x, coin.y, coin.radius, coin.fillColor, coin.strokeColor, coin.lineWidth);
        });
        console.log(`Total coins drawn: ${drawcoin.length}`);
    }

    requestAnimationFrame(gameLoop);
}

function drawCoin(x, y, radius, fillColor, strokeColor, lineWidth) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, radius - 5, 0, 2 * Math.PI);
    ctx.strokeStyle = 'saddlebrown';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function generateRandomCoins(numCoins) {
    totalCoinsCollected = 0; 
    drawcoin = []; 
    for (let i = 0; i < numCoins; i++) {
        const x = Math.random() * (canvasWidth - 50) + 25;
        const y = Math.random() * (canvasHeight - 120) + 150; 
        createCoin(x, y);
    }
    coinVisible = true;
    console.log(`${numCoins} coins generated. Total coins collected reset to 0.`);
}

gameLoop();


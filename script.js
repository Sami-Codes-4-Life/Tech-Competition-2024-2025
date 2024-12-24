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
    width: 20,
    height: 70,
    color: "#FFFFFE",
    visible: false,
};

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


function checkFlagCollision(player) {
    if (flag.visible &&
        player.x + player.width >= flag.x &&
        player.x <= flag.x + flag.width &&
        player.y + player.height >= flag.y &&
        player.y <= flag.y + flag.height) {
        if (player === player1) {
            console.log("player 1 touched the flag");
            player1Score++;
            document.body.classList.add("background_tech_competition_2"); 
        } else if (player === player2) {
            console.log("player 2 touched the flag");
            player2Score++;
            document.body.classList.add("background_tech_competition_2");
        }
        flag.visible = false;
        showSecondPopup = true;
        
        
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
        drawTwelfthPopup = true;
        console.log("seventh popup dismissed, twelfth popup triggered.")
    }  else if (draweigthPopup) {
        draweigthPopup = false;
        drawninthPopup = true;
        console.log("eight popup dismissed, ninth popup triggered.")
    }  else if (drawninthPopup) {
        drawninthPopup = false;
        drawtenthPopup = true;
        console.log("ninth popup dismissed, tenth popup triggered.")
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
        console.log("Thirteenth popup dismissed.")
    
    }
    
});

function drawCanvas() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    if (document.body.classList.contains("background_tech_competition_2")) {
        const backgroundImage = new Image();
        backgroundImage.src = "Tech_competition_background_2.png";
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        
    }

 
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

    ctx.drawImage(player1Image, player1.x, player1.y, player1.width, player1.height);
    ctx.drawImage(player2Image, player2.x, player2.y, player2.width, player2.height);

    if (flag.visible) {
        ctx.fillStyle = flag.color;
        ctx.fillRect(flag.x, flag.y, flag.width, flag.height);
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
    
    
    /* if (drawSeventhPopup) {
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
    }*/
    /* if (draweigthPopup) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "32px Arial";
        ctx.fillText("What is CSS?", canvas.width / 2 - 90, canvas.height / 2 - 100);
        ctx.font = "24px Arial";
        
        ctx.fillText("1. A programming language", canvas.width / 2 - 140, canvas.height / 2 - 40);
        ctx.fillText("2. A style sheet language", canvas.width / 2 - 140, canvas.height / 2);
        ctx.fillText("3. A database management system", canvas.width / 2 - 140, canvas.height / 2 + 40);
    
        ctx.font = "20px Arial";
        ctx.fillText("Click Anywhere to know the answer", canvas.width / 2 - 180, canvas.height / 2 + 100);
    }*/
   /* if (drawninthPopup) {
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
    } */

    /* if (drawtenthPopup) {
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
    }*/

   /* if (drawEleventhPopup) {
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
    }*/

        if (drawThirteenthPopup) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000";
            ctx.font = "32px Arial";
            ctx.fillText("OH NO!", canvas.width / 2 - 200, canvas.height / 2 - 100);
            
            ctx.font = "24px Arial";
            ctx.fillText("It appears that as we were going through the portal, we lost some of our coins!", canvas.width / 2 - 180, canvas.height / 2 - 40);
            ctx.fillText("Every coin you collect, you will earn 2 points.", canvas.width / 2 - 180, canvas.height / 2);
            
            ctx.font = "20px Arial";
            ctx.fillText("Click Anywhere to continue", canvas.width / 2 - 180, canvas.height / 2 + 60);
        }
    
}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

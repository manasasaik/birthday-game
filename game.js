const startScreen =
    document.getElementById("startScreen");

const gameScreen =
    document.getElementById("gameScreen");

const giftScreen =
    document.getElementById("giftScreen");

const braceletScreen =
    document.getElementById("braceletScreen");

const completeScreen =
    document.getElementById("completeScreen");


const startButton =
    document.getElementById("startButton");

const openGiftButton =
    document.getElementById("openGiftButton");

const gotGiftButton =
    document.getElementById("gotGiftButton");

const nextButton =
    document.getElementById("nextButton");


const player =
    document.getElementById("player");

const world =
    document.getElementById("world");

const gift =
    document.getElementById("gift");


const livesDisplay =
    document.getElementById("lives");

const tulipsDisplay =
    document.getElementById("tulips");

const scoreDisplay =
    document.getElementById("score");


const leftButton =
    document.getElementById("leftButton");

const rightButton =
    document.getElementById("rightButton");

const jumpButton =
    document.getElementById("jumpButton");


let playerX = 100;
let playerY = 105;

let previousY = 105;
let velocityY = 0;

let movingLeft = false;
let movingRight = false;

let jumping = false;

let score = 0;
let tulips = 0;
let lives = 3;

let gameRunning = false;

const gravity = 0.75;
const moveSpeed = 6;
const jumpPower = 18;


/* =========================
   START
========================= */

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    startScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

    playerX = 100;
    playerY = 105;

    velocityY = 0;

    score = 0;
    tulips = 0;
    lives = 3;

    scoreDisplay.textContent = score;
    tulipsDisplay.textContent = tulips;
    livesDisplay.textContent = lives;

    document
        .querySelectorAll(".collectible")
        .forEach(item => {

            item.style.display = "block";

            item.dataset.collected = "false";

        });


    gameRunning = true;

    requestAnimationFrame(gameLoop);
}


/* =========================
   MOVEMENT
========================= */

function moveLeft() {

    movingLeft = true;

}


function stopLeft() {

    movingLeft = false;

}


function moveRight() {

    movingRight = true;

}


function stopRight() {

    movingRight = false;

}


/* =========================
   BUTTON CONTROLS
========================= */

leftButton.addEventListener(
    "pointerdown",
    moveLeft
);

leftButton.addEventListener(
    "pointerup",
    stopLeft
);

leftButton.addEventListener(
    "pointerleave",
    stopLeft
);


rightButton.addEventListener(
    "pointerdown",
    moveRight
);

rightButton.addEventListener(
    "pointerup",
    stopRight
);

rightButton.addEventListener(
    "pointerleave",
    stopRight
);


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) {
            return;
        }

        if (event.key === "ArrowLeft") {

            movingLeft = true;

        }


        if (event.key === "ArrowRight") {

            movingRight = true;

        }


        if (
            event.key === " " ||
            event.key === "ArrowUp"
        ) {

            jump();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        if (event.key === "ArrowLeft") {

            movingLeft = false;

        }


        if (event.key === "ArrowRight") {

            movingRight = false;

        }

    }
);


/* =========================
   JUMP
========================= */

function jump() {

    if (
        !jumping &&
        gameRunning
    ) {

        velocityY = jumpPower;

        jumping = true;

    }

}


jumpButton.addEventListener(
    "pointerdown",
    jump
);


/* =========================
   GAME LOOP
========================= */

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    /* MOVEMENT */

    if (movingLeft) {

        playerX -= moveSpeed;

    }


    if (movingRight) {

        playerX += moveSpeed;

    }


    /* LIMIT WORLD */

    if (playerX < 0) {

        playerX = 0;

    }


    if (playerX > 2800) {

        playerX = 2800;

    }


    /* PHYSICS */

previousY = playerY;

velocityY -= gravity;

playerY += velocityY;


/* PLATFORM COLLISION */

checkPlatforms();


/* GROUND COLLISION */

if (playerY <= 105) {

    playerY = 105;

    velocityY = 0;

    jumping = false;

}

    /* PLAYER POSITION */

    player.style.left =
        playerX + "px";

    player.style.bottom =
        playerY + "px";


        // Character animation
if (jumping) {
    player.classList.remove("walking");
    player.classList.add("jumping");
} else if (movingLeft || movingRight) {
    player.classList.remove("jumping");
    player.classList.add("walking");
} else {
    player.classList.remove("walking");
    player.classList.remove("jumping");
    player.style.backgroundPosition = "0 0";
}
    /* CAMERA */

    const cameraX =
        Math.max(
            0,
            Math.min(
                playerX - window.innerWidth / 2,
                3000 - window.innerWidth
            )
        );


    world.style.transform =
        `translateX(-${cameraX}px)`;


    collectItems();

    checkObstacles();

    checkGift();


    requestAnimationFrame(gameLoop);
}


/* =========================
   COLLECT ITEMS
========================= */

function collectItems() {

    const items =
        document.querySelectorAll(".collectible");


    const playerRect =
        player.getBoundingClientRect();


    items.forEach(item => {

        if (
            item.dataset.collected === "true"
        ) {
            return;
        }


        const itemRect =
            item.getBoundingClientRect();


        const touching =
            playerRect.left <
            itemRect.right &&

            playerRect.right >
            itemRect.left &&

            playerRect.top <
            itemRect.bottom &&

            playerRect.bottom >
            itemRect.top;


        if (touching) {

            item.dataset.collected =
                "true";

            item.style.display =
                "none";


            if (
                item.classList.contains("tulip")
            ) {

                tulips++;

                tulipsDisplay.textContent =
                    tulips;

            }


            if (
                item.classList.contains("star")
            ) {

                score += 10;

                scoreDisplay.textContent =
                    score;

            }

        }

    });

}


/* =========================
   OBSTACLES
========================= */

function checkObstacles() {

    const obstacles =
        document.querySelectorAll(
            ".obstacle"
        );


    obstacles.forEach(obstacle => {

        const obstacleX =
            obstacle.offsetLeft;


        const distance =
            Math.abs(
                playerX - obstacleX
            );


        if (
            distance < 45 &&
            playerY <= 150
        ) {

            loseLife(
                obstacle
            );

        }

    });

}


/* =========================
   LOSE LIFE
========================= */

let lastHit = 0;


function loseLife(obstacle) {

    const now =
        Date.now();


    if (
        now - lastHit < 1200
    ) {

        return;

    }


    lastHit = now;

    lives--;

    livesDisplay.textContent =
        lives;


    player.style.transform =
        "translateX(-15px)";


    setTimeout(() => {

        player.style.transform =
            "translateX(0)";

    }, 200);


    playerX -= 100;


    if (playerX < 0) {

        playerX = 0;

    }


    if (lives <= 0) {

        gameRunning = false;

        alert(
    "🔑🔑🔑\n\n" +
    "You found all 3 secret keys!\n\n" +
    "Now find the three mystery boxes! 📦"
);

        location.reload();

    }

}


/* =========================
   REACH GIFT
========================= */

function checkGift() {

    const giftX =
        gift.offsetLeft;


    const distance =
        Math.abs(
            playerX - giftX
        );


    if (
        distance < 75 &&
        tulips >= 5
    ) {

        gameRunning = false;

        gameScreen.classList.add(
            "hidden"
        );

        giftScreen.classList.remove(
            "hidden"
        );

    }

}


/* =========================
   OPEN GIFT
========================= */

openGiftButton.addEventListener(
    "click",
    function() {

        const giftBox =
            document.getElementById(
                "giftBox"
            );


        giftBox.classList.add(
            "opening"
        );


        openGiftButton.style.display =
            "none";


        document.getElementById(
            "giftTitle"
        ).textContent =
            "🎉 SURPRISE! 🎉";


        document.getElementById(
            "giftMessage"
        ).textContent =
            "Your special birthday gift is about to be revealed...";


        setTimeout(
            function() {

                giftScreen.classList.add(
                    "hidden"
                );

                braceletScreen.classList.remove(
                    "hidden"
                );

            },
            1500
        );

    }
);


/* =========================
   REAL GIFT RECEIVED
========================= */

gotGiftButton.addEventListener(
    "click",
    function() {

        braceletScreen.classList.add(
            "hidden"
        );

        completeScreen.classList.remove(
            "hidden"
        );

    }
);
/* =========================
   PLATFORM COLLISION
========================= */

function checkPlatforms() {

    const platforms = [
        {
            x: 450,
            width: 220,
            bottom: 210,
            height: 25
        },

        {
            x: 900,
            width: 230,
            bottom: 300,
            height: 25
        },

        {
            x: 1450,
            width: 260,
            bottom: 190,
            height: 25
        },

        {
            x: 2050,
            width: 230,
            bottom: 280,
            height: 25
        }
    ];


    /* Only land while falling */

    if (velocityY > 0) {
        return;
    }


    const playerWidth = 60;


    platforms.forEach(platform => {

        const platformTop =
            platform.bottom + platform.height;


        const playerLeft = playerX;

        const playerRight =
            playerX + playerWidth;


        const platformLeft =
            platform.x;

        const platformRight =
            platform.x + platform.width;


        const horizontalOverlap =
            playerRight > platformLeft &&
            playerLeft < platformRight;


        const crossedPlatform =
            previousY >= platformTop &&
            playerY <= platformTop;


        if (
            horizontalOverlap &&
            crossedPlatform
        ) {

            playerY = platformTop;

            velocityY = 0;

            jumping = false;

        }

    });

}

/* =========================
   LEVEL 2
========================= */


nextButton.addEventListener("click", function() {
    startLevel2();
});
/* =========================
   LEVEL 2 - MEMORY HUNT
   ========================= */

const level2Screen = document.getElementById("level2Screen");
const level2World = document.getElementById("level2World");
const level2Player = document.getElementById("level2Player");
const memoryCountDisplay = document.getElementById("memoryCount");
const memoryPopup = document.getElementById("memoryPopup");
const memoryImage = document.getElementById("memoryImage");
const memoryText = document.getElementById("memoryText");
const closeMemory = document.getElementById("closeMemory");

let level2X = 100;
let level2Y = 105;
let level2VelocityY = 0;
let level2Jumping = false;
let level2Left = false;
let level2Right = false;
let level2Memories = 0;
let level2Running = false;

const level2Speed = 6;
const level2JumpPower = 18;
const level2Gravity = 0.75;


/* Start Level 2 */

function startLevel2() {

    completeScreen.classList.add("hidden");
    level2Screen.classList.remove("hidden");

    level2X = 100;
    level2Y = 105;
    level2VelocityY = 0;
    level2Jumping = false;
    level2Memories = 0;
    level2Running = true;

    memoryCountDisplay.textContent = "0";

    document.querySelectorAll(".memory").forEach(memory => {
        memory.style.display = "flex";
        memory.dataset.collected = "false";
    });

    requestAnimationFrame(level2GameLoop);
}


/* Level 2 keyboard controls */

document.addEventListener("keydown", function(event) {

    if (!level2Running) return;

    if (event.key === "ArrowLeft") {
        level2Left = true;
    }

    if (event.key === "ArrowRight") {
        level2Right = true;
    }

    if (event.key === " " || event.key === "ArrowUp") {
        level2Jump();
    }
});


document.addEventListener("keyup", function(event) {

    if (event.key === "ArrowLeft") {
        level2Left = false;
    }

    if (event.key === "ArrowRight") {
        level2Right = false;
    }
});


function level2Jump() {

    if (!level2Jumping && level2Running) {
        level2VelocityY = level2JumpPower;
        level2Jumping = true;
    }

}


/* Level 2 game loop */

function level2GameLoop() {

    if (!level2Running) return;


    /* Movement */

    if (level2Left) {
        level2X -= level2Speed;
    }

    if (level2Right) {
        level2X += level2Speed;
    }


    /* World boundaries */

    if (level2X < 0) {
        level2X = 0;
    }

    if (level2X > 2800) {
        level2X = 2800;
    }


    /* Gravity */

    level2VelocityY -= level2Gravity;
    level2Y += level2VelocityY;


    /* Ground */

    if (level2Y <= 105) {

        level2Y = 105;
        level2VelocityY = 0;
        level2Jumping = false;

    }


    /* Platform collision */

    checkLevel2Platforms();


    /* Position player */

    level2Player.style.left = level2X + "px";
    level2Player.style.bottom = level2Y + "px";


    /* Camera */

    const cameraX = Math.max(
        0,
        Math.min(
            level2X - window.innerWidth / 2,
            3000 - window.innerWidth
        )
    );

    level2World.style.transform =
        `translateX(-${cameraX}px)`;


    /* Check memories */

    checkMemories();


    requestAnimationFrame(level2GameLoop);

}


/* Platforms */

function checkLevel2Platforms() {

    const platforms = [

        {
            x: 400,
            width: 220,
            bottom: 220,
            height: 25
        },

        {
            x: 900,
            width: 240,
            bottom: 230,
            height: 25
        },

        {
            x: 1500,
            width: 250,
            bottom: 230,
            height: 25
        }

    ];


    if (level2VelocityY > 0) return;


    const playerWidth = 60;


    platforms.forEach(platform => {

        const platformTop =
            platform.bottom + platform.height;

        const playerLeft = level2X;
        const playerRight =
            level2X + playerWidth;

        const horizontalOverlap =
            playerRight > platform.x &&
            playerLeft < platform.x + platform.width;

        const crossedPlatform =
            level2Y >= platformTop &&
            level2Y <= platformTop + 20;


        if (horizontalOverlap && crossedPlatform) {

            level2Y = platformTop;
            level2VelocityY = 0;
            level2Jumping = false;

        }

    });

}


/* Memory collection */

function checkMemories() {

    const memories =
        document.querySelectorAll(".memory");


    memories.forEach(memory => {

        if (memory.dataset.collected === "true") {
            return;
        }


        const memoryX =
            memory.offsetLeft;

        const memoryY =
            memory.offsetTop;


        const playerLeft = level2X;
        const playerRight = level2X + 60;


        const playerTop =
            (level2Screen.clientHeight - 90) -
            level2Y;


        const playerBottom =
            playerTop + 90;


        const memoryRight =
            memoryX + 65;

        const memoryBottom =
            memoryY + 65;


        const touching =
            playerLeft < memoryRight &&
            playerRight > memoryX &&
            playerTop < memoryBottom &&
            playerBottom > memoryY;


        if (touching) {

            collectMemory(memory);

        }

    });

}


/* Collect one memory */

function collectMemory(memory) {

    memory.dataset.collected = "true";
    memory.style.display = "none";

    level2Memories++;

    memoryCountDisplay.textContent =
        level2Memories;


    const number =
        memory.dataset.memory;


   memoryImage.src = "images/memory" + number + ".jpg";
memoryImage.style.display = "block";


    const messages = {

        1: "Look how little she was! 🥹❤️",

        2: "A beautiful memory together! 👭❤️",

        3: "Family moments are the best! 👨‍👩‍👧❤️",

        4: "Another birthday to remember! 🎂🎉",

        5: "And this one is special! 😂❤️"

    };


    memoryText.textContent =
        messages[number];


    memoryPopup.classList.remove("hidden");

    level2Running = false;


}


/* Continue after viewing memory */

closeMemory.addEventListener("click", function() {

    memoryPopup.classList.add("hidden");

    if (level2Memories >= 5) {

        finishLevel2();

    } else {

        level2Running = true;

        requestAnimationFrame(level2GameLoop);

    }

});


/* Finish Level 2 */
function finishLevel2() {
    level2Running = false;

    const level2Ending = document.getElementById("level2Ending");

    level2Ending.classList.remove("hidden");
}

/* =========================
   LEVEL 3 - SECRET ROOM
   ========================= */

const level3Screen = document.getElementById("level3Screen");
const level3World = document.getElementById("level3World");
const level3Player = document.getElementById("level3Player");

const keyCountDisplay = document.getElementById("keyCount");
const secretPopup = document.getElementById("secretPopup");
const secretTitle = document.getElementById("secretTitle");
const secretContent = document.getElementById("secretContent");
const closeSecret = document.getElementById("closeSecret");

let level3X = 100;
let level3Y = 105;
let level3PreviousY = 105;

let level3VelocityY = 0;

let level3Jumping = false;
let level3Left = false;
let level3Right = false;

let level3Keys = 0;
let level3Running = false;

const level3Speed = 6;
const level3JumpPower = 18;
const level3Gravity = 0.75;


/* =========================
   START LEVEL 3
   ========================= */

function startLevel3() {

    level2Running = false;

    level2Screen.classList.add("hidden");

    level3Screen.classList.remove("hidden");

    level3X = 100;
    level3Y = 105;
    level3PreviousY = 105;

    level3VelocityY = 0;

    level3Jumping = false;

    level3Keys = 0;

    keyCountDisplay.textContent = "0";

    document.querySelectorAll(".secretKey").forEach(key => {
        key.style.display = "flex";
        key.dataset.collected = "false";
    });

    document.querySelectorAll(".mysteryBox").forEach(box => {
        box.style.display = "flex";
        box.dataset.opened = "false";
    });

    level3Running = true;

    requestAnimationFrame(level3GameLoop);
}


/* =========================
   KEYBOARD CONTROLS
   ========================= */

document.addEventListener("keydown", function(event) {

    if (!level3Running) return;

    if (event.key === "ArrowLeft") {
        level3Left = true;
    }

    if (event.key === "ArrowRight") {
        level3Right = true;
    }

    if (event.key === " " || event.key === "ArrowUp") {
        level3Jump();
    }

});


document.addEventListener("keyup", function(event) {

    if (event.key === "ArrowLeft") {
        level3Left = false;
    }

    if (event.key === "ArrowRight") {
        level3Right = false;
    }

});


/* =========================
   JUMP
   ========================= */

function level3Jump() {

    if (!level3Jumping && level3Running) {

        level3VelocityY = level3JumpPower;

        level3Jumping = true;
    }
}


/* =========================
   GAME LOOP
   ========================= */

function level3GameLoop() {

    if (!level3Running) return;


    /* Movement */

    if (level3Left) {
        level3X -= level3Speed;
    }

    if (level3Right) {
        level3X += level3Speed;
    }


    /* World limits */

    if (level3X < 0) {
        level3X = 0;
    }

    if (level3X > 2800) {
        level3X = 2800;
    }


    /* Gravity */

    level3PreviousY = level3Y;

    level3VelocityY -= level3Gravity;

    level3Y += level3VelocityY;


    /* Ground */

    if (level3Y <= 105) {

        level3Y = 105;

        level3VelocityY = 0;

        level3Jumping = false;
    }


    /* Platforms */

    checkLevel3Platforms();


    /* Player position */

    level3Player.style.left = level3X + "px";

    level3Player.style.bottom = level3Y + "px";


    /* Camera */

    const cameraX = Math.max(
        0,
        Math.min(
            level3X - window.innerWidth / 2,
            3000 - window.innerWidth
        )
    );

    level3World.style.transform =
        `translateX(-${cameraX}px)`;


    /* Keys */

    checkLevel3Keys();


    /* Boxes */

    checkLevel3Boxes();


    requestAnimationFrame(level3GameLoop);
}


/* =========================
   PLATFORM COLLISION
   ========================= */

function checkLevel3Platforms() {

    const platforms = [

        {
            x: 400,
            width: 220,
            bottom: 210,
            height: 25
        },

        {
            x: 900,
            width: 230,
            bottom: 300,
            height: 25
        },

        {
            x: 1450,
            width: 250,
            bottom: 220,
            height: 25
        }

    ];


    if (level3VelocityY > 0) return;


    const playerWidth = 60;


    platforms.forEach(platform => {

        const platformTop =
            platform.bottom + platform.height;


        const playerLeft = level3X;

        const playerRight =
            level3X + playerWidth;


        const horizontalOverlap =
            playerRight > platform.x &&
            playerLeft <
                platform.x + platform.width;


        const crossedPlatform =
            level3PreviousY >= platformTop &&
            level3Y <= platformTop;


        if (
            horizontalOverlap &&
            crossedPlatform
        ) {

            level3Y = platformTop;

            level3VelocityY = 0;

            level3Jumping = false;
        }

    });

}


/* =========================
   KEY COLLECTION
   ========================= */

function checkLevel3Keys() {

    const keys =
        document.querySelectorAll(".secretKey");


    keys.forEach(key => {

        if (
            key.dataset.collected === "true"
        ) {
            return;
        }


        const keyX = key.offsetLeft;

        const keyY = key.offsetTop;


        const playerLeft = level3X;

        const playerRight =
            level3X + 60;


        const playerTop =
            (level3Screen.clientHeight - 90)
            - level3Y;


        const playerBottom =
            playerTop + 90;


        const keyRight =
            keyX + 55;

        const keyBottom =
            keyY + 55;


        const touching =
            playerLeft < keyRight &&
            playerRight > keyX &&
            playerTop < keyBottom &&
            playerBottom > keyY;


        if (touching) {

            collectLevel3Key(key);
        }

    });

}


/* =========================
   COLLECT KEY
   ========================= */

function collectLevel3Key(key) {

    key.dataset.collected = "true";

    key.style.display = "none";

    level3Keys++;

    keyCountDisplay.textContent =
        level3Keys;


    if (level3Keys === 3) {

        alert(
            "🔑🔑🔑\n\n" +
            "You found all 3 secret keys!\n\n" +
            "Now find the three mystery boxes! 📦"
        );

    }

}


/* =========================
   BOX DETECTION
   ========================= */

function checkLevel3Boxes() {

    const boxes =
        document.querySelectorAll(".mysteryBox");


    boxes.forEach(box => {

        if (
            box.dataset.opened === "true"
        ) {
            return;
        }


        const boxX =
            box.offsetLeft;


        const distance =
            Math.abs(level3X - boxX);


        if (
            distance < 70 &&
            level3Keys > 0
        ) {

            openLevel3Box(box);
        }

    });

}


/* =========================
   OPEN BOX
   ========================= */

function openLevel3Box(box) {

    box.dataset.opened = "true";

    box.textContent = "🎉";


    const boxNumber =
        box.dataset.box;


    if (boxNumber === "1") {

        secretTitle.textContent =
            "💌 BOX 1 OPENED!";

        secretContent.innerHTML =
            "You found a secret message! ❤️<br><br>" +
            "No matter how much we fight, " +
            "you will always be my special sister. 🥹❤️";

    }


    if (boxNumber === "2") {

        secretTitle.textContent =
            "😂 BOX 2 OPENED!";

        secretContent.innerHTML =
            "WARNING! ⚠️<br><br>" +
            "A funny sister memory has been unlocked! 😂❤️";

    }


    if (boxNumber === "3") {

    secretTitle.textContent =
        "🔐 THE FINAL CLUE";

    secretContent.innerHTML =
        "Hmm... this one is different. 👀<br><br>" +
        "A very special surprise is waiting for you... 🎁<br><br>" +
        "You won't know what it is yet. 🤫❤️<br><br>" +
        "<strong>Just keep going... the biggest surprise is still ahead! ✨</strong>";

}


    secretPopup.classList.remove("hidden");

    level3Running = false;
}


/* =========================
   CLOSE BOX MESSAGE
   ========================= */

closeSecret.addEventListener("click", function () {

    secretPopup.classList.add("hidden");

    const openedBoxes = document.querySelectorAll(
        '.mysteryBox[data-opened="true"]'
    ).length;

    if (openedBoxes === 3) {

        level3Running = false;

        level3Screen.classList.add("hidden");

        const earringsScreen =
            document.getElementById("earringsScreen");

        earringsScreen.classList.remove("hidden");

        earringsScreen.style.display = "flex";

        // Make sure the earrings image is loaded
        const earringsImage =
            document.getElementById("earringsImage");

        earringsImage.src = "images/earrings.jpeg";

    } else {

        level3Running = true;

        requestAnimationFrame(level3GameLoop);

    }

});

/* =========================
   WAIT BUTTON
========================= */

/* =========================
   WAIT FOR YOU → LEVEL 4
========================= */

const waitButton =
    document.getElementById("waitButton");

if (waitButton) {

    waitButton.addEventListener("click", function () {

        const earringsScreen =
            document.getElementById("earringsScreen");

        earringsScreen.classList.add("hidden");

        startLevel4();

    });

}

/* =========================
   LEVEL 4 - CRICKET CHALLENGE
========================= */

const level4Screen =
    document.getElementById("level4Screen");

const level4World =
    document.getElementById("level4World");

const level4Player =
    document.getElementById("level4Player");
 
const level4PlayerImage =
    document.getElementById("level4PlayerImage");

const runCountDisplay =
    document.getElementById("runCount");

const level4Ending =
    document.getElementById("level4Ending");



let level4X = 100;
let level4Y = 105;

let level4PreviousY = 105;
let level4VelocityY = 0;

let level4Jumping = false;

let level4Left = false;
let level4Right = false;

let level4Runs = 0;

let level4Running = false;


const level4Speed = 6;
const level4JumpPower = 18;
const level4Gravity = 0.75;


/* =========================
   START LEVEL 4
========================= */

function startLevel4() {

    level3Running = false;

    level3Screen.classList.add("hidden");

    document.getElementById("earringsScreen")
        .classList.add("hidden");

    level4Screen.classList.remove("hidden");

    level4X = 100;
    level4Y = 105;

    level4PreviousY = 105;
    level4VelocityY = 0;

    level4Jumping = false;

    level4Runs = 0;

    runCountDisplay.textContent = "0";

    document.querySelectorAll(".cricketBall")
        .forEach(ball => {

            ball.style.display = "flex";
            ball.dataset.collected = "false";

        });

    level4Running = true;

    requestAnimationFrame(level4GameLoop);
}


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener("keydown", function(event) {

    if (!level4Running) return;

    if (event.key === "ArrowLeft") {
        level4Left = true;
    }

    if (event.key === "ArrowRight") {
        level4Right = true;
    }

    if (
        event.key === " " ||
        event.key === "ArrowUp"
    ) {
        level4Jump();
    }

});


document.addEventListener("keyup", function(event) {

    if (event.key === "ArrowLeft") {
        level4Left = false;
    }

    if (event.key === "ArrowRight") {
        level4Right = false;
    }

});


/* =========================
   JUMP
========================= */

function level4Jump() {

    if (
        !level4Jumping &&
        level4Running
    ) {

        level4VelocityY =
            level4JumpPower;

        level4Jumping = true;

    }

}


/* =========================
   GAME LOOP
========================= */

function level4GameLoop() {

    if (!level4Running) {
        return;
    }


    /* MOVEMENT */

    if (level4Left) {
        level4X -= level4Speed;
    }

    if (level4Right) {
        level4X += level4Speed;
    }


    /* WORLD LIMIT */

    if (level4X < 0) {
        level4X = 0;
    }

    if (level4X > 2800) {
        level4X = 2800;
    }


    /* GRAVITY */

    level4PreviousY = level4Y;

    level4VelocityY -= level4Gravity;

    level4Y += level4VelocityY;


    /* GROUND */

    if (level4Y <= 105) {

        level4Y = 105;

        level4VelocityY = 0;

        level4Jumping = false;

    }


    /* PLATFORM COLLISION */

    checkLevel4Platforms();


    /* PLAYER POSITION */

    level4Player.style.left =
        level4X + "px";

    level4Player.style.bottom =
        level4Y + "px";


    /* CAMERA */

    const cameraX =
        Math.max(
            0,
            Math.min(
                level4X -
                window.innerWidth / 2,

                3000 -
                window.innerWidth
            )
        );


    level4World.style.transform =
        `translateX(-${cameraX}px)`;


    /* COLLECT BALLS */

    checkCricketBalls();


    requestAnimationFrame(
        level4GameLoop
    );

}


/* =========================
   PLATFORM COLLISION
========================= */

function checkLevel4Platforms() {

    const platforms = [

        {
            x: 700,
            width: 220,
            bottom: 210,
            height: 25
        },

        {
            x: 1100,
            width: 230,
            bottom: 300,
            height: 25
        },

        {
            x: 1650,
            width: 240,
            bottom: 220,
            height: 25
        }

    ];


    if (level4VelocityY > 0) {
        return;
    }


    const playerWidth = 60;


    platforms.forEach(platform => {

        const platformTop =
            platform.bottom +
            platform.height;


        const playerLeft =
            level4X;

        const playerRight =
            level4X +
            playerWidth;


        const horizontalOverlap =
            playerRight >
            platform.x &&
            playerLeft <
            platform.x +
            platform.width;


        const crossedPlatform =
            level4PreviousY >=
            platformTop &&
            level4Y <=
            platformTop;


        if (
            horizontalOverlap &&
            crossedPlatform
        ) {

            level4Y =
                platformTop;

            level4VelocityY = 0;

            level4Jumping = false;

        }

    });

}


/* =========================
   CRICKET BALL COLLECTION
========================= */

function checkCricketBalls() {

    const balls =
        document.querySelectorAll(
            ".cricketBall"
        );


    balls.forEach(ball => {

        if (
            ball.dataset.collected ===
            "true"
        ) {
            return;
        }


        const ballX =
            ball.offsetLeft;


        const ballY =
            ball.offsetTop;


        const playerLeft =
            level4X;

        const playerRight =
            level4X + 60;


        const playerTop =
            (level4Screen.clientHeight - 90)
            - level4Y;


        const playerBottom =
            playerTop + 90;


        const ballRight =
            ballX + 65;


        const ballBottom =
            ballY + 65;


        const touching =
            playerLeft < ballRight &&
            playerRight > ballX &&
            playerTop < ballBottom &&
            playerBottom > ballY;


        if (touching) {

            collectCricketBall(ball);

        }

    });

}


/* =========================
   COLLECT BALL
========================= */

function collectCricketBall(ball) {

    ball.dataset.collected =
        "true";

    ball.style.display =
        "none";


    level4Runs++;


    runCountDisplay.textContent =
        level4Runs;


    if (level4Runs >= 5) {

        finishLevel4();

    }

}


/* =========================
   FINISH LEVEL 4
========================= */

function finishLevel4() {

    level4Running = false;

    level4Ending.classList.remove(
        "hidden"
    );

}
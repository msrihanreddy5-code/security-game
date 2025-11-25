// Messages
const messages = [
    { text: "Your bank account will be blocked!", type: "danger" },
    { text: "Your OTP is 5830. Don't share.", type: "safe" },
    { text: "Free diamonds for Free Fire!", type: "danger" },
    { text: "Meeting at 5pm tomorrow.", type: "safe" },
    { text: "Suspicious login detected.", type: "sus" },
    { text: "KYC pending, SIM will stop.", type: "sus" },
];

// Game variables
let score = 0;
let lives = 3;
let timeLeft;
let speed;
let current;
let gameOver = false;

// UI Elements
const msgBox = document.getElementById("fallingMessage");
const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");
const timerText = document.getElementById("timer");
const levelText = document.getElementById("levelText");
const resultMsg = document.getElementById("resultMsg");
const restartBtn = document.getElementById("restartBtn");
const difficultyScreen = document.getElementById("difficultyScreen");
const gameContainer = document.getElementById("gameContainer");

// Difficulty Logic
const difficultySettings = {
    easy:   { time: 12, speed: 1.5,  label: "Easy" },
    medium: { time: 9,  speed: 2.5,  label: "Medium" },
    hard:   { time: 6,  speed: 4.0,  label: "Hard" }
};

// Difficulty selection
document.querySelectorAll(".diffBtn").forEach(btn => {
    btn.onclick = () => {
        const level = btn.getAttribute("data-level");
        startGame(level);
    };
});

// Start Game with selected difficulty
function startGame(level) {
    let set = difficultySettings[level];

    timeLeft = set.time;
    speed = set.speed;

    levelText.innerText = "Level: " + set.label;

    difficultyScreen.style.display = "none";
    gameContainer.style.display = "block";

    loadMessage();
    startTimer();
}

// Load new message
function loadMessage() {
    current = messages[Math.floor(Math.random() * messages.length)];
    msgBox.innerText = current.text;
    msgBox.style.top = "-100px";

    fallMessage();
}

// Falling message animation
function fallMessage() {
    let pos = -100;
    let fall = setInterval(() => {

        if (gameOver) { clearInterval(fall); return; }

        pos += speed;
        msgBox.style.top = pos + "px";

        if (pos > 350) {
            wrongChoice();
            clearInterval(fall);
        }

    }, 20);
}

// Timer
function startTimer() {
    setInterval(() => {
        if (gameOver) return;

        timeLeft--;
        timerText.innerText = "⏳ Time: " + timeLeft + "s";

        if (timeLeft <= 0) {
            wrongChoice();
        }
    }, 1000);
}

// Check answers
document.getElementById("allowBtn").onclick = () => check("allow");
document.getElementById("blockBtn").onclick = () => check("block");
document.getElementById("reportBtn").onclick = () => check("report");

function check(action) {
    if (gameOver) return;

    let correct = false;

    if (current.type === "safe" && action === "allow") correct = true;
    if (current.type === "danger" && action === "block") correct = true;
    if (current.type === "sus" && action === "report") correct = true;

    correct ? rightChoice() : wrongChoice();
}

// Correct action
function rightChoice() {
    score += 5;
    scoreText.innerText = "Score: " + score;

    timeLeft = Math.min(timeLeft + 3, 12);
    msgBox.style.background = "#238636";

    setTimeout(loadMessage, 300);
}

// Wrong action
function wrongChoice() {
    lives--;
    livesText.innerText = "❤️ Lives: " + lives;

    msgBox.style.background = "#da3633";

    if (lives <= 0) {
        endGame("❌ You Lost! Cyber attack succeeded!");
    } else {
        setTimeout(loadMessage, 300);
    }

    timeLeft = Math.max(5, timeLeft - 2);
}

// End game
function endGame(msg) {
    gameOver = true;
    resultMsg.innerText = msg;
    restartBtn.style.display = "inline-block";
}

// Restart
restartBtn.onclick = () => location.reload();

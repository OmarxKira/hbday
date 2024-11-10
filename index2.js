const stickman = document.getElementById("character");

let posX = window.innerWidth / 10;
const moveDistance = 10;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      posX -= moveDistance;
      break;
    case "ArrowRight":
      posX += moveDistance;
      break;
  }

  stickman.style.left = `${posX}px`;
});

const messages = [
  "أهلا وسهلا بفنانتنا العزيزة حبيبة",
  "في البداية نعتذر عن ردائة الصوت وردائة الموقع, لم يسع لنا الوقت ولم تسع لنا الصحة لإتمام هذه الهدية لهذه الفنانة العظيمة",
  "نود أن نهنئ فناتنا العزيزة حبية بإتمامها العام العشرين متمنين من الله عز وجل دوام الصحة والعافية  و النشاط  و الرشاقة  و الصياح",
  "أما بعد , فهذه لعبة بسيطة منا نتمنى أن تنال رضاكي وإعجابُكي",
  "هذه اللعبة عبارة عن أن تفقعي البلالين, حتى تصلي لسكور معين وبعدها ستحصلين على الجائزة الكبرى",
  "نتمنى أن تنال هذه الهدية إعاجبكي ونراكي إن شاء الله في العام القادم"
];

const audioplay = document.getElementById("audioplay");
const messageContainer = document.getElementById("messageContainer");
const loadingMessage = document.getElementById("loadingMessage");

const winMessage = document.getElementById("winMessage");
const winVideo = document.getElementById("winVideo");
const playButton = document.getElementById("playButton");
const balloonCanvas = document.getElementById("balloonCanvas");
const scoreDisplay = document.getElementById("score");
const ctx = balloonCanvas.getContext("2d");

let delayBetweenMessages = 3800;
let typingSpeed = 4000;
let audioStarted = false;
let confettiStarted = false;
let audioEnded = false;

let confettiArray = [];
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;

let balloons = [];
let score = 0;
const scoreToWin = 15;

balloonCanvas.width = window.innerWidth;
balloonCanvas.height = window.innerHeight;

// Adjust the canvas size when the window is resized (for mobile responsiveness)
window.addEventListener("resize", () => {
  balloonCanvas.width = window.innerWidth;
  balloonCanvas.height = window.innerHeight;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

// Initial setup when the page loads
window.onload = () => {
  loadingMessage.style.display = "block";
  scoreDisplay.style.display = "none"; // Hide score initially
};

function showMessageWithTypingEffect(index) {
  if (index >= messages.length) return;

  const messageText = messages[index];
  messageContainer.innerHTML = `<p class="vmain-m">${messageText}</p>`;

  const messageElement = messageContainer.querySelector(".vmain-m");
  messageElement.style.animation = `typing ${typingSpeed / 2000}s steps(20, end) forwards`;

  setTimeout(() => {
    setTimeout(() => {
      messageContainer.innerHTML = "";
      showMessageWithTypingEffect(index + 1);
    }, delayBetweenMessages);
  }, typingSpeed);
}

function startCelebration() {
  if (!confettiStarted) {
    generateConfetti();
    animateConfetti();
    confettiStarted = true;
  }
}

function generateConfetti() {
  const confettiCount = 200;
  confettiArray = [];
  const confettiColors = ["#ff6b6b", "#ffd93d", "#6bcfff", "#a3d8f4", "#ffb6b9"];

  for (let i = 0; i < confettiCount; i++) {
    let x = Math.random() * confettiCanvas.width;
    let y = Math.random() * confettiCanvas.height;
    let color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confettiArray.push(new ConfettiPiece(x, y, color));
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiArray.forEach((confetti) => {
    confetti.update();
    confetti.draw();
  });
  requestAnimationFrame(animateConfetti);
}

function ConfettiPiece(x, y, color) {
  this.x = x;
  this.y = y;
  this.size = Math.random() * 8 + 4;
  this.color = color;
  this.speed = Math.random() * 5 + 2;
  this.update = function () {
    this.y += this.speed;
    if (this.y > confettiCanvas.height) {
      this.y = 0;
      this.x = Math.random() * confettiCanvas.width;
    }
  };
  this.draw = function () {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };
}

function createBalloon() {
  const x = Math.random() * balloonCanvas.width;
  const y = balloonCanvas.height + 50;
  const radius = Math.random() * 20 + 30;
  const speed = Math.random() * 2 + 1;
  const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

  balloons.push({ x, y, radius, speed, color });
}

function drawBalloons() {
  ctx.clearRect(0, 0, balloonCanvas.width, balloonCanvas.height);
  balloons.forEach((balloon) => {
    ctx.beginPath();
    ctx.arc(balloon.x, balloon.y, balloon.radius, 0, Math.PI * 2);
    ctx.fillStyle = balloon.color;
    ctx.fill();
    ctx.closePath();
  });
}

function updateBalloons() {
  balloons.forEach((balloon) => {
    balloon.y -= balloon.speed;
  });
  balloons = balloons.filter((balloon) => balloon.y + balloon.radius > 0); // Keep balloons that are within the canvas
}

function showBloodEffect(x, y) {
  const blood = document.createElement("div");
  blood.classList.add("blood");
  blood.style.left = `${x}px`;
  blood.style.top = `${y}px`;
  document.body.appendChild(blood);
  setTimeout(() => blood.remove(), 2000);
}

balloonCanvas.addEventListener("click", (e) => {
  const rect = balloonCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  balloons = balloons.filter((balloon) => {
    const distance = Math.sqrt((mouseX - balloon.x) ** 2 + (mouseY - balloon.y) ** 2);
    if (distance < balloon.radius) {
      score++;
      updateScoreDisplay();
      showBloodEffect(mouseX + rect.left, mouseY + rect.top);
      if (score >= scoreToWin) {
        showWinMessage();
      }
      return false; // Remove balloon
    }
    return true;
  });
});

function updateScoreDisplay() {
  scoreDisplay.innerText = `Score: ${score}`;
}

function showWinMessage() {
  winMessage.style.display = "block";
  console.log("Showing win message");
  showWinVideo();
  balloonCanvas.style.display = "none";
  confettiCanvas.style.display = "none";
}

function showWinVideo() {
  console.log("Showing win video");
  winVideo.style.display = "block";
  winVideo.play().catch((error) => {
    console.error("Error playing video:", error);
  });
}

function gameLoop() {
  if (balloons.length < 5) {
    createBalloon();
  }
  updateBalloons();
  drawBalloons();
  requestAnimationFrame(gameLoop);
}

audioplay.addEventListener("ended", () => {
  audioEnded = true; // Set audio ended flag to true
  playButton.style.display = "block"; // Show the play button after audio ends
  confettiCanvas.style.display = "none"; // Hide confetti canvas
  balloonCanvas.style.display = "none"; // Hide balloon canvas initially
});

playButton.addEventListener("click", () => {
  playButton.style.display = "none"; // Hide the play button
  score = 0; // Reset the score
  updateScoreDisplay(); // Update the score display
  scoreDisplay.style.display = "block"; // Show the score display
  gameLoop(); // Start the balloon game loop
  balloonCanvas.style.display = "block"; // Show balloon canvas
  messageContainer.style.display = "none"; // Hide message container after play button click
});

document.addEventListener("click", () => {
  if (!audioStarted) {
    audioplay.currentTime = 0;
    audioplay.play().catch((error) => {
      console.log("Audio playback requires interaction with the page:", error);
    });
    audioStarted = true;
    showMessageWithTypingEffect(0);
    loadingMessage.style.display = "none"; // Hide loading message when audio starts
    messageContainer.style.display = "block"; // Show message container when audio starts
  }
});

// Add fullscreen functionality for mobile and desktop
winVideo.addEventListener("click", () => {
  if (winVideo.requestFullscreen) {
    winVideo.requestFullscreen();
  } else if (winVideo.mozRequestFullScreen) { // Firefox
    winVideo.mozRequestFullScreen();
  } else if (winVideo.webkitRequestFullscreen) { // Chrome, Safari and Opera
    winVideo.webkitRequestFullscreen();
  } else if (winVideo.msRequestFullscreen) { // IE/Edge
    winVideo.msRequestFullscreen();
  }
});

// Setting Levels
const lvls = {
  Easy: 5,
  Normal: 4,
  Hard: 3,
};

// Default Level
let defaultLevel = "Normal";

// Get Selectors
let lvlNameSpan = document.querySelector(".msg .lvl");
let SecondsSpan = document.querySelector(".msg .seconds");
let theWord = document.querySelector(".the-word");
let input = document.querySelector(".input");
let startBtn = document.querySelector(".start");
let restartBtn = document.querySelector(".restart");
let bestScore = document.querySelector(".best-score");
let upcomingWords = document.querySelector(".upcoming-words");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scoreTotal = document.querySelector(".score .total");
let finishMsg = document.querySelector(".finish");

// Initial UI setup
lvlNameSpan.innerHTML = defaultLevel;
SecondsSpan.innerHTML = lvls[defaultLevel];
timeLeftSpan.innerHTML = lvls[defaultLevel];
scoreTotal.innerHTML = 10;
input.disabled = true;

// Word arrays
let easyWords = [
  "rune",
  "life",
  "bug",
  "kiwi",
  "quiz",
  "axe",
  "cat",
  "desk",
  "wind",
  "pale",
];
let normalWords = [
  "array",
  "apple",
  "mango",
  "naruto",
  "bleach",
  "tennis",
  "cricket",
  "always",
  "nature",
  "quality",
];
let hardWords = [
  "function",
  "variable",
  "algorithm",
  "onepiece",
  "dragonball",
  "baseball",
  "condition",
  "stranger",
  "powerful",
  "exchange",
];

// Level → Words mapping
const wordsByLevel = { Easy: easyWords, Normal: normalWords, Hard: hardWords };

// Choosing Levels
let lvlsInput = document.querySelectorAll(".choose-lvls input");

lvlsInput.forEach((input) => {
  input.onclick = function () {
    let selectedLvl = this.labels[0].textContent;
    lvlNameSpan.innerHTML = selectedLvl;
    SecondsSpan.innerHTML = lvls[selectedLvl];
    timeLeftSpan.innerHTML = lvls[selectedLvl];
    getBestScore();
    applyTheme();
  };
});

// Disable Paste Event
input.onpaste = () => false;

// Start Game
startBtn.onclick = function () {
  this.remove();
  input.disabled = false;
  input.focus();
  generateWords();
  startPlay();
};

// Restart The Game
restartBtn.onclick = function () {
  window.location.reload();
};

// WORD GENERATION
function generateWords() {
  const currentLevel = lvlNameSpan.innerHTML;
  const words = wordsByLevel[currentLevel];

  const randomIndex = Math.floor(Math.random() * words.length);
  const randomWord = words[randomIndex];

  words.splice(randomIndex, 1);
  theWord.textContent = randomWord;

  upcomingWords.innerHTML = "";
  words.forEach((word) => {
    const div = document.createElement("div");
    div.textContent = word;
    upcomingWords.appendChild(div);
  });
}

// GAME TIMER
let isFirstWord = true; // flag to track first word

function startPlay() {
  lvlsInput.forEach((lvl) => (lvl.disabled = true));

  // Set initial time depending on whether it is the first word
  const levelTime = lvls[lvlNameSpan.innerHTML];
  timeLeftSpan.innerHTML = isFirstWord ? levelTime + 3 : levelTime;

  let timer = setInterval(() => {
    timeLeftSpan.innerHTML--;

    if (Number(timeLeftSpan.innerHTML) === 0) {
      clearInterval(timer);

      if (theWord.textContent === input.value) {
        input.value = "";
        scoreGot.innerHTML++;

        const words = wordsByLevel[lvlNameSpan.innerHTML];
        if (words.length > 0) {
          generateWords();
          isFirstWord = false; // after the first word, reset flag
          startPlay();
        } else {
          finishMsg.innerHTML = "Congratulations You Won!";
          finishMsg.classList.add("good", "win");
          upcomingWords.remove();
          input.disabled = true;
          saveBestScore();
          getBestScore();
          addGlitter(finishMsg);
        }
      } else {
        finishMsg.innerHTML = "Game Over!";
        finishMsg.classList.add("bad");
        upcomingWords.remove();
        restartBtn.style.display = "block";
        bestScore.style.display = "block";
        input.disabled = true;
        saveBestScore();
        getBestScore();
      }
    }
  }, 1000);
}

// BEST SCORE (LEVEL BASED)
function saveBestScore() {
  const level = lvlNameSpan.innerHTML;
  const score = Number(scoreGot.innerHTML);
  const key = `bestScore_${level}`;

  const storedScore = Number(localStorage.getItem(key)) || 0;

  if (score > storedScore) {
    localStorage.setItem(key, score);
  }
}

function getBestScore() {
  const level = lvlNameSpan.innerHTML;
  const key = `bestScore_${level}`;
  const best = localStorage.getItem(key) || 0;

  let bestScoreSpan = document.querySelector(".best-score span");
  bestScoreSpan.innerHTML = best;
}

// Change Game Theme
function applyTheme() {
  document.body.classList.remove("theme-easy", "theme-hard");

  if (lvlNameSpan.innerHTML === "Easy") {
    document.body.classList.add("theme-easy");
    let timebox = document.querySelector(".time");
    let scorebox = document.querySelector(".score");
    timebox.style.color = "var(--muted-text)";
    scorebox.style.color = "var(--muted-text)";
  } else if (lvlNameSpan.innerHTML === "Hard") {
    document.body.classList.add("theme-hard");
    let timebox = document.querySelector(".time");
    let scorebox = document.querySelector(".score");
    g;
    timebox.style.color = "white";
    scorebox.style.color = "white";
  } else {
    let timebox = document.querySelector(".time");
    let scorebox = document.querySelector(".score");
    timebox.style.color = "var(--muted-text)";
    scorebox.style.color = "var(--muted-text)";
  }
}

// Add glitter
function addGlitter(finishBox) {
  for (let i = 0; i < 20; i++) {
    // 20 glitter particles
    const glitter = document.createElement("span");
    glitter.classList.add("glitter");

    // Random position inside the box
    glitter.style.left = Math.random() * 100 + "%";
    glitter.style.top = Math.random() * 50 + "%";

    // Random animation delay for flicker effect
    glitter.style.animationDelay = Math.random() * 2 + "s";

    finishBox.appendChild(glitter);
  }
}

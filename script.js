const gameBoard = document.getElementById("game-board");
const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");
const timerText = document.getElementById("timer");
const bestScoreText = document.getElementById("best-score");

const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");

const allSymbols = ["🍎", "🎮", "🐱", "⭐", "🔥", "🚀", "🐸", "🍕"];

let symbols = allSymbols.slice(0, 6);
let cards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let lockBoard = false;
let seconds = 0;
let timer;
let difficulty = "medium";

function startGame() {
  gameBoard.innerHTML = "";
  message.textContent = "";
  moves = 0;
  matches = 0;
  flippedCards = [];
  lockBoard = false;

  clearInterval(timer);
  seconds = 0;
  timerText.textContent = seconds;
  startTimer();

  movesText.textContent = moves;
  matchesText.textContent = `${matches}/${symbols.length}`;
  bestScoreText.textContent = localStorage.getItem(`bestScore-${difficulty}`) || "X";

  cards = [...symbols, ...symbols];
  shuffleCards();

  cards.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.textContent = "?";

    card.addEventListener("click", flipCard);

    gameBoard.appendChild(card);
  });

  updateBoardSize();
}

function updateBoardSize() {
  if (symbols.length === 4) {
    gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else if (symbols.length === 6) {
    gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else {
    gameBoard.style.gridTemplateColumns = "repeat(4, 1fr)";
  }
}

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
  }
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timerText.textContent = seconds;
  }, 1000);
}

function flipCard() {
  if (lockBoard) return;
  if (this.classList.contains("flipped")) return;
  if (this.classList.contains("matched")) return;

  this.textContent = this.dataset.symbol;
  this.classList.add("flipped");

  flippedCards.push(this);

  if (flippedCards.length === 2) {
    moves++;
    movesText.textContent = moves;

    movesText.classList.add("updated");

    setTimeout(() => {
      movesText.classList.remove("updated");
    }, 200);

    checkMatch();
  }
}

function checkMatch() {
  const cardOne = flippedCards[0];
  const cardTwo = flippedCards[1];

  if (cardOne.dataset.symbol === cardTwo.dataset.symbol) {
    cardOne.classList.add("matched");
    cardTwo.classList.add("matched");

    flippedCards = [];
    matches++;
    matchesText.textContent = `${matches}/${symbols.length}`;

    if (matches === symbols.length) {
      clearInterval(timer);

      const bestScoreKey = `bestScore-${difficulty}`;
      const bestScore = localStorage.getItem(bestScoreKey);

      if (!bestScore || moves < Number(bestScore)) {
        localStorage.setItem(bestScoreKey, moves);
        bestScoreText.textContent = moves;

        message.innerHTML = `
          🎉 NEW BEST SCORE! 🎉<br>
          Difficulty: ${difficulty}<br>
          Moves: ${moves}<br>
          Time: ${seconds} seconds
        `;
      } else {
        message.innerHTML = `
          🎉 You Won! 🎉<br>
          Difficulty: ${difficulty}<br>
          Moves: ${moves}<br>
          Time: ${seconds} seconds<br>
          Best Score: ${bestScore} moves
        `;
      }
    }
  } else {
    lockBoard = true;

    setTimeout(() => {
      cardOne.textContent = "?";
      cardTwo.textContent = "?";

      cardOne.classList.remove("flipped");
      cardTwo.classList.remove("flipped");

      flippedCards = [];
      lockBoard = false;
    }, 800);
  }
}

easyBtn.addEventListener("click", () => {
  difficulty = "Easy";
  symbols = allSymbols.slice(0, 4);
  startGame();
});

mediumBtn.addEventListener("click", () => {
  difficulty = "Medium";
  symbols = allSymbols.slice(0, 6);
  startGame();
});

hardBtn.addEventListener("click", () => {
  difficulty = "Hard";
  symbols = allSymbols.slice(0, 8);
  startGame();
});

restartBtn.addEventListener("click", startGame);

startGame();
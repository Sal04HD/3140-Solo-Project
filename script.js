const gameBoard = document.getElementById("game-board");
const movesText = document.getElementById("moves");
const matchesText = document.getElementById("matches");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart-btn");

const symbols = ["🍎", "🎮", "🐱", "⭐", "🔥", "🚀"];

let cards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let lockBoard = false;

function startGame() {
  gameBoard.innerHTML = "";
  message.textContent = "";
  moves = 0;
  matches = 0;
  flippedCards = [];
  lockBoard = false;

  movesText.textContent = moves;
  matchesText.textContent = matches;

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
}

function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
  }
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
    matchesText.textContent = matches;

    if (matches === symbols.length) {
      message.textContent = `You won in ${moves} moves!`;
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

restartBtn.addEventListener("click", startGame);

startGame();
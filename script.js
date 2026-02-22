const levels = {
  fruits: ["🍎","🍌","🍇","🍉","🍓","🍒","🥝","🍍"]
};

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let currentSymbols = [];

function startGame(level) {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  document.getElementById("levelTitle").innerText = level.toUpperCase();

  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";

  currentSymbols = [...levels[level], ...levels[level]];
  currentSymbols.sort(() => 0.5 - Math.random());

  matchedPairs = 0;

  currentSymbols.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;

    card.innerHTML = `
      <div class="front">?</div>
      <div class="back">${symbol}</div>
    `;

    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if (isMatch) {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    matchedPairs++;

    if (matchedPairs === currentSymbols.length / 2) {
      setTimeout(() => {
        alert("🎉 Level Complete!");
        goToMenu();
      }, 500);
    }

    resetBoard();
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 800);
  }
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function goToMenu() {
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
}

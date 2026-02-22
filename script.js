document.addEventListener("DOMContentLoaded", () => {
  // Data kartu dengan gambar, teks, warna, dan audio
  const cardData = [
    {
      // Menghapus / di awal agar sesuai dengan folder di GitHub/Vercel
      image: "public/apel.png", 
      text: "Apel",
      color: "#ff6b6b",
      soundId: "apel-sound",
    },
    {
      image: "public/pisang.png",
      text: "Pisang",
      color: "#ffe066",
      soundId: "pisang-sound",
    },
    {
      image: "public/jeruk.png",
      text: "Jeruk",
      color: "#ffa94d",
      soundId: "jeruk-sound",
    },
    {
      image: "public/anggur.png",
      text: "Anggur",
      color: "#cc5de8",
      soundId: "anggur-sound",
    },
    {
      image: "public/semangka.png",
      text: "Semangka",
      color: "#c0eb75",
      soundId: "semangka-sound",
    },
    {
      image: "public/stroberi.png",
      text: "Stroberi",
      color: "#ff8787",
      soundId: "stroberi-sound",
    },
  ];

  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let score = 0;
  let lockBoard = false;

  const gameBoard = document.getElementById("game-board");
  const scoreElement = document.getElementById("score");
  const movesElement = document.getElementById("moves");
  const resetButton = document.getElementById("reset-btn");
  const winMessage = document.getElementById("win-message");
  const finalScoreElement = document.getElementById("final-score");
  const finalMovesElement = document.getElementById("final-moves");
  const playAgainButton = document.getElementById("play-again");

  const matchSound = document.getElementById("match-sound");
  const winSound = document.getElementById("win-sound");

  function playFruitSound(soundId) {
    const audio = document.getElementById(soundId);
    if (audio) {
      audio.currentTime = 0;
      // Menangani error jika browser memblokir autoplay suara
      audio.play().catch(error => console.log("Audio play blocked:", error));
    }
  }

  function initGame() {
    cards = [...cardData, ...cardData]
      .map((card, index) => ({ ...card, pairId: card.text }))
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));

    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    score = 0;
    lockBoard = false;

    scoreElement.textContent = score;
    movesElement.textContent = moves;
    gameBoard.innerHTML = "";

    cards.forEach((card, index) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.dataset.index = index;

      cardElement.innerHTML = `
                        <div class="card-front">
                            <img src="${card.image}" alt="${card.text}">
                            <div class="card-text">${card.text}</div>
                        </div>
                        <div class="card-back"></div>
                    `;

      cardElement.addEventListener("click", flipCard);
      gameBoard.appendChild(cardElement);
    });

    winMessage.style.display = "none";
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;
    if (this.classList.contains("flipped")) return;

    this.classList.add("flipped");

    const cardIndex = this.dataset.index;
    const cardInfo = cards[cardIndex];

    setTimeout(() => {
      playFruitSound(cardInfo.soundId);
    }, 300);

    flippedCards.push(this);

    if (flippedCards.length === 2) {
      lockBoard = true;
      moves++;
      movesElement.textContent = moves;
      setTimeout(checkMatch, 600);
    }
  }

  function checkMatch() {
    const firstIndex = flippedCards[0].dataset.index;
    const secondIndex = flippedCards[1].dataset.index;
    const isMatch = cards[firstIndex].pairId === cards[secondIndex].pairId;

    if (isMatch) {
      disableCards();
      if (matchSound) matchSound.play().catch(() => {});
      score += 10;
      scoreElement.textContent = score;
      matchedPairs++;
      
      if (matchedPairs === cardData.length) {
        setTimeout(() => {
          if (winSound) winSound.play().catch(() => {});
          showWinMessage();
        }, 1000);
      }
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    flippedCards.forEach((card) => {
      card.style.pointerEvents = "none";
    });
    resetBoard();
  }

  function unflipCards() {
    flippedCards.forEach((card) => {
      card.classList.remove("flipped");
    });
    resetBoard();
  }

  function resetBoard() {
    [lockBoard, flippedCards] = [false, []];
  }

  function showWinMessage() {
    finalScoreElement.textContent = score;
    finalMovesElement.textContent = moves;
    winMessage.style.display = "flex";
  }

  resetButton.addEventListener("click", initGame);
  playAgainButton.addEventListener("click", initGame);

  initGame();
});

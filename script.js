const fruits = [
    { name: 'apel', img: 'public/apel.png' },
    { name: 'pisang', img: 'public/pisang.png' },
    { name: 'jeruk', img: 'public/jeruk.png' },
    { name: 'anggur', img: 'public/anggur.png' },
    { name: 'semangka', img: 'public/semangka.png' },
    { name: 'stroberi', img: 'public/stroberi.png' }
];

let firstCard, secondCard;
let lockBoard = false;
let moves = 0;

function startGame(type) {
    document.getElementById('lobby').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    setupBoard(fruits);
}

function goToLobby() {
    location.reload(); // Cara paling simpel reset game
}

function setupBoard(data) {
    const board = document.getElementById('game-board');
    const deck = [...data, ...data].sort(() => Math.random() - 0.5);
    
    board.innerHTML = '';
    deck.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-front"><img src="${item.img}"></div>
            <div class="card-back"></div>
        `;
        card.addEventListener('click', () => flipCard(card, item.name));
        board.appendChild(card);
    });
}

function flipCard(card, name) {
    if (lockBoard || card === firstCard) return;
    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = { card, name };
        return;
    }

    secondCard = { card, name };
    checkMatch();
}

function checkMatch() {
    moves++;
    document.getElementById('moves').innerText = moves;
    let isMatch = firstCard.name === secondCard.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    document.getElementById('match-sound').play();
    firstCard = null; secondCard = null;
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.card.classList.remove('flipped');
        secondCard.card.classList.remove('flipped');
        firstCard = null; secondCard = null;
        lockBoard = false;
    }, 1000);
}

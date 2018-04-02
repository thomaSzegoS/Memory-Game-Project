let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o',
'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let open = [];
let countMatched = 0;
let countMoves = 0;
let countClicks = 0;
let timer;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const container = document.querySelector('.container');
const panel = document.querySelector('.score-panel');
const deck = document.querySelector('.deck');
const gameOverContainer = document.querySelector('.game-over-container');

function setDeck() {
    shuffle(cards);
    let deckLi = deck.getElementsByTagName('li');
    for (let i=0; i<deckLi.length; i++)
        deckLi[i].querySelector('i').classList = 'fa ' + cards[i];
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function showCard(card) {
    card.classList.add('open', 'show');
}

function hideCards(card1, card2) {
    open = [];
    setTimeout(function() {
        card1.classList.remove('open', 'show');
        card2.classList.remove('open', 'show');
      }, 1000);
}

function checkCard(currentCard) {
      open.push(currentCard);
      if (open.length === 2) {
          moveCounter();
          let recentCard = open[0];
          if (recentCard.children[0].className === currentCard.children[0].className)
              matchCards(recentCard, currentCard);
          else
              hideCards(recentCard, currentCard);
      }
}

function matchCards(card1, card2) {
    countMatched += 1;
    open = [];
    card1.classList.add('match');
    card2.classList.add('match');
    if (countMatched === cards.length/2)
        gameOver();
}

function moveCounter() {
    countMoves += 1;
    let movesNumber = panel.querySelector('.moves');
    let movesText = panel.querySelector('.moves-text');

    movesNumber.textContent = countMoves;
    if (countMoves === 1)
        movesText.textContent = 'Move';
    else {
        movesText.textContent = 'Moves';
    }
    let stars = panel.querySelector('.stars');
    if (countMoves %  12 === 0 && stars.children.length > 0)
        stars.children[0].remove();
}

function reset() {
    open = [];
    countMatched = 0;
    countMoves = 0;
    countClicks = 0;
    children = deck.children;
    clearInterval(timer);
    document.querySelector('.time').innerHTML = 0;
    for (let i=0; i<children.length; i++)
        children[i].classList.remove('open', 'show', 'match');
    panel.querySelector('.moves').textContent = countMoves;
    panel.querySelector('.moves-text').textContent = 'Moves';
    let stars = panel.querySelector('.stars').childElementCount;
    let deletedStars = getFragment(3 - stars);
    panel.querySelector('.stars').appendChild(deletedStars);
}

function getFragment(number) {
    let fragment = document.createDocumentFragment();
    for (let i=0; i<number; i++) {
        let li = document.createElement('li');
        li.innerHTML = '<i class="fa fa-star"></i>';
        fragment.appendChild(li);
    }
    return fragment;
}

function timeStart(start) {
    timer = setInterval(function() {
    let seconds = Math.floor((Date.now()-start) / 1000);
    document.querySelector('.time').innerHTML = seconds;
  }, 1000);
}

function gameOver() {
    gameOverContainer.querySelector('.game-moves').textContent = countMoves + ' Moves';
    let stars = panel.querySelector('.stars').childElementCount;
    if (stars === 1)
        gameOverContainer.querySelector('.game-stars').textContent = stars + ' Star.';
    else
        gameOverContainer.querySelector('.game-stars').textContent = stars + ' Stars.';

    container.style.display = 'none';
    gameOverContainer.style.display = 'block';
}

function restart() {
    reset();
    gameOverContainer.style.display = 'none';
    container.style.display = 'flex';
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

setDeck();

deck.addEventListener('click', function(event) {
    countClicks += 1;
    if (!(event.target.classList.contains('show') || event.target.classList.contains('match')) && event.target.tagName === "LI") {
        showCard(event.target);
        checkCard(event.target);
    }
    if (countClicks === 1) {
        let now = Date.now();
        timeStart(now);
    }
});

panel.querySelector('.restart').addEventListener('click', function() {
    reset();
});

gameOverContainer.querySelector('.btn_restart').addEventListener('click', function() {
    restart();
});

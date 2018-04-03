/*jshint esversion: 6 */
let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o',
'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let open = [];
let countMatched = 0;
let countMoves = 0;
let countClicks = 0;
let timer;

const container = document.querySelector('.container');
const panel = document.querySelector('.score-panel');
const deck = document.querySelector('.deck');
const gameOverContainer = document.querySelector('.game-over-container');

// Preparing the deck
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

// Checking matched cards
function checkCard(currentCard) {
      open.push(currentCard);  // Push the clicked card to the open cards list
      if (open.length === 2) {
          moveCounter();  // Count it as one move with moveCounter() method
          let recentCard = open[0];
          if (recentCard.children[0].className === currentCard.children[0].className)  // Check if the clicked card and the previous clicked card are matched
              matchCards(recentCard, currentCard);
          else
              hideCards(recentCard, currentCard);
      }
}

// If the two cards are matched
function matchCards(card1, card2) {
    countMatched += 1;
    open = [];  // Reset the open card list
    card1.classList.add('match');
    card2.classList.add('match');
    if (countMatched === cards.length/2)  // Check if the number of the matched cards is 8
        gameOver();
}

// Setting the moves and the score panel
function moveCounter() {
    let movesNumber = panel.querySelector('.moves');
    let movesText = panel.querySelector('.moves-text');
    let stars = panel.querySelector('.stars');

    countMoves += 1;
    movesNumber.textContent = countMoves;

    if (countMoves === 1)
        movesText.textContent = 'Move';
    else
        movesText.textContent = 'Moves';

    if (countMoves %  16 === 0 && stars.children.length > 0)  // For every sixteen moves delete a star from the panel
        stars.children[0].remove();
}

// Resetting the deck of cards
function reset() {
    open = []; // Reset the open card list
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
    let stars = panel.querySelector('.stars').childElementCount;  // Count the remain stars
    let deletedStars = getFragment(3 - stars);  // getFragment() method will return the star or the stars have been deleted
    panel.querySelector('.stars').appendChild(deletedStars);

    setDeck();
}

// Create star elements
function getFragment(number) {
    let fragment = document.createDocumentFragment();
    for (let i=0; i<number; i++) {
        let li = document.createElement('li');
        li.innerHTML = '<i class="fa fa-star"></i>';
        fragment.appendChild(li);
    }
    return fragment;  // Return the elements created in the fragment
}

function timeStart(start) {
    timer = setInterval(function() {
    let seconds = Math.floor((Date.now()-start) / 1000);
    document.querySelector('.time').innerHTML = seconds;
  }, 1000);
}

// Showing the game over form and its content
function gameOver() {
    gameOverContainer.querySelector('.game-moves').textContent = countMoves + ' Moves';
    let stars = panel.querySelector('.stars').childElementCount;
    if (stars === 1)
        gameOverContainer.querySelector('.game-stars').textContent = stars + ' Star.';
    else
        gameOverContainer.querySelector('.game-stars').textContent = stars + ' Stars.';

    container.style.display = 'none';  // Hide the score panel and the deck of cards
    gameOverContainer.style.display = 'block';  // Display the game over form
}

// Resetting the page content
function restart() {
    reset();  // Reset the variables and the page content with restart method()
    gameOverContainer.style.display = 'none';  // Hide the game over form
    container.style.display = 'flex';  // Display the score panel and the deck of cards
}

/*
 * Event listeners
 */

// Deck - cards click
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

// Score panel - Restart button click
panel.querySelector('.restart').addEventListener('click', function() {
    reset();
});

// Game over form - Play again button click
gameOverContainer.querySelector('.btn_restart').addEventListener('click', function() {
    restart();
});

/*
 * Preparing the deck when page is loaded
 */

setDeck();

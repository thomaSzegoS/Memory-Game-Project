let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o',
'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let open = [];
let countMatched = 0;
let countMoves = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const deck = document.querySelector('.deck');

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
        console.log("Congrats!");

}

function moveCounter() {
    countMoves += 1;
    let movesNumber = document.querySelector(".moves");
    let movesText = document.querySelector('.movesText');

    movesNumber.textContent = countMoves;
    if (countMoves === 1)
        movesText.textContent = "Move";
    else {
      movesText.textContent = "Moves";
    }
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
    showCard(event.target);
    checkCard(event.target);
});

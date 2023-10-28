const modal = document.getElementById("mainModal");
const modalText = document.getElementById("modal-text");
const modalHeader = document.getElementById("modal-title");

const openingBtns = document.getElementsByClassName("card-button");
const closingBtn = document.getElementById("modal-closing-button");

const gambledValue = document.getElementById("text-input")

let eventsJsonFile;
fetch('/westward-expansion/json/events.json')
    .then( (response)=> {return response.json()} )
    .then(json=> eventsJsonFile=json);

/**
 * Fetches a random event
 * 
 * @param {string[]} eventsArray The array containing the events
 * @returns {string} The random event
 */
const fetchEvent = (eventsArray) => {
    const randomNumber = Math.floor(Math.random()*eventsArray.length); //Random number for an element from the array
    const randomEvent = eventsArray[randomNumber];

    return randomEvent;
}

/**
 * Sets up the string with the event
 * 
 * @param {string} eventsArray The JSON array with the events
 * @returns {string} The formatted question
 */
const setUpEvent = (eventsArray) => {
    const randomEvent = fetchEvent(eventsArray);
    const positiveEventPattern = /(\+)([^\+]+)(\+)/g;
    const negativeEventPattern = /(-)([^-]+)(-)/g;
    const regularEventPattern = /(~)([^~]+)(~)/g;

    const isPositiveEvent = randomEvent.match(positiveEventPattern)

    formattedQuestion = randomEvent.replace(negativeEventPattern,"<span style='color:#ff0000;'>$2</span>");
    formattedQuestion = formattedQuestion.replace(positiveEventPattern,"<span style='color:#00ff00;'>$2</span>");
    formattedQuestion = formattedQuestion.replace(regularEventPattern,"<span style='color:#ffbf00;'>$2</span>");

    formattedQuestion = "<p id='modal-text'>" + formattedQuestion + "</p>";

    return formattedQuestion;
}

/**
 * Sets up the gamble values and results
 * 
 * @param {int} value The inserter value to gamble
 * @returns {string: bool, string: int}
 */
const setUpGamble = (value) => {
    value = value===0?100000000000:value;
    const k = 100;
    const winningChance = (k/value);
    const randomNumber = Math.floor(Math.random()*100)+1;

    const multiplier = 5;
    const reward = multiplier*value;

    if (randomNumber<=winningChance) {
        return {
            hasWon: true,
            wonAmount: reward 
        }
    }

    return {
        hasWon: false,
        wonAmount: 0
    }
}

/**
 * 
 * @param {event} e The onclick event
 */
const openModal = (e) => {
    //Cleaning the modals

    let currButton = e.currentTarget; //Button clicked
    let buttonTheme = currButton.dataset.theme; //Theme from the Element
    
    if (buttonTheme === "event") {
        const formattedEvent = setUpEvent(eventsJsonFile);
        modalHeader.innerHTML = "O que será que vai acontecer agora?";
        modalText.innerHTML = formattedEvent;
    } else {
        const hasWonAndAmount = setUpGamble(parseInt(gambledValue.value));
        if (hasWonAndAmount.hasWon) {
            modalHeader.innerHTML = "Quais as chances?";
            modalText.innerHTML = "<p id='modal-text'>Parabéns! Você <span style='color:#00ff00;'>ganhou $"+hasWonAndAmount.wonAmount+".000</span>! Recolha seu dinheiro com o banco";
        } else {
            modalHeader.innerHTML = "Você me deve!";
            modalText.innerHTML = "<p id='modal-text'>Que pena! Parece que <span style='color:#ff0000'>você perdeu a aposta</span>. Não que isso seja um problema, você pode sempre tentar apostar de novo e ganhar mais do que perdeu! <span style='color:#ffbf00;'>Você pode ganhar 5x o valor inserido!</span>"
        }
    }

    modal.style.display = "flex"; //Displays modal
}

/**
 * Shuffles the given array
 * 
 * @param {any[]} array The array to get shuffled
 * @returns {any[]} The shuffled array
 */
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle
    while (currentIndex > 0) {
  
      // Pick a remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

for (let i=0;i<openingBtns.length;i++) {
    let currButton = openingBtns[i];
    currButton.addEventListener('click',openModal);
}

closingBtn.onclick = () => {
    modal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

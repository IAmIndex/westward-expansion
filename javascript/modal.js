const modal = document.getElementById("mainModal");
const modalHeader = document.getElementById("card-header");
const modalBody = document.getElementById("card-body");
const modalFooter = document.getElementById("card-footer");

const openingBtns = document.getElementsByClassName("btn-question-gen");
const closingBtn = document.getElementById("closeModalBtn");

let seenQuestions = {"theme-1":[],"theme-2":[],"theme-3":[],"theme-4":[]};

let configsJsonFile;
fetch('https://iamindex.github.io/Quiz-game/json/questions.json')
    .then( (response)=> {return response.json()} )
    .then(json=> configsJsonFile=json);

const fetchQuestion = (theme,questionsArray) => {
    const randomNumber = Math.floor(Math.random()*questionsArray.length); //Random number for an element from the array
    const randomQuestion = questionsArray[randomNumber];
    
    if (seenQuestions[theme].length == 10) { //If all questions were chosen, clear the array and restart
        seenQuestions[theme].splice(0,seenQuestions[theme].length);
        seenQuestions[theme].push(randomQuestion)
        return {"question":randomQuestion,"usedNumber":randomNumber}; 
    } else if (seenQuestions[theme].includes(randomQuestion)) {
        return fetchQuestion(theme,questionsArray);
    } else {
        seenQuestions[theme].push(randomQuestion)
        return {"question":randomQuestion,"usedNumber":randomNumber};
    }
}

const openModal = (e) => {
    //Cleaning the modals
    modalHeader.innerHTML = "";
    modalBody.innerHTML = "";
    modalFooter.innerHTML = "";

    let currButton = e.currentTarget; //Button clicked
    let buttonThemeNumber = currButton.dataset.targetTheme; //Theme from the Element
    let theme = configsJsonFile[buttonThemeNumber]; //Theme from Element in the JSON

    //From JSON file
    let questionsArray = theme.questions;
    let answersArray = theme.answers;
    let difficultiesArray = theme.difficulty;

    const generatedRandoms = fetchQuestion(buttonThemeNumber,questionsArray); //Random element an number
    const randomNumber = generatedRandoms.usedNumber; //Random number
    //Header
    const randomQuestion = generatedRandoms.question; //Random element from the array
    modalHeader.innerHTML = "<span class='close' onclick=\"document.getElementById('mainModal').style.display = 'none'\">&times;</span><h3>"+randomQuestion+"</h3>"; //Displays it
    
    //Body
    const pattern = /^\=/; //Pattern to the right answer
    answersArray = shuffle(answersArray[randomNumber]); //Respective answers to question
    for (let i=0;i<answersArray.length;i++) {
        let answer = answersArray[i]
        if (pattern.test(answersArray[i])) { //If is the correct answer
            answer = answer.slice(1);
            modalBody.innerHTML += "<p class='answer'>"+(i+1)+". "+answer+"</p><br>"; //Displays it
            continue;
        }
        modalBody.innerHTML += "<p class='answer-wrong'>"+(i+1)+". "+answer+"</p><br>"; //Displays it
    }

    //Footer
    const randomDifficulty = difficultiesArray[randomNumber]; //Random element from the array
    modalFooter.innerHTML = "<h3>"+randomDifficulty+"</h3>"; //Displays it

    modal.style.display = "block"; //Displays modal
}

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

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

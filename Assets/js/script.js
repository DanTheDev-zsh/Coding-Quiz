import quizJson from './api.json' assert {type: 'json'};

let startBtn = document.querySelector("#start-button");
let textChangeField = document.querySelector("#tobechanged")

function renderQuestions(event) {
    console.log(textChangeField);
    textChangeField.innerHTML = "<p>Round one<p/><p>what is an array</p>";   
}

console.log(quizJson);
var quiz = quizJson;
let results_length = quiz.results.length;
for(let i = 0; i < results_length; i++) {
    console.log(quiz.results[i].question, quiz.results[i].correct_answer);
    
    for (let c = 0; c < 3; c++) {
        const incorrect_answers = quiz.results[i].incorrect_answers;
        console.log(`incorrect answer: ${incorrect_answers[c]}`);
    }
}
// console.log(quiz.results);
startBtn.addEventListener('click', renderQuestions);

// startBtn.onkeypress = function(){myScript};
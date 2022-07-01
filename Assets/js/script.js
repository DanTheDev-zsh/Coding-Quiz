import quiz from './api.json' assert {type: 'json'};

let startBtn = document.querySelector("#start-button");
let submitBtn = document.querySelector("#submitBtn");
let input_Field = document.querySelector("#initial-Field");
let prompt_Message = document.querySelector("#prompt");
let curr_Node = startBtn;
let containers = [];
let question_Els = [];
let choices_Els = []; // 2D array of each questions' answers
let rand_correct_ans_Positions = [];
let goodAns = [];
let badAns = [];
let num_Quizes = quiz.results.length;
let max_GameTime = 60; 
let wrong_Penalty = 5000;
let interval_Msec = 1000;
let dur = moment.duration(max_GameTime*interval_Msec, 'milliseconds');
let final_Time = 0;
let my_Timer;
let good_Counter = 0;
let bad_Counter = 0;
let curr_quiz_Index = 0;



function renderGame(event) {
    event.preventDefault();
    // creates a timer element
    let timer_El = document.createElement('span');
    timer_El.setAttribute('id','timer');

    startBtn.after(timer_El);
    startBtn.style.display='none';
    prompt_Message.style.display='none';
    document.querySelector('#timer').innerHTML = `seconds left: ${max_GameTime}`;
    renderQuestions();
    my_Timer = setInterval(() => {
        dur = moment.duration(dur - interval_Msec, 'milliseconds');
        console.log(dur,dur.seconds());
        document.querySelector('#timer').innerHTML = `seconds left: ${dur._milliseconds/1000}`;
        if(dur.seconds() < 1) {
            document.querySelector('#timer').innerHTML = `seconds left: 0`;
            final_Time = 1;
            postgameMenu();
            hideCurrSlide();
        }
    }, interval_Msec)
}

function renderQuestions() {

    for(let index = 0; index < num_Quizes; index++) {
        // stores position of each correct answer
        rand_correct_ans_Positions[index] = Math.floor(Math.random() * 4) + 1; 

        containers[index] = document.createElement('div');
        Object.entries({
            id: `container_${index + 1}`,
            class: 'hidden-default question_container'
        }).forEach(([k, v]) => {
            containers[index].setAttribute(k, v);
        });

        console.log(`the question is ${quiz.results[index].question}`); // debug

        question_Els[index] = document.createElement('p');
        Object.entries({
            id: `question_${index + 1}`,
            class: 'question'
        }).forEach(([k, v]) => {
            question_Els[index].setAttribute(k, v);
            question_Els[index].innerHTML = quiz.results[index].question;
        });

        choices_Els[index] = []; // declare that each choices have an inner array
        // loop over the 3 wrong choices and insert it into choices_Els[index][]
        for(let choices_index = 0; choices_index < 3; choices_index++) {
            console.log(`wrong choices are ${quiz.results[index].incorrect_answers[choices_index]}`); // debug

            choices_Els[index][choices_index] = document.createElement('button');
            Object.entries({
                type: 'button',
                class: 'bad_answer'
            }).forEach(([k, v]) => {
                choices_Els[index][choices_index].setAttribute(k, v);
                choices_Els[index][choices_index].innerHTML = quiz.results[index].incorrect_answers[choices_index];
            });

            console.log("they are "+choices_Els[index][choices_index]); // debug
        }

        // creates a correct button
        let correct_Btn = document.createElement('button');
        Object.entries({
            type: 'button',
            class: 'good_answer'
        }).forEach(([k, v]) => {
            correct_Btn.setAttribute(k, v);
            correct_Btn.innerHTML = quiz.results[index].correct_answer;
        });



        console.log(`rand correct right choice is at ${rand_correct_ans_Positions[index]}`);  // debug
        for(let j = 0; j < choices_Els[index].length; j++) {  // debug
            console.log(`j = ${j}, ${choices_Els[index][j]}`); // debug
        } // debug

        // insert correct button into 
        choices_Els[index].splice(rand_correct_ans_Positions[index], 0, correct_Btn);


        // console.log(`i = ${choices_index}, ${choices_Els[index][choices_index]}`); //debug
    
        // console.log(`the ${choices_Els[index].length} choices are: ${choices_Els[index]}`); // debug
        for(let i = 0; i < choices_Els[index].length; i++) {  // debug
            console.log(`i = ${i}, ${choices_Els[index][i]}, ${choices_Els[index][i]}`); // debug
        } // debug
        console.log(`=================BIG+DIVIDER=================`); // degub



        let container_div = document.createElement('div');
        
        // package them together
        containers[index].appendChild(question_Els[index]);
        for (let i = 0; i < choices_Els[index].length; i++) {
            container_div.appendChild(choices_Els[index][i]);
        }
        container_div.setAttribute('class','choice-container');
        containers[index].appendChild(container_div);
        
        console.log('here');
        curr_Node.after(containers[index]); // insert after current Node
        // if(index !== num_Quizes) { // check if we traverse to the last node
        curr_Node = containers[index]; // current Node is now the after(next) node
        // }
    }

    goodAns = document.querySelectorAll(".good_answer");
    badAns = document.querySelectorAll(".bad_answer");

    for (let i = 0; i < goodAns.length; i++) {
        goodAns[i].addEventListener('click', goodNext);
    }

    for (let i = 0; i < badAns.length; i++) {
        badAns[i].addEventListener('click', badNext);
    }
    console.log("button array: " + goodAns);
    goodAns.forEach((btn) => {console.log("this button"+btn)})
    nextSlide();
}

function nextSlide() {
    document.getElementById(`container_${curr_quiz_Index+1}`).
        classList.replace('hidden-default','show'); // show container current
}

function hideCurrSlide() {
    document.getElementById(`container_${curr_quiz_Index+1}`).
        classList.replace('show','hidden-default'); // hide container current
}

function goodNext() {
    good_Counter++;
    console.log(`correct count: ${good_Counter}`); // debug
    hideCurrSlide()
    curr_quiz_Index++;
    if(curr_quiz_Index === num_Quizes) {
        postgameMenu()
    } else{
        nextSlide()
    }
}

function badNext() {
    bad_Counter++;
    console.log(`incorrect count: ${bad_Counter}`); // debug
    hideCurrSlide();
    curr_quiz_Index++;
    dur = moment.duration(dur - wrong_Penalty, 'milliseconds');
    if(curr_quiz_Index === num_Quizes) {
        postgameMenu()
    } else{
        nextSlide();
    }
}

function postgameMenu() {
    final_Time = dur.seconds()
    clearInterval(my_Timer);
    let pg_RightEl = document.createElement('p');
    Object.entries({
        id: 'right-counter',
        display: 'block'
    }).forEach(([k, v]) => {
        pg_RightEl.setAttribute(k, v);
        pg_RightEl.innerHTML = `Total number of correct answers: ${good_Counter}`;
    });
    
    let pg_WrongEl = document.createElement('p');
    Object.entries({
        id: 'wrong-counter',
        display: 'block'
    }).forEach(([k, v]) => {
        pg_WrongEl.setAttribute(k, v);
        pg_WrongEl.innerHTML = `Total number of wrong answers: ${bad_Counter}`;
    });

    let final_Score = document.createElement('p');
    Object.entries({
        id: 'final-score',
        display: 'block'
    }).forEach(([k, v]) => {
        final_Score.setAttribute(k, v);
        final_Score.innerHTML = `Final Score: ${calcScore()}`;
    });

    curr_Node.after(pg_RightEl, pg_WrongEl, final_Score);
    input_Field.style.display = 'block';
    submitBtn.style.display = 'block';

}

function calcScore() {
    if(final_Time < 1) {
        final_Time = 1;
    }

    return Math.floor(100*(final_Time * good_Counter)/num_Quizes);
}

function submitHandler() {
    localStorage.setItem('initials',`${document.getElementById('initial-Field').value}`);
    localStorage.setItem('score', `${calcScore()}`);
    alert("saved with name:" + document.getElementById('initial-Field').value + "and score: " + calcScore());
    document.querySelector('#initial-Field').value = "";
}

startBtn.addEventListener('click', renderGame);
submitBtn.addEventListener('click', submitHandler);

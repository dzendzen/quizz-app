const question = document.getElementById("question");
const choices = [...document.querySelectorAll(".choice-text")];
console.log(choices);
// const questionCounterText = document.getElementById("questionCounter");
const progressText = document.getElementById("progressText");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const scoreText = document.getElementById("score");

let currentQuesion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

// let url="https://api.fungenerators.com";(id,question,categorie,answer)
let url = "https://opentdb.com/api.php?amount=50&category=9";

fetch(url)
  .then((res) => {
    console.log(res);
    return res.json();
  })
  .then((loadedQuestions) => {
    console.log(loadedQuestions.results);
    // iterate through array(map) to transform it
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer,
      );
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });
      return formattedQuestion;
      console.log(formattedQuestion);
    });
    // questions = loadedQuestions;

    startGame();
  })
  .catch((err) => {
    console.error(err);
    alert("error");
  });

const CORRECT_BONUS = 5;
const MAX_QUESTIONS = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  //get a full copy of questions
  availableQuestions = [...questions];
  //   console.log(availableQuestions);
  getNewQuestions();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestions = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    // go to the end page
    return window.location.assign("/end.html");
  }
  questionCounter++;
  //   questionCounterText.innerText = ` ${questionCounter}/${MAX_QUESTIONS}`;
  progressText.innerText = `Question${questionCounter}/${MAX_QUESTIONS}`;
  //   update progress bar
  // console.log((questionCounter / MAX_QUESTIONS) * 100);
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // get random question
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuesion = availableQuestions[questionIndex];
  question.innerText = currentQuesion.question;

  //   grab each choice and get ref to data-number
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    // console.log(choice.dataset[number]);
    choice.innerText = currentQuesion["choice" + number];
  });
  //   then get rid of the question we have just used with : splice()
  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

// attach event listener to each choice
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    // console.log(e.target);
    // delay possibility to answer
    if (!acceptingAnswers) return;
    // check if answer correct
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    // apply style to answer correct/incorrect
    // console.log(selectedAnswer == currentQuesion.answer);
    const classToApply =
      selectedAnswer == currentQuesion.answer ? "correct" : "incorrect";
    //   get score if correct
    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    // ******TO DO******
    //
    // alert the correct_answer
    //
    // if (classToApply === "incorrect") {
    //   // alert(`The correct answer is : ${}`);
    //   console.log("incorrect");
    // }
    // delay before removing classToApply
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);

      // console.log(selectedAnswer);
      getNewQuestions();
    }, 1000);
  });
});

incrementScore = (num) => {
  score += num;
  score.innerText = score;
};
// sessionStorage.clear();

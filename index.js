const start = document.querySelector(".startBtn"),
  startScreen = document.querySelector(".start-screen"),
  questionSection = document.querySelector(".question-section"),
  category = document.querySelector(".form-control"),
  difficulty = document.querySelector(".difficulty"),
  type = document.querySelector(".type-selection"),
  questionNumber = document.querySelector(".question-number"),
  question = document.querySelector(".question"),
  answers = document.querySelectorAll(".answer"),
  thequestionnumber = document.querySelector(".js-question-number"),
  scorescreen = document.querySelector(".score-section"),
  scoreText = document.querySelector(".scoreText");

let categoryValue;
let difficultyValue;
let selectTypeValue;
let totalQuestion;
let results;
let i = 0;
let score = 0;

start.addEventListener("click", () => {
  startScreen.style.display = "none";
  questionSection.style.display = "flex";
  categoryValue = category.value;
  if (category.value === "any") {
    let randomNumber = Math.floor(Math.random() * (32 - 9 + 1)) + 9;
    categoryValue = randomNumber;
  }

  if (difficulty.value === "any") {
    randomNumber = Math.floor(Math.random() * 3) + 1;
    randomNumber == "1" ? (difficulty.value = "easy") : CloseEvent;
    randomNumber == "2" ? (difficulty.value = "medium") : CloseEvent;
    randomNumber == "3" ? (difficulty.value = "hard") : CloseEvent;
  }
  difficultyValue = difficulty.value;
  if (type.value === "any") {
    randomNumber = Math.floor(Math.random() * 2) + 1;
    randomNumber == "1" ? (type.value = "multiple") : CloseEvent;
    randomNumber == "2" ? (type.value = "boolean") : CloseEvent;
  }
  selectTypeValue = type.value;
  totalQuestion = questionNumber.value;

  url = `https://opentdb.com/api.php?amount=${totalQuestion}&category=${categoryValue}&difficulty=${difficultyValue}&type=${selectTypeValue}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      results = data;
      startQuiz();
      Timer();
      if (data.response_code !== 0) {
        questionSection.style.display = "none";
        document.querySelector(".error-screen").style.display = "block";
      }
    });
});

async function startQuiz() {
  thequestionnumber.innerText = i + 1;
  if (type.value == "boolean") {
    document.querySelector(".third").style.display = "none";
    document.querySelector(".fourth").style.display = "none";
  }
  resultsArray = results.results[i];
  question.innerHTML = resultsArray.question;

  const correctAnswer = resultsArray.correct_answer;
  const incorrectAnswers = resultsArray.incorrect_answers;
  const allAnswers = [...incorrectAnswers, correctAnswer];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const shuffledAnswers = shuffle(allAnswers);

  shuffledAnswers.forEach((answer, index) => {
    const p = document.querySelector(`.js-option${index + 1}`);
    p.innerHTML = answer;
  });
}

function nextQuestion() {
  if (i === results.results.length + 1) return;
  clearInterval(countdown);
  Timer();
  removeSelection();
  i++;
  selectedAnswer();
  answerConfirmation();
  startQuiz();
}

function removeSelection() {
  answers.forEach((button) => {
    button.classList.remove("selection");
  });
}

let answer = [""];
function selectedAnswer() {
  if (answer[0] == resultsArray.correct_answer) {
    score++;
  }
}
answers.forEach((button, idx) => {
  button.addEventListener("click", () => {
    answers.forEach((btn) => btn.classList.remove("selection"));
    button.classList.add("selection");
    const p = document.querySelector(`.js-option${idx + 1}`);
    if (answer.length === "") {
      answer.push(p.textContent);
    } else {
      answer.length = 0;
      answer.push(p.textContent);
    }
  });
});

function answerConfirmation() {
  resultsArray = results.results[i];

  if (i == results.results.length) {
    questionSection.style.display = "none";
    scorescreen.style.display = "block";
    scoreText.innerText = `Your scored ${score} out of ${totalQuestion}`;
  }
}

document.querySelector(".playAgain").addEventListener("click", () => {
  location.reload();
});
document.querySelector(".try-again").addEventListener("click", () => {
  location.reload();
});
let countdown;
function Timer() {
  const totalTime = 15;
  let timeLeft = totalTime;

  const timerBar = document.querySelector(".timer-bar");

  countdown = setInterval(() => {
    timeLeft--;
    const percent = (timeLeft / totalTime) * 100;
    timerBar.style.width = percent + "%";

    if (timeLeft == -1) {
      clearInterval(countdown);
      nextQuestion();
    }
  }, 1000);
}

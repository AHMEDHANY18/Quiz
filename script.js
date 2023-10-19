const questions = [
  {
    question: "In Islam, the supreme central focus and authority is",
    answers: [
      { text: "Allah", correct: true },
      { text: "Caliph", correct: false },
      { text: "Muhammad", correct: false },
      { text: "Imam", correct: false }
    ]
  },
  {
    question: "What is not one of the five pillars of Islam?",
    answers: [
      { text: "Pray five times daily", correct: false },
      { text: "Profess Allah as the only God", correct: false },
      { text: "Make a pilgrimage to Mecca", correct: false },
      { text: "Read the Quran every day", correct: true }
    ]
  },
  {
    question: "What is the prayer (or religious) leader in a mosque called?",
    answers: [
      { text: "Shaykh", correct: false },
      { text: "Caliph", correct: false },
      { text: "Imam", correct: true },
      { text: "Mufti", correct: false }
    ]
  },
  {
    question: "What is something that is lawful and permitted in Islam called?",
    answers: [
      { text: "Hajj", correct: false },
      { text: "Halal", correct: true },
      { text: "Kosher", correct: false },
      { text: "Jihad", correct: false }
    ]
  },
  {
    question: "The Qur’an acknowledges which prophet(s) from Judaism and Christianity?",
    answers: [
      { text: "Abraham", correct: false },
      { text: "Adam", correct: false },
      { text: "Jesus", correct: false },
      { text: "All of these", correct: true }
    ]
  },
  {
    question: "What is the most populous Muslim country in the world?",
    answers: [
      { text: "Saudi Arabia", correct: false },
      { text: "Indonesia", correct: true },
      { text: "Pakistan", correct: false },
      { text: "Iraq", correct: false }
    ]
  },
  {
    question: "The word “Islam” means",
    answers: [
      { text: "Those who follow Muhammad", correct: false },
      { text: "Surrender to God", correct: true },
      { text: "Recitations", correct: false },
      { text: "Sons of Allah", correct: false }
    ]
  },
  {
    question: "What is the Shari’ah?",
    answers: [
      { text: "A religious school", correct: false },
      { text: "A native dance", correct: false },
      { text: "A style of calligraphy", correct: false },
      { text: "A form of Muslim law", correct: true }
    ]
  }
];

const questionElement = document.getElementById("question");
const answerBtn = document.getElementById("answer-btn");
const next = document.getElementById("next");
const examTimerElement = document.getElementById("exam-time-left");
const questionTimerElement = document.getElementById("question-time-left");

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let quizResults = JSON.parse(localStorage.getItem("quizResults")) || [];

let examTimeLeft = 280; // 30 minutes in seconds

let timerInterval;

function startExamTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(updateExamTimer, 1000);
}

function updateExamTimer() {
  examTimeLeft--;
  if (examTimeLeft < 0) {
    clearInterval(timerInterval);
    showScore();
  }
  displayTime(examTimeLeft, examTimerElement);
}

function startQuestionTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(updateQuestionTimer, 1000);
}

function updateQuestionTimer() {
  if (questionTimeLeft < 0) {
    clearInterval(timerInterval);
    handleNext();
  }
  displayTime(questionTimeLeft, questionTimerElement);
}

function displayTime(seconds, timerElement) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timerElement.textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  next.innerHTML = "Next";
  showQuestion();
  startExamTimer();
}

function showQuestion() {
  resetState();
  let currentQuestionObj = questions[currentQuestion];
  let questionNo = currentQuestion + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestionObj.question;
  currentQuestionObj.answers.forEach((answer) => {
    let btn = document.createElement("button");
    btn.innerHTML = answer.text;
    btn.classList.add("btn");
    answerBtn.appendChild(btn);
    if (answer.correct) {
      btn.dataset.correct = answer.correct;
    }
    btn.addEventListener("click", selectAnswer);
  });
  startQuestionTimer();
}

function resetState() {
  next.style.display = "none";
  while (answerBtn.firstChild) {
    answerBtn.removeChild(answerBtn.firstChild);
  }
}

function selectAnswer(event) {
  const selectedBtn = event.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  userAnswers.push(isCorrect);
  Array.from(answerBtn.children).forEach((btn) => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
  });
  next.style.display = "block";
}

function showScore() {
  resetState();
  const percentage = (score / questions.length) * 100;
  let message = '';

  if (percentage > 99) {
    message = 'Perfect! You got all answers correct.';
  } else if (percentage > 49) {
    message = 'Good';
  } else {
    message = 'Try again';
  }

  questionElement.innerHTML = `Your score is ${score} out of ${questions.length} (${percentage.toFixed(2)}%) - ${message}`;
  next.innerHTML = "Again";
  next.style.display = "block";
  quizResults.push({ score, userAnswers });
  localStorage.setItem("quizResults", JSON.stringify(quizResults));

  if (percentage < 100) {
    displayCorrectAnswers();
  }
}

function handleNext() {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

next.addEventListener("click", () => {
  if (currentQuestion < questions.length) {
    handleNext();
  } else {
    startQuiz();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  const container = document.querySelector(".container");

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    container.classList.toggle("dark-mode");
  });
});

function displayCorrectAnswers() {
  const correctAnswersDiv = document.getElementById("correct-answers");
  correctAnswersDiv.innerHTML = "<h2>Correct Answers</h2>";

  for (let i = 0; i < questions.length; i++) {
    const questionObj = questions[i];
    correctAnswersDiv.innerHTML += `<p><strong>Q${i + 1}:</strong> ${questionObj.question}</p>`;
    correctAnswersDiv.innerHTML += "<ul>";

    for (let j = 0; j < questionObj.answers.length; j++) {
      if (questionObj.answers[j].correct) {
        correctAnswersDiv.innerHTML += `<li>${questionObj.answers[j].text}</li>`;
      }
    }

    correctAnswersDiv.innerHTML += "</ul>";
  }
}

startQuiz();

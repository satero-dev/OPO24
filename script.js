const ques = document.getElementById("ques");
const opt = document.getElementById("opt");
const progress = document.getElementById("progress");
const timer = document.getElementById("timer");

let currQuestion = 0;
let score = 0;
let selectedQuestions = [];
let timeElapsed = 0;
let quizInterval;
let totalQuestions = 10; // Default value

function startQuiz() {
  // Obtenemos el número de preguntas
  totalQuestions = parseInt(document.getElementById("numQuestions").value);
  selectedQuestions = shuffleQuestions(Questions).slice(0, totalQuestions);
  document.getElementById("setup").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  // Iniciamos el temporizador
  timeElapsed = 0;
  quizInterval = setInterval(updateTimer, 1000);
  loadQues();
  updateProgress();
}

function shuffleQuestions(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadQues() {
  const currentQuestion = selectedQuestions[currQuestion];
  ques.innerText = currentQuestion.question;
  opt.innerHTML = "";

  const options = [
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ];
  options.sort(() => Math.random() - 0.5);

  options.forEach((option) => {
    const choicesdiv = document.createElement("div");
    const choice = document.createElement("input");
    const choiceLabel = document.createElement("label");

    choice.type = "radio";
    choice.name = "answer";
    choice.value = option;
    choice.checked = selectedQuestions[currQuestion].selectedAnswer === option;

    choiceLabel.textContent = option;
    choiceLabel.prepend(choice);

    choice.onclick = () =>
      (selectedQuestions[currQuestion].selectedAnswer = option);

    choicesdiv.appendChild(choiceLabel);
    opt.appendChild(choicesdiv);
  });
  updateProgress();
  updateNavButtons();
}

function nextQuestion() {
  if (currQuestion < selectedQuestions.length - 1) {
    currQuestion++;
    loadQues();
  } else {
    endQuiz();
  }
}

function prevQuestion() {
  if (currQuestion > 0) {
    currQuestion--;
    loadQues();
  }
}

function endQuiz() {
  clearInterval(quizInterval);
  document.getElementById("opt").remove();
  document.getElementById("ques").remove();
  document.getElementById("nextBtn").remove();
  document.getElementById("prevBtn").remove();
  document.getElementById("timer").remove();
  calculateScore();
  document.getElementById(
    "score"
  ).textContent = `Puntuación: ${score} de ${totalQuestions}`;
}

function calculateScore() {
  score = selectedQuestions.filter(
    (q) => q.selectedAnswer === q.correct_answer
  ).length;
}

function updateProgress() {
  progress.textContent = `Progreso: ${currQuestion + 1} / ${totalQuestions}`;
}

function updateTimer() {
  timeElapsed++;
  const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, "0");
  const seconds = String(timeElapsed % 60).padStart(2, "0");
  timer.textContent = `Tiempo: ${minutes}:${seconds}`;
}

function updateNavButtons() {
  document.getElementById("prevBtn").style.display =
    currQuestion > 0 ? "inline-block" : "none";
  document.getElementById("nextBtn").textContent =
    currQuestion < selectedQuestions.length - 1 ? "Siguiente" : "Finalizar";
}

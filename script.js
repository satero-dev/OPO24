const mainTitle = document.getElementById("mainTitle");
const ques = document.getElementById("ques");
const opt = document.getElementById("opt");
const progress = document.getElementById("progress");
const timer = document.getElementById("timer");

let currQuestion = 0;
let score = 0;
let selectedQuestions = [];
let totalQuestions = 10;
let timeElapsed = 0;
let quizInterval;

function startQuiz() {
  const theme = getSelectedTheme();
  totalQuestions = parseInt(document.getElementById("numQuestions").value);

  // Cambiar el título principal al nombre del tema seleccionado
  mainTitle.textContent = getThemeName(theme);

  // Filtrar preguntas por tema
  const filteredQuestions =
    theme && theme !== "allThemes"
      ? Questions.filter((q) => q.category === theme)
      : Questions;

  selectedQuestions = shuffleQuestions(filteredQuestions).slice(
    0,
    totalQuestions
  );
  document.getElementById("setup").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  // Iniciar temporizador
  timeElapsed = 0;
  quizInterval = setInterval(updateTimer, 1000);
  loadQues();
  updateProgress();
}

function getSelectedTheme() {
  const selectedRadio = document.querySelector('input[name="tema"]:checked');
  return selectedRadio ? selectedRadio.value : null;
}

function getThemeName(theme) {
  switch (theme) {
    case "Tema 1":
      return "Marc Constitucional i Estatutari";
    case "Tema 2":
      return "El Sistema Sanitari Català";
    case "Tema 3":
      return "El Consorci Corporació Sanitària Parc Taulí";
    case "Tema 4":
      return "Confidencialitat i Protecció de Dades";
    case "Tema 5":
      return "Normativa de Prevenció de Riscos Laborals";
    case "allThemes":
      return "Tots els temes";
    default:
      return "Test Oposicions 2024";
  }
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
  ques.style.backgroundColor = ""; // Reset background color
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

    choiceLabel.textContent = option;
    choiceLabel.prepend(choice);

    choicesdiv.appendChild(choiceLabel);
    opt.appendChild(choicesdiv);
  });

  document.getElementById("confirmBtn").style.display = "inline-block";
  document.getElementById("nextBtn").style.display = "none";
  updateProgress();
}

function checkAnswer() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');
  const currentQuestion = selectedQuestions[currQuestion];

  if (!selectedAnswer) return;

  const isCorrect = selectedAnswer.value === currentQuestion.correct_answer;

  // Mostrar respuesta correcta en verde y la incorrecta seleccionada en rojo
  const options = opt.querySelectorAll("label");
  options.forEach((option) => {
    if (option.innerText === currentQuestion.correct_answer) {
      option.style.backgroundColor = "lightgreen";
    } else if (selectedAnswer.value === option.innerText) {
      option.style.backgroundColor = "lightcoral";
    }
  });

  // Contabilizar puntaje si es correcta
  if (isCorrect) score++;

  // Mostrar botón siguiente
  document.getElementById("confirmBtn").style.display = "none";
  document.getElementById("nextBtn").style.display = "inline-block";
}

function nextQuestion() {
  if (currQuestion < selectedQuestions.length - 1) {
    currQuestion++;
    loadQues();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearInterval(quizInterval);
  document.getElementById("opt").remove();
  document.getElementById("ques").remove();
  document.getElementById("confirmBtn").remove();
  document.getElementById("nextBtn").remove();
  document.getElementById("timer").remove();
  document.getElementById(
    "score"
  ).textContent = `Puntuació: ${score} de ${totalQuestions}`;
}

function updateProgress() {
  progress.textContent = `Progrés: ${currQuestion + 1} / ${totalQuestions}`;
}

function updateTimer() {
  timeElapsed++;
  const minutes = String(Math.floor(timeElapsed / 60)).padStart(2, "0");
  const seconds = String(timeElapsed % 60).padStart(2, "0");
  timer.textContent = `Temps: ${minutes}:${seconds}`;
}

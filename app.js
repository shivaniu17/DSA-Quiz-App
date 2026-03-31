const languages = {
  cpp: [
    { q: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Tree", "Graph"], correct: 1 },
    { q: "Which sorting algorithm is best on average?", options: ["Bubble", "Merge", "Quick", "Selection"], correct: 2 },
    { q: "Which STL container stores unique elements?", options: ["vector", "set", "list", "map"], correct: 1 },
    { q: "What is the time complexity of binary search?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 1 },
    { q: "Which hashing container supports insertion order in C++?", options: ["unordered_map", "map", "unordered_set", "none"], correct: 3 },
    { q: "A red-black tree is a type of what?", options: ["Graph", "LinkedList", "Self-balancing BST", "Heap"], correct: 2 },
  ],
  java: [
    { q: "Which collection in Java allows key-value pairs?", options: ["List", "Set", "Map", "Stack"], correct: 2 },
    { q: "DSA in Java is based on?", options: ["C", "C++", "JVM", "Machine code"], correct: 2 },
    { q: "Which DS is used in recursion?", options: ["Queue", "Stack", "Array", "Tree"], correct: 1 },
    { q: "Which keyword ensures a block executes only once?", options: ["final", "static", "synchronized", "volatile"], correct: 2 },
    { q: "What does JVM stand for?", options: ["Java Variable Model", "Java Visual Machine", "Java Virtual Machine", "Java Value Method"], correct: 2 },
    { q: "ArrayList in Java with default capacity 10 is backed by?", options: ["LinkedList", "Array", "Vector", "Tree"], correct: 1 },
  ],
  python: [
    { q: "Which DS uses FIFO?", options: ["Stack", "Queue", "List", "Dict"], correct: 1 },
    { q: "What is the time complexity of accessing an element in a list?", options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"], correct: 0 },
    { q: "Which DS is used for mapping?", options: ["List", "Set", "Dict", "Tuple"], correct: 2 },
    { q: "What is the output of 'len([1,2,3])'?", options: ["2", "3", "1", "0"], correct: 1 },
    { q: "Which keyword creates a generator?", options: ["return", "yield", "lambda", "def"], correct: 1 },
    { q: "What does PEP stand for?", options: ["Python Enhancement Proposal", "Python Enforce Policy", "Program Execution Path", "Python Example Page"], correct: 0 },
  ],
};

let selectedLang = null;
let questions = [];
let currentIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 15;

const languageScreen = document.getElementById("language-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const restartBtn = document.getElementById("restart-btn");
const timeEl = document.getElementById("time");
const progressText = document.getElementById("progress-text");
const feedbackEl = document.getElementById("feedback");

document.querySelectorAll(".lang-btn").forEach(function(btn) {
  btn.addEventListener("click", function() {
    selectedLang = this.dataset.lang;
    startQuiz();
  });
});

function startQuiz() {
  languageScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  questions = languages[selectedLang].slice().sort(function(){ return Math.random() - 0.5; });
  currentIndex = 0;
  score = 0;
  timeLeft = 15;

  feedbackEl.classList.add("hidden");

  updateScore();
  showQuestion();
}

function showQuestion() {
  clearInterval(timerInterval);
  timeLeft = 15;
  startTimer();

  var q = questions[currentIndex];
  questionEl.textContent = (currentIndex + 1) + '. ' + q.q;
  answersEl.innerHTML = '';

  q.options.forEach(function(opt, i) {
    var btn = document.createElement("button");
    btn.textContent = opt;
    btn.addEventListener("click", function() { selectAnswer(i); });
    answersEl.appendChild(btn);
  });

  nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
  nextBtn.disabled = true;
  feedbackEl.classList.add("hidden");
  prevBtn.classList.toggle("hidden", currentIndex === 0);
  updateProgress();
}

function selectAnswer(selected) {
  var q = questions[currentIndex];
  var buttons = answersEl.querySelectorAll("button");

  buttons.forEach(function(btn, i) {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    else if (i === selected) btn.classList.add("wrong");
  });

  if (selected === q.correct) {
    score++;
    feedbackEl.textContent = '✅ Correct!';
    feedbackEl.style.color = '#28a745';
  } else {
    feedbackEl.textContent = '❌ Wrong! Correct: ' + q.options[q.correct];
    feedbackEl.style.color = '#dc3545';
  }

  feedbackEl.classList.remove("hidden");
  nextBtn.disabled = false;
  updateScore();
  clearInterval(timerInterval);
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion();
  } else {
    showResult();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion();
  }
}

function startTimer() {
  timeEl.textContent = timeLeft;
  timerInterval = setInterval(function() {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      var q = questions[currentIndex];
      var buttons = answersEl.querySelectorAll("button");
      buttons.forEach(function(btn, i) {
        btn.disabled = true;
        if (i === q.correct) btn.classList.add("correct");
      });
      feedbackEl.classList.remove("hidden");
      feedbackEl.textContent = '⌛ Time\'s up! Correct answer: ' + q.options[q.correct];
      feedbackEl.style.color = '#ff4757';
      nextBtn.disabled = false;
    }
  }, 1000);
}

function updateProgress() {
  progressText.textContent = 'Question ' + (currentIndex + 1) + ' of ' + questions.length;
}

function updateScore() {
  if (scoreEl) scoreEl.textContent = score + ' / ' + questions.length;
}

function showResult() {
  clearInterval(timerInterval);
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  scoreEl.textContent = score + ' / ' + questions.length;
  var percent = (score / questions.length) * 100;

  if (percent === 100) feedbackEl.textContent = '🎉 Excellent! Perfect score!';
  else if (percent >= 70) feedbackEl.textContent = '👍 Great job!';
  else if (percent >= 40) feedbackEl.textContent = '🙂 Good effort, keep practicing!';
  else feedbackEl.textContent = '😅 You can do better. Try again!';

  feedbackEl.classList.remove("hidden");
}

function restartQuiz() {
  clearInterval(timerInterval);
  selectedLang = null;
  questions = [];
  currentIndex = 0;
  score = 0;
  languageScreen.classList.remove("hidden");
  quizScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
}

nextBtn.addEventListener("click", nextQuestion);
prevBtn.addEventListener("click", prevQuestion);
restartBtn.addEventListener("click", restartQuiz);
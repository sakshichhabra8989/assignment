const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const lettersEl = document.getElementById("letters");
const livesEl = document.getElementById("lives");
const messageEl = document.getElementById("message");
const resetBtn = document.getElementById("reset");

let currentQuestion = "";
let currentAnswer = "";
let displayAnswer = [];
let lives = 6;

// Fetch questions from API
async function fetchQuestion() {
  try {
    const res = await fetch("http://codeapi.net.cws18.my-hosting-panel.com/hangman.php");
    const data = await res.json();

    // Pick random question
    const random = data[Math.floor(Math.random() * data.length)];
    currentQuestion = random.Question;
    currentAnswer = random.Answer.toUpperCase();
    displayAnswer = Array.from(currentAnswer).map(ch => (ch === " " ? " " : "_"));

    renderGame();
  } catch (error) {
    questionEl.textContent = "Failed to load question!";
    console.error(error);
  }
}

// Render question, answer, and letters
function renderGame() {
  questionEl.textContent = currentQuestion;
  answerEl.textContent = displayAnswer.join(" ");
  livesEl.textContent = `Lives: ${lives}`;
  messageEl.textContent = "";

  // Generate letters A-Z
  lettersEl.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const btn = document.createElement("button");
    btn.textContent = String.fromCharCode(i);
    btn.classList.add("letter");
    btn.addEventListener("click", () => handleGuess(btn));
    lettersEl.appendChild(btn);
  }
}

// Handle letter click
function handleGuess(button) {
  const letter = button.textContent;
  button.disabled = true;

  if (currentAnswer.includes(letter)) {
    // Reveal correct letters
    for (let i = 0; i < currentAnswer.length; i++) {
      if (currentAnswer[i] === letter) {
        displayAnswer[i] = letter;
      }
    }
    answerEl.textContent = displayAnswer.join(" ");

    // Check win
    if (!displayAnswer.includes("_")) {
      messageEl.textContent = "🎉 You Won!";
      disableAllButtons();
    }
  } else {
    // Wrong guess
    lives--;
    livesEl.textContent = `Lives: ${lives}`;
    if (lives <= 0) {
      messageEl.textContent = `💀 Game Over! Answer was: ${currentAnswer}`;
      disableAllButtons();
    }
  }
}

// Disable all letter buttons
function disableAllButtons() {
  document.querySelectorAll(".letter").forEach(btn => btn.disabled = true);
}

// Reset game
function resetGame() {
  lives = 6;
  fetchQuestion();
}

// Event listeners
resetBtn.addEventListener("click", resetGame);

// Start game
fetchQuestion();

// Assuming questions.js is included before script.js in your index.html
var currentQuestionIndex = 0;
var time = questions.length * 10;
var timerId;

// DOM elements
var timerEl = document.getElementById("time");
var startBtn = document.getElementById("start-quiz-btn");
var quizBoxEl = document.querySelector(".quiz-box");

function startQuiz() {
  // Hide the start button
  startBtn.setAttribute("style", "display: none");

  // Start timer
  timerId = setInterval(clockTick, 1000);

  // Show first question
  showNextQuestion();
}

function showNextQuestion() {
  // Clear out any old question data
  quizBoxEl.innerHTML = "";

  // Update with current question
  var currentQuestion = questions[currentQuestionIndex];

  // Create question title element
  var questionTitleEl = document.createElement("h2");
  questionTitleEl.textContent = currentQuestion.title;
  quizBoxEl.appendChild(questionTitleEl);

  // Create container for question choices
  var choicesContainerEl = document.createElement("div");
  choicesContainerEl.setAttribute("class", "choices-container");

  // Choice labels corresponding to a), b), c), d)
  var choiceLabels = ["a", "b", "c", "d"];

  // Create choices buttons
  currentQuestion.choices.forEach(function (choice, i) {
    var choiceButton = document.createElement("button");
    choiceButton.setAttribute("class", "btn choice-btn");
    choiceButton.setAttribute("value", choice);
    // Prepend the choice label
    choiceButton.textContent = choiceLabels[i] + ") " + choice;
    choiceButton.onclick = questionClick;
    choicesContainerEl.appendChild(choiceButton);
  });

  quizBoxEl.appendChild(choicesContainerEl);
}

function questionClick() {
  var correct = questions[currentQuestionIndex].answer === this.value;
  if (!correct) {
    // Penalize time
    time -= 10;
    if (time < 0) {
      time = 0;
    }
    // Display new time on page
    timerEl.textContent = time;
    displayAnswerFeedback("Wrong!");
  } else {
    displayAnswerFeedback("Correct!");
  }

  // Move to next question
  currentQuestionIndex++;

  // Immediately end quiz if the time is zero or below after penalty
  if (time <= 0) {
    timerEl.textContent = "0";
    endQuiz();
    return; // Add this to exit the function
  }

  // Wait a bit before moving to the next question
  setTimeout(function () {
    if (currentQuestionIndex === questions.length) {
      endQuiz();
    } else {
      showNextQuestion();
    }
  }, 1000);
}

function displayAnswerFeedback(feedback) {
  // Remove any old feedback
  var oldFeedback = document.querySelector(".feedback");
  if (oldFeedback) {
    oldFeedback.remove();
  }

  // Display feedback
  var feedbackEl = document.createElement("div");
  feedbackEl.textContent = feedback;
  feedbackEl.setAttribute("class", "feedback");
  quizBoxEl.appendChild(feedbackEl);

  // Remove feedback after 1 second
  setTimeout(function () {
    feedbackEl.remove();
  }, 1000);
}

var quizEnded = false;
function endQuiz() {
  quizEnded = true;
  // Stop timer
  clearInterval(timerId);

  // Show end screen
  var endScreenEl = document.createElement("div");
  endScreenEl.setAttribute("class", "end-screen");

  // Show final score
  var finalScoreEl = document.createElement("h2");
  finalScoreEl.textContent = "Your final score is " + time + ".";
  finalScoreEl.style.marginBottom = "20px"; // Increase space below final score
  endScreenEl.appendChild(finalScoreEl);

  // Create form for names
  var namesFormEl = document.createElement("form");
  namesFormEl.setAttribute("id", "names-form");
  namesFormEl.innerHTML =
    "<div style='margin-top: 20px; margin-bottom: 15px;'>" + // Add margin to top and bottom
    "<label for='names' style='margin-right: 5px;'>Enter name:</label>" +
    "<input type='text' id='names' name='names' style='margin-right: 5px;'>" +
    "</div>" +
    "<button type='submit' class='btn'>Submit</button>";

  endScreenEl.appendChild(namesFormEl);

  // Append end screen
  quizBoxEl.innerHTML = "";
  quizBoxEl.appendChild(endScreenEl);

  // Add event listener for form submission
  var namesForm = document.getElementById("names-form");
  if (namesForm) {
    namesForm.addEventListener("submit", saveHighscore);
  } else {
    console.error("Form with ID 'names-form' not found.");
  }
}

function clockTick() {
  if (quizEnded) {
    return; // Stop the clock if the quiz has ended
  }
  // Update time
  time--;
  if (time < 0) {
    time = 0;
    clearInterval(timerId);
    timerEl.textContent = time;
    return; // Add this to stop the function if the time is less than 0
  }

  timerEl.textContent = time;

  // Check if user ran out of time
  if (time <= 0) {
    endQuiz();
  }
}

function saveHighscore(event) {
  event.preventDefault(); // Prevent default form submission behavior

  var namesEl = document.getElementById("names");
  var names = namesEl.value.trim();

  // Check if names contain only letters or hyphens, and not just a hyphen
  if (!/^[A-Za-z-]+$/.test(names) || names === "-") {
    alert("Name must contain only letters and hyphens (if necessary).");
    return;
  }

  // Replace multiple hyphens with a single one, if necessary
  names = names.replace(/-+/g, "-");

  // Split by hyphen, capitalise first letter of each part, and join back with hyphen
  names = names
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-");

  if (names !== "") {
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    var newScore = {
      initials: names,
      score: time,
    };

    // Save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // Redirect to highscores page
    window.location.href = "highscores.html";
  } else {
    // Prompt user for names again or give an error message
    alert("Please enter your name.");
  }
}

// User clicks button to start quiz
startBtn.onclick = startQuiz;

// User clicks button to submit names
// document.getElementById("names-form").addEventListener("submit", saveHighscore);

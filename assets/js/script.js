// Initialise the current question index, timer, and timer ID variables.
var currentQuestionIndex = 0;
var time = questions.length * 10; // Set initial time based on number of questions.
var timerId;

// DOM elements
var timerEl = document.getElementById("time"); // Timer display element.
var startBtn = document.getElementById("start-quiz-btn"); // Start quiz button.
var quizBoxEl = document.querySelector(".quiz-box"); // Container for quiz content.

// Function to start the quiz.
function startQuiz() {
  // Hide the start button to prevent re-starts during quiz.
  startBtn.setAttribute("style", "display: none");

  // Initialise the timer countdown.
  timerId = setInterval(clockTick, 1000);

  // Display the first question to the user.
  showNextQuestion();
}

// Function to show the next question.
function showNextQuestion() {
  // Remove previous question content.
  quizBoxEl.innerHTML = "";

  // Retrieve the current question from the array.
  var currentQuestion = questions[currentQuestionIndex];

  // Create and display the question title.
  var questionTitleEl = document.createElement("h2");
  questionTitleEl.textContent = currentQuestion.title;
  quizBoxEl.appendChild(questionTitleEl);

  // Container for the choice buttons.
  var choicesContainerEl = document.createElement("div");
  choicesContainerEl.setAttribute("class", "choices-container");

  // Choice labels (a, b, c, d) for display.
  var choiceLabels = ["a", "b", "c", "d"];

  // Generate and display choice buttons for the current question.
  currentQuestion.choices.forEach(function (choice, i) {
    var choiceButton = document.createElement("button");
    choiceButton.setAttribute("class", "btn choice-btn");
    choiceButton.setAttribute("value", choice);
    // Prepend the choice label
    choiceButton.textContent = choiceLabels[i] + ") " + choice;
    choiceButton.onclick = questionClick; // Attach click event handler for each choice.
    choicesContainerEl.appendChild(choiceButton);
  });

  // Append the choices container to the quiz box.
  quizBoxEl.appendChild(choicesContainerEl);
}

// Function to enable or disable choice buttons.
function setChoiceButtonsEnabled(enabled) {
  var choiceButtons = document.querySelectorAll(".choice-btn");
  for (var button of choiceButtons) {
    button.disabled = !enabled; // Disable or enable buttons based on the argument.
  }
}

// Event handler for clicking a question choice.
function questionClick() {
  // Disable all choice buttons after a choice is made
  setChoiceButtonsEnabled(false);

  // Check if the selected choice is correct.
  var correct = questions[currentQuestionIndex].answer === this.value;
  if (!correct) {
    // Penalise time for incorrect answer.
    time -= 10;
    if (time < 0) {
      time = 0;
    }
    // Update time display.
    timerEl.textContent = time;
    displayAnswerFeedback("Wrong!"); // Show feedback for wrong answer.
  } else {
    displayAnswerFeedback("Correct!"); // Show feedback for correct answer.
  }

  // Prepare for the next question.
  currentQuestionIndex++;

  // Immediately end quiz if the time is zero or below after penalty
  if (time <= 0) {
    // Check if time ran out and end quiz if so.
    timerEl.textContent = "0";
    endQuiz();
    return; // Add this to exit the function
  }

  // Delay before showing the next question.
  setTimeout(function () {
    if (currentQuestionIndex === questions.length) {
      // End quiz if no more questions.
      endQuiz();
    } else {
      // Otherwise, show the next question.
      showNextQuestion();
      // Re-enable buttons for the next question.
      setChoiceButtonsEnabled(true);
    }
  }, 1000);
}

// Function to display answer feedback ("Correct!" or "Wrong!").
function displayAnswerFeedback(feedback) {
  // Remove any old feedback
  var oldFeedback = document.querySelector(".feedback");
  if (oldFeedback) {
    oldFeedback.remove();
  }

  // Create and display new feedback element.
  var feedbackEl = document.createElement("div");
  feedbackEl.textContent = feedback;
  feedbackEl.setAttribute("class", "feedback");
  quizBoxEl.appendChild(feedbackEl);

  // Automatically remove feedback after 1 second.
  setTimeout(function () {
    feedbackEl.remove();
  }, 1000);
}

// Flag to indicate whether the quiz has ended.
var quizEnded = false;

// Function to end the quiz.
function endQuiz() {
  // Set quiz ended flag.
  quizEnded = true;
  // Stop timer
  clearInterval(timerId);

  // This block handles displaying the end screen and the user's final score.
  // First, create a div element that will serve as the end screen container.
  var endScreenEl = document.createElement("div");
  endScreenEl.setAttribute("class", "end-screen"); // Set its class for styling.

  // Create an h2 element to display the final score.
  var finalScoreEl = document.createElement("h2");
  finalScoreEl.textContent = "Your final score is " + time + "."; // Display the score dynamically using the 'time' variable.
  finalScoreEl.style.marginBottom = "20px"; // Add some spacing below the final score for better readability.
  endScreenEl.appendChild(finalScoreEl); // Append the score element to the end screen container.

  // Create a form element for user to enter initials. This form will be used to submit the highscore.
  var namesFormEl = document.createElement("form"); // Set an ID for easy retrieval and event handling.
  namesFormEl.setAttribute("id", "names-form");
  // Set the inner HTML of the form, including a label, an input for initials, and a submit button.
  namesFormEl.innerHTML =
    "<div style='margin-top: 20px; margin-bottom: 15px;'>" + // Style the div to add spacing around the input field.
    "<label for='names' style='margin-right: 5px;'>Enter initials:</label>" + // Label for accessibility.
    "<input type='text' id='names' name='names' style='margin-right: 5px;'>" + // Input field for the initials.
    "</div>" +
    "<button type='submit' class='btn'>Submit</button>"; // Submit button to submit the form.

  // Append the form to the end screen container.
  endScreenEl.appendChild(namesFormEl);

  // Clear the quiz box and append the end screen container to it.
  quizBoxEl.innerHTML = "";
  quizBoxEl.appendChild(endScreenEl);

  // Add an event listener to the form for handling the submission.
  var namesForm = document.getElementById("names-form");
  if (namesForm) {
    // If the form exists, attach the event listener to handle form submission.
    namesForm.addEventListener("submit", saveHighscore);
  } else {
    // Log an error if the form wasn't found.
    console.error("Form with ID 'names-form' not found.");
  }
}

// Function to handle the ticking of the clock during the quiz.
function clockTick() {
  if (quizEnded) {
    return; // If the quiz has ended, stop the clock immediately.
  }
  // Decrement the time and update the display accordingly.
  time--;
  if (time < 0) {
    // Ensure time does not go below 0.
    time = 0;
    // Clear the timer to stop the countdown.
    clearInterval(timerId);
    // Update the display with the final time.
    timerEl.textContent = time;
    // Exit the function early if time has run out.
    return; // Add this to stop the function if the time is less than 0
  }

  // Regularly update the time display.
  timerEl.textContent = time;

  // End the quiz if time has run out.
  if (time <= 0) {
    endQuiz();
  }
}

// Function to handle the submission of the highscore form.
function saveHighscore(event) {
  // Prevent the form from submitting in the traditional manner, allowing for custom handling.
  event.preventDefault(); // Prevent default form submission behavior

  // Retrieve the input element for the initials.
  var namesEl = document.getElementById("names");
  // Trim whitespace from the input value to clean it up.
  var names = namesEl.value.trim();

  // Validate the input to ensure it contains only letters or hyphens, but not just a single hyphen.
  if (!/^[A-Za-z-]+$/.test(names) || names === "-") {
    // Show an error if validation fails.
    alert("Name must contain only letters and hyphens (if necessary).");
    // Exit the function to prevent further execution.
    return;
  }

  // Replace multiple consecutive hyphens with a single hyphen in the input.
  names = names.replace(/-+/g, "-");

  // Capitalise the first letter of each part of the name (split by hyphens) and join them back together.
  names = names
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("-");

  if (names !== "") {
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || []; // Retrieve existing highscores from local storage, or initialize an empty array if none exist.

    var newScore = {
      initials: names,
      score: time,
    }; // Create a new score object with the user's initials and score.

    // Add the new score to the array of highscores and save it back to local storage.
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

document.addEventListener("DOMContentLoaded", () => {
  const highscoresList = document.getElementById("highscores-list");
  const playAgainBtn = document.getElementById("play-again-btn");
  const clearHighscoresBtn = document.getElementById("clear-highscores-btn");

  // Function to load high scores from local storage
  function loadHighScores() {
    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    highscores.sort((a, b) => b.score - a.score); // Sort by score from high to low

    var highscoresList = document.getElementById("highscores-list");

    // Clear existing list
    highscoresList.innerHTML = "";

    // Create list items for each score
    highscores.forEach(function (score) {
      var listItem = document.createElement("li");
      listItem.textContent = score.initials + " - " + score.score;
      highscoresList.appendChild(listItem);
    });
  }

  // Call loadHighScores when the page loads
  document.addEventListener("DOMContentLoaded", loadHighScores);

  // Function to clear high scores from local storage
  function clearHighScores() {
    localStorage.removeItem("highscores");
    loadHighScores(); // Refresh the list
  }

  // Event listener for 'Play Again' button
  playAgainBtn.addEventListener("click", () => {
    window.location.href = "index.html"; // Redirect to the home page to start the quiz
  });

  // Event listener for 'Reset Highscores' button
  clearHighscoresBtn.addEventListener("click", clearHighScores);

  loadHighScores(); // Initial load of high scores
});

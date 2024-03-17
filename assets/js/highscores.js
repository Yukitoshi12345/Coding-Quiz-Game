document.addEventListener("DOMContentLoaded", () => {
  const highscoresList = document.getElementById("highscores-list");
  const clearHighscoresBtn = document.getElementById("clear-highscores-btn");

  function loadHighScores() {
    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    highscores.sort((a, b) => b.score - a.score);

    // Limit to top 10 high scores
    highscores = highscores.slice(0, 10);

    highscoresList.innerHTML = ""; // Clear existing list

    // Create list items for each score and apply formatting
    highscores.forEach(function (score, index) {
      var listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${score.initials} - ${score.score}`;
      listItem.style.padding = "10px";
      listItem.style.borderBottom = "1px solid #ccc"; // Separator line
      listItem.style.listStyleType = "none"; // Remove bullets

      // Alternate background colors for the list items
      if (index % 2 === 0) {
        listItem.style.backgroundColor = "rgba(211, 211, 211, 0.5)"; // Light grey for even indices
      } else {
        listItem.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; // White for odd indices
      }

      highscoresList.appendChild(listItem);
    });
  }

  function clearHighScores() {
    localStorage.removeItem("highscores");
    loadHighScores();
  }

  if (clearHighscoresBtn) {
    clearHighscoresBtn.addEventListener("click", clearHighScores);
  } else {
    console.error("Button with ID 'clear-highscores-btn' not found.");
  }

  loadHighScores();
});

// Listen for the DOMContentLoaded event to ensure the DOM is fully loaded before executing
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the list and button elements from the DOM
  const highscoresList = document.getElementById("highscores-list");
  const clearHighscoresBtn = document.getElementById("clear-highscores-btn");

  // Function to load and display the high scores from localStorage
  function loadHighScores() {
    // Retrieve highscores from localStorage or initialize as empty array if none found
    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    // Sort highscores in descending order based on score
    highscores.sort((a, b) => b.score - a.score);

    // Limit the displayed highscores to the top 10
    highscores = highscores.slice(0, 10);

    // Clear the existing list to prepare for updated list
    highscoresList.innerHTML = "";

    // Iterate over each score to create and style list items
    highscores.forEach(function (score, index) {
      var listItem = document.createElement("li");
      listItem.textContent = `${index + 1}. ${score.initials} - ${score.score}`;
      listItem.style.padding = "10px";
      listItem.style.borderBottom = "1px solid #ccc"; // Adds a separator line between items
      listItem.style.listStyleType = "none"; // Removes the default list item bullet

      // Style the list items with alternating background colors
      if (index % 2 === 0) {
        listItem.style.backgroundColor = "rgba(211, 211, 211, 0.5)"; // Light grey for even items
      } else {
        listItem.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; // White for odd indices
      }

      // Append each newly created listItem to the highscoresList element
      highscoresList.appendChild(listItem);
    });
  }

  // Function to clear the high scores from localStorage and reload the high scores display
  function clearHighScores() {
    localStorage.removeItem("highscores"); // Remove highscores data from localStorage
    loadHighScores(); // Reload the high scores display, which will now be empty
  }

  // Check if the clear highscores button exists, then attach the event listener for click events
  if (clearHighscoresBtn) {
    clearHighscoresBtn.addEventListener("click", clearHighScores);
  } else {
    // Log an error if the button was not found in the DOM
    console.error("Button with ID 'clear-highscores-btn' not found.");
  }

  // Initially load the high scores upon script execution
  loadHighScores();
});

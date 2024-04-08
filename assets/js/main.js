// DOM element selections for various parts of the game interface.
const rangePickerSection = document.querySelector("#rangePickerSection");
const rangeDisplay = document.querySelector("#rangeDisplay");
const generateDisplay = document.querySelector(".generate");
const scoreDisplay = document.querySelector("#scoreDisplay");
const attempsDisplay = document.querySelector("#attempsDisplay");
const gameSection = document.querySelector(".game");
const rangeInput = document.querySelector("#rangeInput");
const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("#resetBtn");

// Game configuration object storing initial settings and state.
const config = {
  range: 10, // Initial range (number of card pairs).
  attemps: 30, // Initial attempts allowed, based on the range.
  score: 0, // Player's current score.
  isStarted: false, // Flag to track if the game has started.
  selectedCards: [], // Array to track the currently selected card elements.
};

// Event listener for the range input change. Updates the display to show the selected range value.
rangeInput.addEventListener("change", function () {
  rangeDisplay.textContent = this.value;
});

// Event listener for the start button. Initializes the game settings based on the selected range and starts the game.
startBtn.addEventListener("click", () => {
  config.range = Number(rangeInput.value); // Update range from input.
  config.attemps = config.range * 3; // Calculate attempts based on range.
  config.isStarted = true; // Set game as started.
  config.selectedCards.splice(0); // Clear any selected cards.
  config.score = 0; // Reset score.
  scoreDisplay.textContent = 0; // Reset score display.
  startGame(); // Start the game.
});

// Event listener for the reset button. Resets the game to initial state.
resetBtn.addEventListener("click", () => {
  resetGame();
});

// Function to start the game. It prepares the game UI and initializes card elements.
function startGame() {
  toggleControls(); // Toggle visibility of game controls.
  initCards(); // Initialize cards for the game.
  rotateAllCards(); // Rotate all cards to reveal them temporarily.
}

// Function to toggle visibility of game section and range picker section based on game state.
function toggleControls() {
  gameSection.style.display = config.isStarted ? "block" : "none";
  rangePickerSection.style.display = config.isStarted ? "none" : "block";
}

// Function to initialize card elements. It generates cards based on the selected range, shuffles them, and attaches them to the game board.
function initCards() {
  const randomCards = getShuffledWithDuplicates(cards, config.range); // Shuffle and duplicate cards based on range.
  generateDisplay.style.gridTemplateColumns = `repeat(${Math.floor(
    config.range / 2
  )}, 1fr)`; // Set grid layout.
  randomCards.forEach((card) => {
    // Create card elements and append them to the display.
    generateDisplay.innerHTML += `
      <div class="box back-rotate">
        <img class="card-image" src="./assets/images/${card}">
      </div>
    `;
  });
  attempsDisplay.textContent = config.attemps; // Update attempts display.
  document.querySelectorAll(".box").forEach((box) => {
    // Attach click event listeners to each card.
    toggleBox(box);
    box.addEventListener("click", function () {
      if (
        !this.classList.contains("rotate") &&
        config.selectedCards.length < 2
      ) {
        toggleBox(this); // Rotate card on click.
        config.selectedCards.push(this); // Add card to selected cards array.
        checkSelectedElements(); // Check if selected cards match.
      }
    });
  });
}

// Function to rotate all cards. This is used to briefly show all cards at the beginning of the game.
function rotateAllCards() {
  setTimeout(() => {
    document.querySelectorAll(".box").forEach((element) => {
      toggleBox(element); // Rotate each card back after a delay.
    });
  }, 2000); // Delay before rotating cards back.
}

// Utility function to toggle card rotation classes.
function toggleBox(element) {
  element.classList.toggle("rotate");
  element.classList.toggle("back-rotate");
}

// Function to check if the selected cards match. Handles scoring and end-of-game logic.
function checkSelectedElements() {
  if (config.selectedCards.length === 2) {
    // Check if two cards are selected.
    const firstCardName = getImageNameFromBox(config.selectedCards[0]); // Get the name of the first card.
    const secondCardName = getImageNameFromBox(config.selectedCards[1]); // Get the name of the second card.
    if (firstCardName === secondCardName) {
      // If the cards match.
      scoreDisplay.textContent = ++config.score; // Increment and display score.
      config.selectedCards.splice(0); // Clear selected cards.
      if (config.score === config.range) {
        // Check if all pairs are matched.
        displayAlert("Congrats", "success"); // Show success message.
        setTimeout(() => {
          resetGame(); // Reset game after a delay.
        }, 2000);
      }
    } else {
      attempsDisplay.textContent = --config.attemps; // Decrement attempts if cards do not match.
      if (config.attemps <= 0) {
        // Check if attempts have run out.
        resetGame("You lost", "error", "You used all your attemps"); // Show loss message and reset game.
      }
      setTimeout(() => {
        // Delay before hiding unmatched cards.
        config.selectedCards.forEach((card) => {
          toggleBox(card); // Rotate cards back.
        });
        config.selectedCards.splice(0); // Clear selected cards.
      }, 1000);
    }
  }
}

// Utility function to extract the image name from a card element.
function getImageNameFromBox(box) {
  return box.firstElementChild.src.split("/").pop();
}

// Function to display alerts using SweetAlert library.
function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}

// Function to reset the game to its initial state and display a reset alert.
function resetGame(
  title = "Reseted",
  icon = "info",
  text = "Game has been reseted"
) {
  config.isStarted = false; // Mark game as not started.
  config.score = 0; // Reset score.
  config.attemps = config.range * 3; // Reset attempts based on range.
  config.selectedCards.splice(0); // Clear selected cards.
  generateDisplay.innerHTML = ""; // Clear game board.
  toggleControls(); // Toggle visibility of game controls.
  displayAlert(title, icon, text); // Show reset alert.
}

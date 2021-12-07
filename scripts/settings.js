// constants for settings
const minNumberOfHoles = 1;
const maxNumberOfHoles = 4;

// dom elements
let numberOfHolesDisplayElem = document.querySelector(
  ".number-of-holes-display"
);
let numberOfHolesMinusElem = document.querySelector(".number-of-holes-minus");
let numberOfHolesPlusElem = document.querySelector(".number-of-holes-plus");
let startGameElem = document.querySelector(".start-game-button");
let darkOverlayElem = document.querySelector(".dark-overlay");

// settings variables
let showPopup = true;
let numberOfHoles = minNumberOfHoles;

updateNumberOfHoles();

numberOfHolesPlusElem.addEventListener("click", () => {
  if (numberOfHoles < maxNumberOfHoles) {
    numberOfHoles++;
    updateNumberOfHoles();
  }
});

numberOfHolesMinusElem.addEventListener("click", () => {
  if (numberOfHoles > minNumberOfHoles) {
    numberOfHoles--;
    updateNumberOfHoles();
  }
});

startGameElem.addEventListener("click", hidePopup);

function updateNumberOfHoles() {
  numberOfHolesDisplayElem.innerHTML = numberOfHoles;
}

function hidePopup() {
  darkOverlayElem.setAttribute("style", "display: none;");
}

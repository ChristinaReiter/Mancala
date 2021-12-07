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
let holeRowTopElem = document.getElementById("hole-row-top");
let holeRowBottomElem = document.getElementById("hole-row-bottom");

// settings variables
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

startGameElem.addEventListener("click", generateHoles);

function updateNumberOfHoles() {
  numberOfHolesDisplayElem.innerHTML = numberOfHoles;
}

function generateHoles() {
  darkOverlayElem.setAttribute("style", "display: none;");
  // remove existing holes from both rows
  holeRowTopElem.innerHTML = "";
  holeRowBottomElem.innerHTML = "";

  // TODO add ids to the elements to be able to track the seeds they contain
  // generate new holes
  for (let i = 0; i < numberOfHoles; i++) {
    let topHoleDiv = document.createElement("div");
    let bottomHoleDiv = document.createElement("div");
    let holeUiDiv = document.createElement("div");
    let holeScoreDiv = document.createElement("div");

    topHoleDiv.className = "hole";
    bottomHoleDiv.className = "hole";
    holeUiDiv.className = "hole-ui";
    holeScoreDiv.className = "hole-score";
    holeScoreDiv.innerHTML = 0;

    topHoleDiv.appendChild(holeUiDiv);
    topHoleDiv.appendChild(holeScoreDiv);

    bottomHoleDiv.appendChild(holeScoreDiv.cloneNode(true));
    bottomHoleDiv.appendChild(holeUiDiv.cloneNode(true));

    // top row
    holeRowTopElem.appendChild(topHoleDiv);
    // bottom row
    holeRowBottomElem.appendChild(bottomHoleDiv);
  }
}

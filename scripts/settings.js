// constants for settings
const minNumberOfHoles = 2;
const maxNumberOfHoles = 8;

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
    numberOfHoles += 2;
    updateNumberOfHoles();
  }
});

numberOfHolesMinusElem.addEventListener("click", () => {
  if (numberOfHoles > minNumberOfHoles) {
    numberOfHoles -= 2;
    updateNumberOfHoles();
  }
});

startGameElem.addEventListener("click", generateHoles);

function updateNumberOfHoles() {
  numberOfHolesDisplayElem.innerHTML = numberOfHoles;
}

function generateHoles() {
  darkOverlayElem.setAttribute("style", "display: none;");
  // remove existing holes from both rows, top row hole belong to opponent, bottom ones to controlling player
  holeRowTopElem.innerHTML = "";
  holeRowBottomElem.innerHTML = "";

  // index marks smallest opponent hole index from which on all following indices belong to the opponent
  const opponentsHoleIndex = numberOfHoles / 2;
  // generate new player holes
  for (let i = 0; i < opponentsHoleIndex; i++) {
    let bottomHoleDiv = document.createElement("div");
    let holeUiDiv = document.createElement("div");
    let holeScoreDiv = document.createElement("div");

    bottomHoleDiv.className = "hole";
    holeUiDiv.className = "hole-ui";
    holeScoreDiv.className = "hole-score";
    holeScoreDiv.id = `hole-score-${i}`;
    holeScoreDiv.innerHTML = i;

    bottomHoleDiv.appendChild(holeScoreDiv);
    bottomHoleDiv.appendChild(holeUiDiv);

    holeRowBottomElem.appendChild(bottomHoleDiv);
  }

  // generate new opponent holes (decreasing because they go from right to left)
  for (let i = numberOfHoles - 1; i >= opponentsHoleIndex; i--) {
    let topHoleDiv = document.createElement("div");
    let holeUiDiv = document.createElement("div");
    let holeScoreDiv = document.createElement("div");

    topHoleDiv.className = "hole";
    holeUiDiv.className = "hole-ui";
    holeScoreDiv.className = "hole-score";
    holeScoreDiv.id = `hole-score-${i}`;
    holeScoreDiv.innerHTML = i;

    topHoleDiv.appendChild(holeUiDiv);
    topHoleDiv.appendChild(holeScoreDiv);

    holeRowTopElem.appendChild(topHoleDiv);
  }
}

import GameLogic from "./game-logic.js";

// constants for settings
const minNumberOfHoles = 2;
const maxNumberOfHoles = 8;

// dom elements
let numberOfHolesDisplayElem = document.querySelector(
  ".number-of-holes-display"
);
let numberOfHolesMinusElem = document.querySelector(".number-of-holes-minus");
let numberOfHolesPlusElem = document.querySelector(".number-of-holes-plus");
let holeRowTopElem = document.getElementById("hole-row-top");
let holeRowBottomElem = document.getElementById("hole-row-bottom");

let startGameOverlayElem = document.getElementById("start-game-popup");
let startGameButton = document.getElementById("start-game-button");
let restartGameButton = document.getElementById("restart-game-button");
let restartGameIcon = document.getElementById("restart-game-icon");

let winnerElem = document.getElementById("winner-popup");
let winnerTextElem = document.getElementById("winner-text");

let warehouseScoreLeft = document.getElementById("warehouse-left");
let warehouseScoreRight = document.getElementById("warehouse-right");

// settings variables
let numberOfHoles = maxNumberOfHoles;

// game variables
let currentGame;

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

startGameButton.addEventListener("click", startOrResetGame);
restartGameButton.addEventListener("click", startOrResetGame);
restartGameIcon.addEventListener("click", startOrResetGame);

function updateNumberOfHoles() {
  numberOfHolesDisplayElem.innerHTML = numberOfHoles;
}

function startOrResetGame() {
  startGameOverlayElem.setAttribute("style", "display: none;");
  // hide winner popup
  updateWinner(-1);
  // TODO integrate multiplayer option
  currentGame = new GameLogic(1, 0, numberOfHoles);

  // set warehouse scores to 0
  warehouseScoreLeft.innerHTML = 0;
  warehouseScoreRight.innerHTML = 0;

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
    holeUiDiv.className = "hole-ui hole-ui-player";
    holeScoreDiv.className = "hole-score";
    holeScoreDiv.id = `hole-score-${i}`;
    holeScoreDiv.innerHTML = currentGame.holes[i];
    holeUiDiv.addEventListener("click", () => {
      currentGame.executePlayerMove(i);
      updateHoleAndWarehouseScores();
    });

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
    holeScoreDiv.innerHTML = currentGame.holes[i];

    topHoleDiv.appendChild(holeUiDiv);
    topHoleDiv.appendChild(holeScoreDiv);

    holeRowTopElem.appendChild(topHoleDiv);
  }

  // adjust the grid property of both hole rows to center the holes in the row correctly
  let gridTemplateColumns = "";
  for (let i = 0; i < numberOfHoles; i += 2) {
    gridTemplateColumns += "auto ";
  }
  holeRowTopElem.setAttribute(
    "style",
    `display: grid; grid-template-columns: ${gridTemplateColumns}`
  );
  holeRowBottomElem.setAttribute(
    "style",
    `display: grid; grid-template-columns: ${gridTemplateColumns}`
  );
}

export function updateHoleAndWarehouseScores() {
  warehouseScoreLeft.innerHTML = currentGame.warehouses[0];
  warehouseScoreRight.innerHTML = currentGame.warehouses[1];
  for (let i = 0; i < currentGame.holes.length; i++) {
    const holeScore = document.getElementById(`hole-score-${i}`);
    holeScore.innerHTML = currentGame.holes[i];
  }
}

export function updateWinner(winnerIndex) {
  if (winnerIndex === 0) {
    winnerElem.setAttribute("style", "display: block;");
    winnerTextElem.innerText = "YOU WON!";
  } else if (winnerIndex === 1) {
    winnerElem.setAttribute("style", "display: block;");
    winnerTextElem.innerText = "YOU LOST :(";
  } else if (winnerIndex === -1) {
    winnerElem.setAttribute("style", "display: none;");
  }
}

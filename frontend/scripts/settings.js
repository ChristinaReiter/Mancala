import { GameStatus, PlayStyle } from "./enums/enums.js";
import GameLogic from "./game-logic.js";
import { leave } from "./requests/requests.js";

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
let startMultiplayerGameButton = document.getElementById("multiplayer-button");
let restartGameButton = document.getElementById("restart-game-button");
let restartGameIcon = document.getElementById("restart-game-icon");

let winnerElem = document.getElementById("winner-popup");
let winnerTextElem = document.getElementById("winner-text");

let warehouseScoreLeft = document.getElementById("warehouse-left");
let warehouseScoreRight = document.getElementById("warehouse-right");

//variables for Seed Settings
let numberOfSeeds = 5;
const minNumberOfSeeds = 1;
const maxNumberOfSeeds = 15;
let numberOfSeedsDisplayElem = document.querySelector(
  ".number-of-seeds-display"
);
let numberOfSeedsMinusElem = document.querySelector(".number-of-seeds-minus");
let numberOfSeedsPlusElem = document.querySelector(".number-of-seeds-plus");

// settings variables
let numberOfHoles = maxNumberOfHoles;

// game variables
let currentGame;

export function getCurrentGame() {
  return currentGame;
}

updateNumberOfHoles();
updateNumberOfSeeds();

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

startGameButton.addEventListener("click", () => {
  startOrResetGame();
});
startMultiplayerGameButton.addEventListener("click", () => {
  startOrResetGame(true);
});
restartGameButton.addEventListener(
  "click",
  async function () {
    currentGame = getCurrentGame();
    if (currentGame.playStyle === PlayStyle.OFFLINE) {
      winnerElem.setAttribute("style", "display: none");
      startGameOverlayElem.setAttribute(
        "style",
        "display: list-item; z-index: 10;"
      );
    } else {
      //call leave
      leave();
      winnerElem.setAttribute("style", "display: none");
      startGameOverlayElem.setAttribute(
        "style",
        "display: list-item; z-index: 10;"
      );
    }
  },
  false
);

restartGameIcon.addEventListener(
  "click",
  async function () {
    currentGame = getCurrentGame();
    if (currentGame.playStyle === PlayStyle.OFFLINE) {
      winnerElem.setAttribute("style", "display: none");
      startGameOverlayElem.setAttribute(
        "style",
        "display: list-item; z-index: 10;"
      );
    } else {
      //call leave
      leave();
      winnerElem.setAttribute("style", "display: none");
    }
  },
  false
);

function updateNumberOfHoles() {
  numberOfHolesDisplayElem.innerHTML = numberOfHoles;
}

export function startOrResetGame(isMultiplayer) {
  startGameOverlayElem.setAttribute("style", "display: none;");
  // hide winner popup
  updateWinner(GameStatus.WAITING_FOR_PLAYER);
  // TODO integrate multiplayer option

  let checkbox = document.getElementById("checkbox");
  if (isMultiplayer) {
    currentGame = new GameLogic(
      PlayStyle.ONLINE,
      1,
      numberOfHoles,
      numberOfSeeds
    );
  } else if (checkbox.checked) {
    currentGame = new GameLogic(
      PlayStyle.OFFLINE,
      1,
      numberOfHoles,
      numberOfSeeds
    );
  } else {
    currentGame = new GameLogic(
      PlayStyle.OFFLINE,
      0,
      numberOfHoles,
      numberOfSeeds
    );
  }

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
    holeUiDiv.id = `hole-ui-${i}`;
    holeScoreDiv.className = "hole-score";
    holeScoreDiv.id = `hole-score-${i}`;
    holeScoreDiv.innerHTML = currentGame.holes[i];
    holeUiDiv.addEventListener("click", () => {
      currentGame.executePlayerMove(i);
      updateHoleAndWarehouseScores();
      displayWarehouseSeeds();
      displayHoleSeeds();
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
    holeUiDiv.id = `hole-ui-${i}`;
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
  displayHoleSeeds();
  displayWarehouseSeeds();

  if (
    currentGame.playerStartIndex === 1 &&
    currentGame.playStyle === PlayStyle.OFFLINE
  ) {
    currentGame.executeAiMove();
  } else {
  }
}

export function updateHoleAndWarehouseScores() {
  warehouseScoreRight.innerHTML = currentGame.warehouses[0];
  warehouseScoreLeft.innerHTML = currentGame.warehouses[1];
  for (let i = 0; i < currentGame.holes.length; i++) {
    const holeScore = document.getElementById(`hole-score-${i}`);
    holeScore.innerHTML = currentGame.holes[i];
  }
}

export function updateWinner(gameStatus) {
  if (gameStatus === GameStatus.PLAYER_WON) {
    winnerElem.setAttribute("style", "display: block; z-index: 10;");
    winnerTextElem.innerText = "YOU WON!";
  } else if (gameStatus === GameStatus.OPPONENT_WON) {
    winnerElem.setAttribute("style", "display: block; z-index: 10;");
    winnerTextElem.innerText = "YOU LOST :(";
  } else if (gameStatus === GameStatus.DRAW) {
    winnerElem.setAttribute("style", "display: block; z-index: 10;");
    winnerTextElem.innerText = "DRAW!";
  } else {
    winnerElem.setAttribute("style", "display: none;");
  }
}

export function displayWarehouseSeeds() {
  let leftWarehouse = document.getElementById("warehouse-ui-left");
  let anzahlWarehouseSeedsLeft = leftWarehouse.childElementCount;

  if (currentGame.warehouses[1] > anzahlWarehouseSeedsLeft) {
    var countAddSeedsL = currentGame.warehouses[1] - anzahlWarehouseSeedsLeft;
    for (let i = 0; i < countAddSeedsL; i++) {
      var seedDivL = document.createElement("div");
      seedDivL.className = "seeds";
      var randomTopL = getRandomNumber(10, 150);
      var randomLeftL = getRandomNumber(10, 90);
      seedDivL.setAttribute(
        "style",
        `margin-top: ${randomTopL}px; margin-left: ${randomLeftL}px`
      );
      leftWarehouse.appendChild(seedDivL);
    }
  } else if (currentGame.warehouses[1] < anzahlWarehouseSeedsLeft) {
    var countDeleteSeeds = anzahlWarehouseSeedsLeft - currentGame.warehouses[1];
    for (let n = 0; n < countDeleteSeeds; n++) {
      leftWarehouse.removeChild(leftWarehouse.lastChild);
    }
  }

  let rightWarehouse = document.getElementById("warehouse-ui-right");
  let anzahlWarehouseSeedsRight = rightWarehouse.childElementCount;

  if (currentGame.warehouses[0] > anzahlWarehouseSeedsRight) {
    var countAddSeedsR = currentGame.warehouses[0] - anzahlWarehouseSeedsRight;
    for (let i = 0; i < countAddSeedsR; i++) {
      var seedDivR = document.createElement("div");
      seedDivR.className = "seeds";
      var randomTopR = getRandomNumber(10, 150);
      var randomLeftR = getRandomNumber(10, 90);
      seedDivR.setAttribute(
        "style",
        `margin-top: ${randomTopR}px; margin-left: ${randomLeftR}px`
      );
      rightWarehouse.appendChild(seedDivR);
    }
  } else if (currentGame.warehouses[0] < anzahlWarehouseSeedsRight) {
    var countDeleteSeeds =
      anzahlWarehouseSeedsRight - currentGame.warehouses[0];
    for (let n = 0; n < countDeleteSeeds; n++) {
      rightWarehouse.removeChild(rightWarehouse.lastChild);
    }
  }
}

export function displayHoleSeeds() {
  for (let i = 0; i < currentGame.holes.length; i++) {
    let holeIndexed = document.getElementById(`hole-ui-${i}`);
    let seedNumber = holeIndexed.childElementCount;
    if (currentGame.holes[i] > seedNumber) {
      var countAddSeeds = currentGame.holes[i] - seedNumber;
      for (let n = 0; n < countAddSeeds; n++) {
        var seedDiv = document.createElement("div");
        seedDiv.className = "seeds";
        var randomTop = getRandomNumber(10, 60);
        var randomLeft = getRandomNumber(10, 45);
        seedDiv.setAttribute(
          "style",
          `margin-top: ${randomTop}px; margin-left: ${randomLeft}px`
        );
        holeIndexed.appendChild(seedDiv);
      }
    } else if (currentGame.holes[i] < seedNumber) {
      var countDeleteSeeds = seedNumber - currentGame.holes[i];
      for (let n = 0; n < countDeleteSeeds; n++) {
        holeIndexed.removeChild(holeIndexed.lastChild);
      }
    }
  }
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

numberOfSeedsPlusElem.addEventListener("click", () => {
  if (numberOfSeeds < maxNumberOfSeeds) {
    numberOfSeeds += 1;
    updateNumberOfSeeds();
  }
});

numberOfSeedsMinusElem.addEventListener("click", () => {
  if (numberOfSeeds > minNumberOfSeeds) {
    numberOfSeeds -= 1;
    updateNumberOfSeeds();
  }
});

function updateNumberOfSeeds() {
  numberOfSeedsDisplayElem.innerHTML = numberOfSeeds;
}

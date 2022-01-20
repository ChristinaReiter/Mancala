import {
  updateHoleAndWarehouseScores,
  updateWinner,
  displayHoleSeeds,
  displayWarehouseSeeds,
} from "./settings.js";
import {
  isPlayerMoveValid,
  isOpponentMoveValid,
} from "./game-utils/move-validity.js";
import {
  countSeeds,
  mergeHolesAndWarehouses,
  divideMergedArray,
} from "./game-utils/seed-handling.js";
import {
  Actor,
  DistributeHoleEvent,
  GameStatus,
  PlayStyle,
} from "./enums/enums.js";
import { findBestAiMove } from "./game-utils/ai.js";
import { join, notify } from "./requests/requests.js";
import { getUsername, setGame } from "./multiplayer/credentials.js";
import { createEventSource } from "./multiplayer/events.js";

export default class GameLogic {
  initialSeedsPerHole;
  seedsToWin = 24;
  // either PlaySyle.OFFLINE or PlayStyle.ONLINE
  playStyle;
  // number of total seeds in the game, always four seeds per hole initially
  totalSeeds;
  // one dimensional array that holds the number of seeds for each hole
  // size of the array is the number of holes
  // first half of the holes are the holes from the controlling player, remaining are the opponent's ones
  holes;
  // holds the index of the first opponent hole, all prior indices are the player's holes, all following the opponent's
  opponentHolesIndex;
  // one dimensional arrays that holds the number of seeds for each warehouse
  // has fixed length two: [0] --> warehouse of the controlling player, [1] --> warehouse of the opponent
  warehouses;
  // PLAYER_WON / OPPONENT_WON / WAITING_FOR_PLAYER / WAITING_FOR_OPPONENT
  gameStatus;
  // used to execute first ai move when the computer shall start in an offline game
  playerStartIndex;
  // event source for receiving game updates, only used in multiplayer
  eventSource;

  constructor(playStyle, playerStartIndex, numberOfHoles, numberOfSeeds) {
    this.playStyle = playStyle;
    this.opponentHolesIndex = numberOfHoles / 2;
    this.initialSeedsPerHole = numberOfSeeds;
    this.holes = new Array(numberOfHoles).fill(this.initialSeedsPerHole);
    this.totalSeeds = numberOfHoles * this.initialSeedsPerHole;
    this.warehouses = new Array(2).fill(0);
    this.playerStartIndex = playerStartIndex;
    if (playStyle === PlayStyle.ONLINE) {
      displayMessage("Waiting for opponent to join.");
      this.initOnlineGame();
    }
    this.gameStatus =
      playStyle === PlayStyle.ONLINE
        ? GameStatus.WAITING_FOR_SERVER
        : playerStartIndex === 0
        ? GameStatus.WAITING_FOR_PLAYER
        : GameStatus.WAITING_FOR_OPPONENT;
    if (playStyle === PlayStyle.OFFLINE) {
      if (this.gameStatus === GameStatus.WAITING_FOR_OPPONENT) {
        displayMessage("The other one's turn.");
      } else if (this.gameStatus === GameStatus.WAITING_FOR_PLAYER) {
        displayMessage("Your turn.");
      } else if (this.gameStatus === GameStatus.WAITING_FOR_SERVER) {
        displayMessage("Waiting ...");
      }
    }
  }

  async initOnlineGame() {
    // call join
    const gameId = await join({
      size: this.opponentHolesIndex,
      initial: this.initialSeedsPerHole,
    });
    setGame(gameId);
    const nick = getUsername();
    this.eventSource = createEventSource(nick, gameId);
  }

  closeEventSource() {
    if (this.playStyle === PlayStyle.ONLINE && this.eventSource) {
      try {
        this.eventSource.close();
      } catch (error) {}
    }
  }

  executePlayerMove(holeIndex) {
    displayMessage("Your turn.");
    if (
      !isPlayerMoveValid(
        holeIndex,
        this.holes,
        this.opponentHolesIndex,
        this.gameStatus
      )
    ) {
      console.log(
        `Gamemaster: This move on hole <${holeIndex}> is invalid, please choose another one`
      );
      return;
    }
    console.log(`Player: Making a move on hole <${holeIndex}>`);
    displayBorder(holeIndex);
    if (this.playStyle === PlayStyle.ONLINE) {
      displayBorder(holeIndex);
      notify(holeIndex);
      return;
    }
    const { lastFilledHoleIndex, distributeHoleEvent } = this.distributeSeeds(
      holeIndex,
      Actor.PLAYER
    );
    if (lastFilledHoleIndex === null) {
      console.log("AI: Something went wrong emptying the holes...");
      return;
      // move ended on own empty hole
    } else if (
      lastFilledHoleIndex < this.opponentHolesIndex &&
      this.holes[lastFilledHoleIndex] === 1
    ) {
      const oppositeHoleIndex =
        this.opponentHolesIndex -
        1 +
        (this.opponentHolesIndex - lastFilledHoleIndex);
      // + 1 because of the seed in the own hole
      const seedsToMove = this.holes[oppositeHoleIndex] + 1;
      this.holes[lastFilledHoleIndex] = 0;
      this.holes[oppositeHoleIndex] = 0;
      this.warehouses[0] = this.warehouses[0] + seedsToMove;
    }
    this.updateUI();
    if (
      this.gameStatus === GameStatus.WAITING_FOR_PLAYER &&
      distributeHoleEvent !== DistributeHoleEvent.IN_OWN_WAREHOUSE
    ) {
      this.gameStatus = GameStatus.WAITING_FOR_OPPONENT;
      if (this.playStyle === PlayStyle.OFFLINE) this.executeAiMove();
    }
  }

  async executeAiMove() {
    displayMessage("The other one's turn.");
    console.log("AI: Thinking about my next move");
    setTimeout(() => {
      let holeIndex = findBestAiMove({
        opponentHolesIndex: this.opponentHolesIndex,
        holes: this.holes,
      });
      displayBorder(holeIndex);
      if (holeIndex === null) {
        console.log("AI: Sorry I can't do anything here :(");
        return;
      }
      if (this.playStyle != PlayStyle.OFFLINE) {
        console.log(
          "AI: This is an online game, what am i supposed to do here?"
        );
        return;
      }
      if (
        !isOpponentMoveValid(
          holeIndex,
          this.holes,
          this.opponentHolesIndex,
          this.gameStatus
        )
      ) {
        console.log("AI: My chosen move was invalid. Stopping.");
        return;
      }
      const { lastFilledHoleIndex, distributeHoleEvent } = this.distributeSeeds(
        holeIndex,
        Actor.OPPONENT
      );
      if (lastFilledHoleIndex === null) {
        console.log("AI: Something went wrong emptying the holes...");
        return;
      } else if (
        lastFilledHoleIndex >= this.opponentHolesIndex &&
        this.holes[lastFilledHoleIndex] === 1
      ) {
        const oppositeHoleIndex =
          this.opponentHolesIndex -
          1 -
          (lastFilledHoleIndex - this.opponentHolesIndex);
        // + 1 because of the seed in the own hole
        const seedsToMove = this.holes[oppositeHoleIndex] + 1;
        this.holes[lastFilledHoleIndex] = 0;
        this.holes[oppositeHoleIndex] = 0;
        this.warehouses[1] = this.warehouses[1] + seedsToMove;
      }
      displayBorder(holeIndex);
      console.log(`AI: Finished my move on hole <${holeIndex}> 😎`);
      this.updateUI();
      displayMessage("Your turn.");
      if (
        this.gameStatus === GameStatus.OPPONENT_WON ||
        this.gameStatus === GameStatus.PLAYER_WON
      ) {
        console.log(`Gamemaster: We have a winner: <${this.gameStatus}>`);
        displayMessage("Game over.");
        return;
      }
      if (distributeHoleEvent !== DistributeHoleEvent.IN_OWN_WAREHOUSE) {
        this.gameStatus = GameStatus.WAITING_FOR_PLAYER;
      } else {
        this.executeAiMove();
      }
    }, 3000);
  }

  // empties selected hole, returns index of last filled hole OR null on invalid hole index
  // returns: {lastFilledHoleIndex, distributeHoleEvent}
  distributeSeeds(holeIndex, actor) {
    if (holeIndex >= this.holes.length || holeIndex < 0) {
      console.warn(`emptyHole: called with invalid holeIndex <${holeIndex}>`);
      return;
    }

    let holeValue = this.holes[holeIndex];
    if (holeValue <= 0) {
      console.warn("emptyHole: hole is empty. will do nothing");
      return;
    }
    // empty selected hole
    this.holes[holeIndex] = 0;
    // temporarily merge holes and warehouses for seed distribution
    const { mergedArray, actorWarehouseIndex } = mergeHolesAndWarehouses({
      actor,
      holes: this.holes,
      opponentHolesIndex: this.opponentHolesIndex,
      warehouses: this.warehouses,
    });
    // fill next holes
    for (let i = 1; i <= holeValue; i++) {
      // module will prevent array overflow
      const targetHoleIndex = (holeIndex + i) % mergedArray.length;
      mergedArray[targetHoleIndex] = mergedArray[targetHoleIndex] + 1;
    }
    const lastFilledHoleIndex = (holeIndex + holeValue) % mergedArray.length;
    const { updatedHoles, updatedWarehouse } = divideMergedArray({
      mergedArray,
      actor,
      actorWarehouseIndex,
    });
    this.holes = updatedHoles;
    if (actor === Actor.PLAYER) {
      this.warehouses[0] = updatedWarehouse;
    } else {
      this.warehouses[1] = updatedWarehouse;
    }
    let distributeHoleEvent;
    if (lastFilledHoleIndex === actorWarehouseIndex) {
      distributeHoleEvent = DistributeHoleEvent.IN_OWN_WAREHOUSE;
    }
    return { lastFilledHoleIndex, distributeHoleEvent };
  }

  checkGameOver() {
    // timeout during pairing
    if (this.gameStatus === GameStatus.PAIRING_TIMEOUT) {
      updateWinner(this.gameStatus);
      return;
    }
    // player has enough seeds in his / her warehouse
    if (this.warehouses[0] >= this.seedsToWin) {
      this.gameStatus = GameStatus.PLAYER_WON;
      displayMessage("Game over.");
      console.log(
        "Gamemaster: Game is over because player has enough seeds to win."
      );
      // opponents has enough seeds in his / her  warehouse
    }
    if (this.warehouses[1] >= this.seedsToWin) {
      this.gameStatus = GameStatus.OPPONENT_WON;
      displayMessage("Game over.");
      console.log(
        "Gamemaster: Game is over because opponent has enough seeds to win."
      );
    }
    // check if player has 0 seeds in his holes
    const playerTotalSeeds = countSeeds(
      false,
      this.holes,
      this.opponentHolesIndex
    );
    const opponentTotalSeeds = countSeeds(
      true,
      this.holes,
      this.opponentHolesIndex
    );
    let endGame = false;
    if (playerTotalSeeds === 0 && opponentTotalSeeds === 0) {
      endGame = true;
    } else if (playerTotalSeeds === 0) {
      endGame = true;
      for (let i = this.opponentHolesIndex; i < this.holes.length; i++) {
        this.holes[i] = 0;
      }
      this.warehouses[1] += opponentTotalSeeds;
    } else if (opponentTotalSeeds === 0) {
      endGame = true;
      for (let i = 0; i < this.opponentHolesIndex; i++) {
        this.holes[i] = 0;
      }
      this.warehouses[0] += playerTotalSeeds;
    }
    if (endGame) {
      console.log(
        "Gamemaster: Game is over because player/opponent has 0 seeds in his holes."
      );
      displayMessage("Game over.");
      this.gameStatus =
        this.warehouses[0] > this.warehouses[1]
          ? GameStatus.PLAYER_WON
          : this.warehouses[0] < this.warehouses[1]
          ? GameStatus.OPPONENT_WON
          : GameStatus.DRAW;
    }
    if (
      this.gameStatus !== GameStatus.WAITING_FOR_PLAYER &&
      this.gameStatus !== GameStatus.WAITING_FOR_OPPONENT
    ) {
      console.log(`Gamemaster: We have a result: ${this.gameStatus}>`);
      updateWinner(this.gameStatus);
      return;
    }
  }

  updateUI() {
    this.checkGameOver();
    updateHoleAndWarehouseScores();
    displayWarehouseSeeds();
    displayHoleSeeds();
  }

  // input: {gameStatus, playerWarehouse, playerHoles, opponentWarehouse, opponentHoles}
  updateGameFromEvent(input) {
    this.gameStatus = input.gameStatus;
    if (this.gameStatus === GameStatus.WAITING_FOR_PLAYER) {
      displayMessage("Your turn.");
    } else if (this.gameStatus === GameStatus.WAITING_FOR_OPPONENT) {
      displayMessage("The other one's turn.");
    }
    this.warehouses[0] = input.playerWarehouse;
    this.warehouses[1] = input.opponentWarehouse;
    for (let i = 0; i < this.opponentHolesIndex; i++) {
      this.holes[i] = input.playerHoles[i];
      const j = i + this.opponentHolesIndex;
      this.holes[j] = input.opponentHoles[i];
    }
    this.updateUI();
  }

  updateWinnerFromEvent(gameStatus) {
    this.gameStatus = gameStatus;
    this.updateUI();
  }
}

//Message-Panel
export function displayMessage(text) {
  document.getElementById("messagepanel").innerHTML = text;
}

//Border when selecting a hole
export function displayBorder(holeIndex) {
  let elem1 = document.getElementById(`hole-ui-${holeIndex}`);

  elem1.setAttribute(
    "style",
    "  box-sizing: border-box; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; border: 5px inset #ffffff;"
  );
  setTimeout(function () {
    elem1.removeAttribute(
      "style",
      "box-sizing; -moz-box-sizing; -webkit-box-sizing; border;"
    );
  }, 2000);
}

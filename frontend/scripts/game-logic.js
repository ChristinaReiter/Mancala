import {
  updateHoleAndWarehouseScores,
  numberOfSeeds,
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
  canSeedsBeMovedToWarehouse,
} from "./game-utils/seed-counting.js";
import { GameStatus, PlayStyle } from "./enums/enums.js";

export default class GameLogic {
  initialSeedsPerHole = numberOfSeeds;
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

  constructor(playStyle, playerStartIndex, numberOfHoles) {
    this.playStyle = playStyle;
    this.opponentHolesIndex = numberOfHoles / 2;
    this.holes = new Array(numberOfHoles).fill(this.initialSeedsPerHole);
    this.totalSeeds = numberOfHoles * this.initialSeedsPerHole;
    this.warehouses = new Array(2).fill(0);
    this.gameStatus =
      playerStartIndex === 0
        ? GameStatus.WAITING_FOR_PLAYER
        : GameStatus.WAITING_FOR_OPPONENT;
  }

  executePlayerMove(holeIndex) {
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
    const lastFilledHoleIndex = this.emptyHole(holeIndex);
    if (lastFilledHoleIndex === null) {
      console.log("AI: Something went wrong emptying the holes...");
      return;
    }
    this.moveSeedsToWarehouse(lastFilledHoleIndex, false);
    this.checkGameOver();
    updateHoleAndWarehouseScores();
    displayWarehouseSeeds();
    displayHoleSeeds();
    if (
      this.gameStatus === GameStatus.PLAYER_WON ||
      this.gameStatus === GameStatus.OPPONENT_WON
    ) {
      console.log(`Gamemaster: We have a winner: ${this.gameStatus}>`);
      updateWinner(this.gameStatus);
      return;
    }
    this.gameStatus = GameStatus.WAITING_FOR_OPPONENT;
    if (this.playStyle === PlayStyle.OFFLINE) this.executeAiMove();
  }

  async executeAiMove() {
    console.log("AI: Thinking about my next move");
    // TODO use better AI function
    setTimeout(() => {
      const holeIndex = this.findRandomAiMove();
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
      const lastFilledHoleIndex = this.emptyHole(holeIndex);
      if (lastFilledHoleIndex === null) {
        console.log("AI: Something went wrong emptying the holes...");
        return;
      }
      this.moveSeedsToWarehouse(lastFilledHoleIndex, true);
      console.log(`AI: Finished my move on hole <${holeIndex}> 😎`);
      this.checkGameOver();
      updateHoleAndWarehouseScores();
      displayWarehouseSeeds();
      displayHoleSeeds();
      if (
        this.gameStatus === GameStatus.OPPONENT_WON ||
        this.gameStatus === GameStatus.PLAYER_WON
      ) {
        console.log(`Gamemaster: We have a winner: <${this.gameStatus}>`);
        return;
      }
      this.gameStatus = GameStatus.WAITING_FOR_PLAYER;
    }, 3000);
  }

  moveSeedsToWarehouse(lastFilledHoleIndex, isOpponent) {
    // lower index for player is lowest opponent hole index and vice versa
    const lowerIndex = isOpponent ? 0 : this.opponentHolesIndex;
    // upper index for player is the highest opponent hole index and vice versa
    const upperIndex = isOpponent
      ? this.opponentHolesIndex - 1
      : this.holes.length - 1;
    if (
      (isOpponent && lastFilledHoleIndex > upperIndex) ||
      (!isOpponent && lastFilledHoleIndex < lowerIndex)
    ) {
      console.log(
        `Gamemaster: Move ended on the moving player's own hole. No seeds can be moved`
      );
      return;
    }
    const warehouseIndex = isOpponent ? 1 : 0;
    for (let i = lastFilledHoleIndex; i >= lowerIndex; i--) {
      let seedsFromHole = this.holes[i];
      console.log(`Gamemaster: Hole <${i}> now has <${this.holes[i]}> seeds.`);
      if (canSeedsBeMovedToWarehouse(seedsFromHole)) {
        console.log(
          `Gamemaster: <${seedsFromHole}> seeds from hole <${i}> can be moved to warehouse <${warehouseIndex}>`
        );
        this.warehouses[warehouseIndex] =
          this.warehouses[warehouseIndex] + seedsFromHole;
        this.holes[i] = 0;
        console.log("Gamemaster: New warehouse scores:", this.warehouses);
      } else {
        break;
      }
    }
  }

  // empties selected hole, returns index of last filled hole OR null on invalid hole index
  emptyHole(holeIndex) {
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
    // fill next holes
    for (let i = 1; i <= holeValue; i++) {
      // module will prevent array overflow
      const targetHoleIndex = (holeIndex + i) % this.holes.length;
      this.holes[targetHoleIndex] = this.holes[targetHoleIndex] + 1;
    }
    const lastFilledHoleIndex = (holeIndex + holeValue) % this.holes.length;
    console.log("emptyHole returning", lastFilledHoleIndex);
    return lastFilledHoleIndex;
  }

  checkGameOver() {
    // player has enough seeds in his / her warehouse
    if (this.warehouses[0] >= this.seedsToWin) {
      this.gameStatus = GameStatus.PLAYER_WON;
      console.log(
        "Gamemaster: Game is over because player has enough seeds to win."
      );
      // opponents has enough seeds in his / her  warehouse
    } else if (this.warehouses[1] >= this.seedsToWin) {
      this.gameStatus = GameStatus.OPPONENT_WON;
      console.log(
        "Gamemaster: Game is over because opponent has enough seeds to win."
      );
    } else {
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
      let gameIsOver = false;
      // player has no seeds in his holes and opponent can not make any move that would change that
      if (playerTotalSeeds === 0) {
        gameIsOver = true;
        for (let i = 0; i < this.opponentHolesIndex; i++) {
          if (
            isPlayerMoveValid(
              i,
              this.holes,
              this.opponentHolesIndex,
              this.gameStatus
            )
          ) {
            gameIsOver = false;
            break;
          }
          if (gameIsOver) {
            console.log(
              "Gamemaster: Game is over because player has no seeds in his holes and opponent can not make any move that would change that."
            );
          }
        }
        // opponent has no seeds in his holes and player can not make any move that would change that
      } else if (opponentTotalSeeds === 0) {
        gameIsOver = true;
        for (let i = this.opponentHolesIndex; i < this.holes.length; i++) {
          if (
            isOpponentMoveValid(
              i,
              this.holes,
              this.opponentHolesIndex,
              this.gameStatus
            )
          ) {
            gameIsOver = false;
            break;
          }
          if (gameIsOver) {
            console.log(
              "Gamemaster: Game is over because opponent has no seeds in his holes and player can not make any move that would change that."
            );
          }
        }
      }
      if (gameIsOver) {
        this.gameStatus =
          this.warehouses[0] >= this.warehouses[1]
            ? GameStatus.PLAYER_WON
            : GameStatus.OPPONENT_WON;
      }
    }
  }

  // simple method that finds the first possible move out of a randomly order of the hole indices
  // returns hole index or null if no move is possible
  findRandomAiMove() {
    const moveArray = [];
    for (let i = this.opponentHolesIndex; i < this.holes.length; i++) {
      moveArray.push(i);
    }
    const shuffledMoveArray = this.shuffle(moveArray);
    for (let i = 0; i < shuffledMoveArray.length; i++) {
      const selectedMove = shuffledMoveArray[i];
      console.log(`AI: Testing move <${selectedMove}>.`);
      if (
        isOpponentMoveValid(
          selectedMove,
          this.holes,
          this.opponentHolesIndex,
          this.gameStatus
        )
      ) {
        return selectedMove;
      }
      console.log(`AI: Move <${selectedMove}> is invalid.`);
    }
    return null;
  }

  shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
}

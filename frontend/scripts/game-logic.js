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
import { countSeeds } from "./game-utils/seed-counting.js";
import {
  Actor,
  DistributeHoleEvent,
  GameStatus,
  PlayStyle,
} from "./enums/enums.js";

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
    //this.holes = [0, 1, 5, 5, 1, 3];
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
    this.checkGameOver();
    updateHoleAndWarehouseScores();
    displayWarehouseSeeds();
    displayHoleSeeds();
    if (
      this.gameStatus === GameStatus.WAITING_FOR_PLAYER &&
      distributeHoleEvent !== DistributeHoleEvent.IN_OWN_WAREHOUSE
    ) {
      this.gameStatus = GameStatus.WAITING_FOR_OPPONENT;
      if (this.playStyle === PlayStyle.OFFLINE) this.executeAiMove();
    }
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
    const { mergedArray, actorWarehouseIndex } =
      this.mergeHolesAndWarehouses(actor);
    // fill next holes
    for (let i = 1; i <= holeValue; i++) {
      // module will prevent array overflow
      const targetHoleIndex = (holeIndex + i) % mergedArray.length;
      mergedArray[targetHoleIndex] = mergedArray[targetHoleIndex] + 1;
    }
    const lastFilledHoleIndex = (holeIndex + holeValue) % mergedArray.length;
    console.log("emptyHole returning", lastFilledHoleIndex);
    const { updatedHoles, updatedWarehouse } = this.divideMergedArray({
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
    console.log("holes", this.holes);
    console.log("warehouses", this.warehouses);
    return { lastFilledHoleIndex, distributeHoleEvent };
  }

  checkGameOver() {
    // player has enough seeds in his / her warehouse
    if (this.warehouses[0] >= this.seedsToWin) {
      this.gameStatus = GameStatus.PLAYER_WON;
      console.log(
        "Gamemaster: Game is over because player has enough seeds to win."
      );
      // opponents has enough seeds in his / her  warehouse
    }
    if (this.warehouses[1] >= this.seedsToWin) {
      this.gameStatus = GameStatus.OPPONENT_WON;
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

  mergeHolesAndWarehouses(actor) {
    let actorWarehouseIndex;
    let mergedArray = this.holes.slice(0, this.opponentHolesIndex);
    if (actor === Actor.PLAYER) {
      actorWarehouseIndex = mergedArray.length;
      mergedArray.push(this.warehouses[0]);
    }
    mergedArray = mergedArray.concat(
      this.holes.slice(this.opponentHolesIndex, this.holes.length)
    );
    if (actor === Actor.OPPONENT) {
      actorWarehouseIndex = mergedArray.length;
      mergedArray.push(this.warehouses[1]);
    }
    return { mergedArray, actorWarehouseIndex };
  }

  //input: {mergedArray, actor, actorWarehouseIndex}
  divideMergedArray(input) {
    let updatedHoles = [];
    let updatedPlayerHoles = input.mergedArray.slice(
      0,
      input.actorWarehouseIndex
    );
    let updatedOpponentHoles = input.mergedArray.slice(
      input.actorWarehouseIndex + 1,
      input.mergedArray.length
    );
    updatedHoles = updatedPlayerHoles.concat(updatedOpponentHoles);
    const updatedWarehouse = input.mergedArray[input.actorWarehouseIndex];
    return { updatedHoles, updatedWarehouse };
  }
}

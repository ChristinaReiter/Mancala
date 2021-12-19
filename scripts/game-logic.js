class GameLogic {
  initialSeedsPerHole = 4;
  seedsToWin = 24;
  // game against AI --> 1, game against another player 2;
  numberOfPlayers;
  // is it the controlling players turn: true / false
  isPlayersTurn;
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
  // determines if game already has a winner and who it is
  // -1 --> game is active
  // 0 --> player won
  // 1 --> opponent won
  winner;

  // TODO check input for flawed parameters
  constructor(numberOfPlayers, playerStartIndex, numberOfHoles) {
    this.numberOfPlayers = numberOfPlayers;
    this.isPlayersTurn = playerStartIndex === 0 ? true : false;
    this.opponentHolesIndex = numberOfHoles / 2;
    this.holes = new Array(numberOfHoles);
    for (let i = 0; i < this.holes.length; i++) {
      this.holes[i] = this.initialSeedsPerHole;
    }
    this.totalSeeds = numberOfHoles * this.initialSeedsPerHole;
    this.warehouses = new Array(2);
  }

  executePlayerMove(holeIndex) {
    if (!this.isPlayerMoveValid(holeIndex)) return;
    const lastFilledHoleIndex = this.emptyHole(holeIndex);
    if (!lastFilledHoleIndex) return;
    this.moveSeedsToWarehouse(lastFilledHoleIndex, false);
    this.checkGameOver();
    if (winner !== -1) return;
    this.isPlayersTurn = false;
    if (this.numberOfPlayers === 1) this.executeAiMove();
  }

  executeAiMove() {
    if (this.numberOfPlayers !== 1) return;
    if (!this.isOpponentMoveValid(holeIndex)) return;
    const lastFilledHoleIndex = this.emptyHole(holeIndex);
    if (!lastFilledHoleIndex) return;
    this.moveSeedsToWarehouse(lastFilledHoleIndex, true);
    this.checkGameOver();
    if (winner !== -1) return;
    this.isPlayersTurn = true;
  }

  moveSeedsToWarehouse(lastFilledHoleIndex, isOpponent) {
    const lowerIndex = isOpponent ? this.opponentHolesIndex : 0;
    const warehouseIndex = isOpponent ? 1 : 0;
    for (let i = lastFilledHoleIndex; i >= lowerIndex; i--) {
      let seedsFromHole = this.holes[i];
      if (this.canSeedsBeMovedToWarehouse(seedsFromHole)) {
        this.warehouses[warehouseIndex] =
          this.warehouses[warehouseIndex] + seedsFromHole;
        this.holes[i] = 0;
      } else {
        break;
      }
    }
  }

  // empties selected hole, returns index of last filled hole OR null on invalid hole index
  emptyHole(holeIndex) {
    if (holeIndex >= this.holes.lenght || holeIndex < 0) {
      console.warning(
        `emptyHole: called with invalid holeIndex <${holeIndex}>`
      );
      return;
    }
    let holeValue = this.holes[holeIndex];
    if (holeValue <= 0) {
      console.log("emptyHole: hole is empty. will do nothing");
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
    return (holeIndex + holeValue) % this.holes.length;
  }

  isPlayerMoveValid(holeIndex) {
    // check for invalid hole index
    if (holeIndex >= this.opponentHolesIndex || holeIndex < 0) {
      return 0;
    }
    // check if it's the players turn
    if (!isPlayersTurn) return false;
    // check if all of the opponent's holes are empty, if yes check that the move will fill at least one of them
    let totalOpponentSeeds = countSeeds(true);
    if (
      totalOpponentSeeds === 0 &&
      holeIndex + this.holes[holeIndex] < this.opponentHolesIndex
    ) {
      return false;
    }
    // check if the move would take all of the opponent's remaining seeds
    const finalFilledHoleIndex =
      (holeIndex + this.holes[holeIndex]) % this.holes.length;
    let seedsToBeMoved = 0;
    for (let i = finalFilledHoleIndex; i >= this.opponentHolesIndex; i--) {
      let seedsFromHole = this.holes[i] + 1;
      if (this.canSeedsBeMovedToWarehouse(seedsFromHole)) {
        seedsToBeMoved += seedsFromHole;
      } else {
        break;
      }
    }
    if (seedsToBeMoved === totalOpponentSeeds) {
      return false;
    }
  }

  isOpponentMoveValid(holeIndex) {
    // check for invalid hole index
    if (
      holeIndex < this.opponentHolesIndex ||
      holeIndex >= this.holess.length
    ) {
      return 0;
    }
    // check if it's the players turn
    if (isPlayersTurn) return false;
    // check if all of the player's holes are empty, if yes check that the move will fill at least one of them
    let totalPlayerSeeds = countSeeds(false);
    if (
      totalPlayerSeeds === 0 &&
      (holeIndex + this.holes[holeIndex]) % this.holes.length >=
        this.opponentHolesIndex
    ) {
      return false;
    }
    // check if the move would take all of the opponent's remaining seeds
    const finalFilledHoleIndex =
      (holeIndex + this.holes[holeIndex]) % this.holes.length;
    let seedsToBeMoved = 0;
    for (let i = finalFilledHoleIndex; i >= 0; i--) {
      let seedsFromHole = this.holes[i] + 1;
      if (this.canSeedsBeMovedToWarehouse(seedsFromHole)) {
        seedsToBeMoved += seedsFromHole;
      } else {
        break;
      }
    }
    if (seedsToBeMoved === totalPlayerSeeds) {
      return false;
    }
  }

  countSeeds(isOpponent) {
    const lowerIndex = isOpponent ? this.opponentHolesIndex : 0;
    const upperIndex = isOpponent
      ? this.holes.length
      : this.opponentHolesIndex - 1;
    let totalSeeds = 0;
    for (let i = lowerIndex; i <= upperIndex; i++) {
      totalSeeds += this.holes[i];
    }
    return totalSeeds;
  }

  canSeedsBeMovedToWarehouse(value) {
    value === 2 ? true : value === 3 ? true : false;
  }

  checkGameOver() {
    // player has enough seeds in his / her warehouse
    if (warehouse[0] >= this.seedsToWin) {
      winner = 0;
      // opponents has enough seeds in his / her  warehouse
    } else if (warehouse[1] >= this.seedsToWin) {
      winner = 1;
    } else {
      const playerTotalSeeds = this.countSeeds(false);
      const opponentTotalSeeds = this.countSeeds(true);
      let gameIsOver = false;
      // player has no seeds in his holes and opponent can not make any move that would change that
      if (playerTotalSeeds === 0) {
        gameIsOver = true;
        for (let i = 0; i < this.opponentHolesIndex; i++) {
          if (this.isPlayerMoveValid(i)) {
            gameIsOver = false;
            break;
          }
        }
        // opponent has no seeds in his holes and player can not make any move that would change that
      } else if (opponentTotalSeeds === 0) {
        gameIsOver = true;
        for (let i = this.opponentHolesIndex; i < this.holes.length; i++) {
          if (this.isOpponentMoveValid(i)) {
            gameIsOver = false;
            break;
          }
        }
      }
      if (gameIsOver) {
        this.winner = this.warehouses[0] >= this.warehouses[1] ? 0 : 1;
      }
    }
  }
}

module.exports = GameLogic;

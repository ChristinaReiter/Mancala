import { GameStatus } from "../enums/enums.js";
import {
  countSeeds,
  countPotentialSeeds,
  canSeedsBeMovedToWarehouse,
} from "./seed-counting.js";

export function isPlayerMoveValid(
  holeIndex,
  allHoles,
  opponentHolesIndex,
  gameStatus
) {
  // check for invalid hole index
  if (holeIndex >= opponentHolesIndex || holeIndex < 0) {
    return false;
  }
  // check if it's the players turn
  if (gameStatus !== GameStatus.WAITING_FOR_PLAYER) return false;
  // check if all of the opponent's holes are empty, if yes check that the move will fill at least one of them
  let totalOpponentSeeds = countSeeds(true, allHoles, opponentHolesIndex);
  if (totalOpponentSeeds === 0) {
    if (holeIndex + allHoles[holeIndex] < opponentHolesIndex) {
      return false;
    } else {
      return true;
    }
    // check if the move would take all of the opponent's remaining seeds
  } else {
    const finalFilledHoleIndex =
      (holeIndex + allHoles[holeIndex]) % allHoles.length;
    // calculate new total opponent seeds if the move was executed
    let newTotalOpponentSeeds = countPotentialSeeds(
      holeIndex,
      allHoles[holeIndex],
      finalFilledHoleIndex,
      true,
      allHoles,
      opponentHolesIndex
    );
    console.log(
      "should count potential seeds for player move",
      newTotalOpponentSeeds
    );
    let seedsToBeMoved = 0;
    for (let i = finalFilledHoleIndex; i >= opponentHolesIndex; i--) {
      let seedsFromHole = allHoles[i] + 1;
      if (canSeedsBeMovedToWarehouse(seedsFromHole)) {
        seedsToBeMoved += seedsFromHole;
      } else {
        break;
      }
    }
    if (seedsToBeMoved === newTotalOpponentSeeds) {
      console.log(
        `seeds to be moved (${seedsToBeMoved}) are equal to the opponent's potential seeds (${newTotalOpponentSeeds})`
      );
      return false;
    }
    return true;
  }
}

export function isOpponentMoveValid(
  holeIndex,
  allHoles,
  opponentHolesIndex,
  gameStatus
) {
  // check for invalid hole index
  if (holeIndex < opponentHolesIndex || holeIndex >= allHoles.length) {
    return false;
  }
  // check if the hole is empty
  if (allHoles[holeIndex] === 0) return false;
  // check if it's the players turn
  if (gameStatus !== GameStatus.WAITING_FOR_OPPONENT) return false;
  // check if all of the player's holes are empty, if yes check that the move will fill at least one of them
  let totalPlayerSeeds = countSeeds(false, allHoles, opponentHolesIndex);
  if (totalPlayerSeeds === 0) {
    if (
      (holeIndex + allHoles[holeIndex]) % allHoles.length >=
      opponentHolesIndex
    ) {
      return false;
    } else {
      return true;
    }
  } else {
    const finalFilledHoleIndex =
      (holeIndex + allHoles[holeIndex]) % allHoles.length;
    // calculate new total opponent seeds if the move was executed
    let newTotalPlayerSeeds = countPotentialSeeds(
      holeIndex,
      allHoles[holeIndex],
      finalFilledHoleIndex,
      false,
      allHoles,
      opponentHolesIndex
    );
    let seedsToBeMoved = 0;
    for (let i = finalFilledHoleIndex; i >= 0; i--) {
      let seedsFromHole = allHoles[i] + 1;
      console.log(`hole <${i}> would have <${seedsFromHole}> seeds.`);
      if (canSeedsBeMovedToWarehouse(seedsFromHole)) {
        seedsToBeMoved += seedsFromHole;
      } else {
        break;
      }
    }
    if (seedsToBeMoved === newTotalPlayerSeeds) {
      console.log(
        `DEBUG: seeds to be moved (${seedsToBeMoved}) are equal to the other player's potential seeds (${newTotalPlayerSeeds})`
      );
      return false;
    }
    return true;
  }
}

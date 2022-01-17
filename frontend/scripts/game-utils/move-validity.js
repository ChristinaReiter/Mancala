import { GameStatus } from "../enums/enums.js";

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
  // check if the hole is empty
  if (allHoles[holeIndex] === 0) return false;
  // check if it's the player's turn
  if (gameStatus !== GameStatus.WAITING_FOR_PLAYER) {
    return false;
  }
  return true;
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
  // check if it's the opponent's turn
  if (gameStatus !== GameStatus.WAITING_FOR_OPPONENT) {
    return false;
  }
  return true;
}

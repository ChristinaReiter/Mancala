import { isOpponentMoveValid } from "./move-validity.js";

// simple method that finds the first possible move out of a randomly order of the hole indices
// returns hole index or null if no move is possible
// input: {opponentHolesIndex, holes, gameStatus}
export function findRandomAiMove(input) {
  const moveArray = [];
  for (let i = input.opponentHolesIndex; i < input.holes.length; i++) {
    moveArray.push(i);
  }
  const shuffledMoveArray = shuffle(moveArray);
  for (let i = 0; i < shuffledMoveArray.length; i++) {
    const selectedMove = shuffledMoveArray[i];
    console.log(`AI: Testing move <${selectedMove}>.`);
    if (
      isOpponentMoveValid(
        selectedMove,
        input.holes,
        input.opponentHolesIndex,
        input.gameStatus
      )
    ) {
      return selectedMove;
    }
    console.log(`AI: Move <${selectedMove}> is invalid.`);
  }
  return null;
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

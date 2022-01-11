export function countSeeds(isForOpponent, allHoles, opponentHolesIndex) {
  const lowerIndex = isForOpponent ? opponentHolesIndex : 0;
  const upperIndex = isForOpponent
    ? allHoles.length - 1
    : opponentHolesIndex - 1;
  let totalSeeds = 0;
  for (let i = lowerIndex; i <= upperIndex; i++) {
    totalSeeds += allHoles[i];
  }
  return totalSeeds;
}

export function countPotentialSeeds(
  holeIndex,
  amountOfSeeds,
  finalFilledHoleIndex,
  isForOpponent,
  allHoles,
  opponentHolesIndex
) {
  // if the moved seeds stay on the same side, the other's side potential seeds are the actual seeds
  if (isForOpponent && holeIndex + amountOfSeeds < opponentHolesIndex) {
    console.log("DEBUG: player move stayed on the same side of the board");
    return countSeeds(true, allHoles, opponentHolesIndex);
  }
  if (!isForOpponent && holeIndex + amountOfSeeds < allHoles.length) {
    console.log("DEBUG: opponent move stayed on the same side of the board");
    return countSeeds(false, allHoles, opponentHolesIndex);
  }

  const lowerIndex = isForOpponent ? opponentHolesIndex : 0;
  const upperIndex = isForOpponent
    ? allHoles.length - 1
    : opponentHolesIndex - 1;
  let totalSeeds = 0;
  for (let i = lowerIndex; i <= upperIndex; i++) {
    // if the seeds are counted for the opponent, the move would be made by the player
    if (isForOpponent) {
      if (
        // if the finalFilledHoleIndex is smaller than the opponent's first hole, it means that a seed is added to each opponent hole
        finalFilledHoleIndex < opponentHolesIndex ||
        // if the inspected hole index is <= the finalFilledHoleIndex, a seed would be added to it
        i <= finalFilledHoleIndex
      ) {
        totalSeeds += allHoles[i] + 1;
      }
      // else, the current seed count would remain the same
      else {
        totalSeeds += allHoles[i];
      }
      // if the seeds are counted for the player, the move would be made by the opponent
    } else {
      if (
        // if the finalFilledHoleIndex is >= than the opponent's first hole, it means that a seed is added to each player's hole
        finalFilledHoleIndex >= opponentHolesIndex ||
        // if the inspected hole index is <= the finalFilledHoleIndex, a seed would be added to it
        i <= finalFilledHoleIndex
      ) {
        totalSeeds += allHoles[i] + 1;
      } else {
        // else, the current seed count would remain the same
        totalSeeds += allHoles[i];
      }
    }
  }
  return totalSeeds;
}

export function canSeedsBeMovedToWarehouse(value) {
  return value === 2 ? true : value === 3 ? true : false;
}

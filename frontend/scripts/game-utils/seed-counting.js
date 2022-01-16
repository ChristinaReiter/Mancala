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

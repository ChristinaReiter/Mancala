import { Actor } from "../enums/enums.js";

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

// input: {actor, holes, opponentHolesIndex, warehouses}
export function mergeHolesAndWarehouses(input) {
  let actorWarehouseIndex;
  let mergedArray = input.holes.slice(0, input.opponentHolesIndex);
  if (input.actor === Actor.PLAYER) {
    actorWarehouseIndex = mergedArray.length;
    mergedArray.push(input.warehouses[0]);
  }
  mergedArray = mergedArray.concat(
    input.holes.slice(input.opponentHolesIndex, input.holes.length)
  );
  if (input.actor === Actor.OPPONENT) {
    actorWarehouseIndex = mergedArray.length;
    mergedArray.push(input.warehouses[1]);
  }
  return { mergedArray, actorWarehouseIndex };
}

//input: {mergedArray, actor, actorWarehouseIndex}
export function divideMergedArray(input) {
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

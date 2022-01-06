const GameLogic = require("./game-logic");

function testInitialState() {
  console.log("Testing initial game logic state");
  const playerStartIndex = 0;
  const numberOfHoles = 4;
  const expectedNumberOfPlayers = 2;
  const expectedIsMyTurn = true;
  const expectedTotalSeeds = 16;
  const expectedHolesLength = 4;
  const expectedHoleValue = 4;

  const game = new GameLogic(
    expectedNumberOfPlayers,
    playerStartIndex,
    numberOfHoles
  );

  if (game.numberOfPlayers !== expectedNumberOfPlayers) {
    console.error(
      `Number of players should have been <${expectedNumberOfPlayers}> but was <${game.numberOfPlayers}>.`
    );
    return;
  }

  if (game.isMyTurn !== expectedIsMyTurn) {
    console.error(
      `Is my turn should have been <${expectedIsMyTurn}> but was <${game.isMyTurn}>.`
    );
    return;
  }

  if (game.totalSeeds !== expectedTotalSeeds) {
    console.error(
      `Total seeds should have been <${expectedTotalSeeds}> but was <${game.totalSeeds}>.`
    );
    return;
  }

  if (game.holes.length !== expectedHolesLength) {
    console.error(
      `Number of holes should have been <${expectedHolesLength}> but was <${game.holes.length}>.`
    );
    return;
  }

  if (game.holes[0] !== expectedHoleValue) {
    console.error(
      `Holve value should have been <${expectedHoleValue}> but was <${game.holes[0]}>.`
    );
    return;
  }

  console.log(">> test of initial state successful.");
}

function testEmptyHole() {
  console.log("Testing function emptyHole");

  const playerStartIndex = 0;
  const numberOfHoles = 8;
  const numberOfPlayers = 2;

  const game = new GameLogic(numberOfPlayers, playerStartIndex, numberOfHoles);
  game.emptyHole(0);

  if (game.holes[0] !== 0) {
    console.error(
      `Holve value should have been <${0}> but was <${game.holes[0]}>.`
    );
    return;
  }

  if (game.holes[1] !== 5) {
    console.error(
      `Holve value should have been <${5}> but was <${game.holes[1]}>.`
    );
    return;
  }

  if (game.holes[2] !== 5) {
    console.error(
      `Holve value should have been <${5}> but was <${game.holes[2]}>.`
    );
    return;
  }

  if (game.holes[3] !== 5) {
    console.error(
      `Holve value should have been <${5}> but was <${game.holes[3]}>.`
    );
    return;
  }

  if (game.holes[4] !== 5) {
    console.error(
      `Holve value should have been <${5}> but was <${game.holes[4]}>.`
    );
    return;
  }

  if (game.holes[5] !== 4) {
    console.error(
      `Holve value should have been <${4}> but was <${game.holes[5]}>.`
    );
    return;
  }

  console.log(">> test of function empty hole successful.");
}

testInitialState();
testEmptyHole();

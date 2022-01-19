import { GameStatus } from "../enums/enums.js";
import { getCurrentGame } from "../settings.js";
import { getUsername } from "./credentials.js";

function generateUrl(nick, game) {
  return `http://twserver.alunos.dcc.fc.up.pt:8008/update?nick=${nick}&game=${game}`;
}

export function createEventSource(nick, game) {
  const url = generateUrl(nick, game);
  const source = new EventSource(url);
  source.onmessage = (eventInput) => {
    console.log(eventInput);
    const event = JSON.parse(eventInput.data);
    const currentGame = getCurrentGame();
    if (event.board) {
      const result = parseBoardEvent(event);
      currentGame?.updateGameFromEvent(result);
    } else if (event.winner) {
      const result = parseWinnerEvent(event);
      currentGame?.updateWinner(result);
    }
  };
  source.onerror = (error) => console.error("error", error);
  return source;
}

function parseWinnerEvent(event) {
  const username = getUsername();
  let gameStatus =
    event.winner === username
      ? GameStatus.PLAYER_WON
      : event.winner === null
      ? GameStatus.DRAW
      : GameStatus.OPPONENT_WON;
  return gameStatus;
}

function parseBoardEvent(event) {
  const username = getUsername();
  let gameStatus;
  // TODO check that every object that needs to be there exists
  // if not set gameStatus to server error
  gameStatus =
    event.board?.turn === username
      ? GameStatus.WAITING_FOR_PLAYER
      : GameStatus.WAITING_FOR_OPPONENT;
  const sides = event.board.sides;
  let playerWarehouse;
  let playerHoles;
  let opponentWarehouse;
  let opponentHoles;
  for (const [key, value] of Object.entries(sides)) {
    if (key === username) {
      playerWarehouse = value.store;
      playerHoles = value.pits;
    } else {
      opponentWarehouse = value.store;
      opponentHoles = value.pits;
    }
  }
  console.log("gameStatus", gameStatus);
  console.log("playerWarehouse", playerWarehouse);
  console.log("playerHoles", playerHoles);
  console.log("opponentWarehouse", opponentWarehouse);
  console.log("opponentHoles", opponentHoles);
  return {
    gameStatus,
    playerWarehouse,
    playerHoles,
    opponentWarehouse,
    opponentHoles,
  };
}

// TODO remove later
const boardExample = {
  board: {
    turn: "moritz",
    sides: {
      moritz: { store: 0, pits: [5, 5, 5, 5] },
      alex: { store: 0, pits: [5, 5, 5, 5] },
    },
  },
  stores: { moritz: 0, alex: 0 },
};

const winnerExample = {
  winner: "alex",
};

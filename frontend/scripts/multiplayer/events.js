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
    const event = JSON.parse(eventInput.data);
    const currentGame = getCurrentGame();
    if ("board" in event) {
      const result = parseBoardEvent(event);
      currentGame?.updateGameFromEvent(result);
    } else if ("winner" in event) {
      const result = parseWinnerEvent(event, currentGame);
      currentGame?.updateWinnerFromEvent(result);
    }
  };
  source.onerror = (error) => console.error("error", error);
  return source;
}

function parseWinnerEvent(event, currentGame) {
  const username = getUsername();
  if (currentGame.gameStatus === GameStatus.WAITING_FOR_SERVER) {
    return GameStatus.PAIRING_TIMEOUT;
  }
  const gameStatus =
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
  return {
    gameStatus,
    playerWarehouse,
    playerHoles,
    opponentWarehouse,
    opponentHoles,
  };
}

export class PlayStyle {
  static ONLINE = "ONLINE";
  static OFFLINE = "OFFLINE";
}

export class GameStatus {
  static PLAYER_WON = "PLAYER_WON";
  static OPPONENT_WON = "OPPONENT_WON";
  static DRAW = "DRAW";
  static WAITING_FOR_PLAYER = "WAITING_FOR_PLAYER";
  static WAITING_FOR_OPPONENT = "WAITING_FOR_OPPONENT";
  static WAITING_FOR_SERVER = "WAITING_FOR_SERVER";
  static SERVER_ERROR = "SERVER_ERROR";
}

export class Actor {
  static PLAYER = "PLAYER";
  static OPPONENT = "OPPONENT";
}

export class DistributeHoleEvent {
  static IN_OWN_WAREHOUSE = "IN_OWN_WAREHOUSE";
}

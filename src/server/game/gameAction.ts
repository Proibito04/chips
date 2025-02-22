type ActionType =
  | "JOIN"
  | "BET"
  | "FOLD"
  | "CHECK"
  | "RAISE"
  | "LEAVE"
  | "WITHDRAW";

export interface GameAction {
  type: ActionType;
  username: string;
  payload?: any;
}

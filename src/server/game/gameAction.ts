type ActionType =
  | "JOIN"
  | "BET"
  | "FOLD"
  | "CHECK"
  | "RAISE"
  | "LEAVE"
  | "EDIT_BALANCE"
  | "WITHDRAW";

export interface GameAction {
  type: ActionType;
  username: string;
  payload?: any;
}

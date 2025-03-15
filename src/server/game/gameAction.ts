import { ActionType, type MessageClient } from "@shared/sharedTypes";

export interface GameAction {
  type: ActionType;
  username: string;
  payload: MessageClient;
}


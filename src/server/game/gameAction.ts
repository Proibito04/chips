import { ActionType, type MessageClient } from "@shared/sharedTypes";

export interface GameAction {
  type: ActionType;
  username: string;
  payload: MessageClient;
}

export interface MessageBroadcast {
  subject: string; // the name of the player who is doing the action
  type: ActionType;
  payload: MessageClient;
}

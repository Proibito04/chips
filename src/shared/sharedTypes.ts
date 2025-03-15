import type { ServerWebSocket } from "bun";

export enum ActionType {
  JOIN = "JOIN",
  BET = "BET",
  FOLD = "FOLD",
  CHECK = "CHECK",
  RAISE = "RAISE",
  LEAVE = "LEAVE",
  EDIT_BALANCE = "EDIT_BALANCE",
  WITHDRAW = "WITHDRAW",
  TABLE_STATE = "TABLE_STATE",
  ERROR = "ERROR",
}

// Common payloads
export interface EditBalancePayload {
  username: string;
  amount: number;
}

export interface BetPayload {
  amount: number;
}

export interface WithdrawPayload {
  amount: number;
}

export interface ErrorPayload {
  message: string;
  code?: number;
}

export interface JoinPayload {
  ws: ServerWebSocket<{
    username: string;
    table: string;
  }>;
}

export interface TableStatePayload {
  tableId: string | null;
  username: string | null;
  pot: number;
  players: {
    [username: string]: {
      username: string;
      chips: number;
    };
  };
  messages: Message[];
  connected: boolean;
}

// Unified message type for both client and server
export type Message =
  | {
      type: ActionType.TABLE_STATE;
      payload: TableStatePayload;
      subject?: string;
    }
  | {
      type: ActionType.EDIT_BALANCE;
      payload: EditBalancePayload;
      subject?: string;
    }
  | {
      type: ActionType.BET;
      payload: BetPayload;
      subject?: string;
    }
  | {
      type: ActionType.WITHDRAW;
      payload: WithdrawPayload;
      subject?: string;
    }
  | {
      type: ActionType.JOIN;
      payload: JoinPayload;
      subject?: string;
    }
  | {
      type: ActionType.LEAVE;
      payload?: never;
      subject?: string;
    }
  | {
      type: ActionType.FOLD;
      payload?: never;
      subject?: string;
    }
  | {
      type: ActionType.CHECK;
      payload?: never;
      subject?: string;
    }
  | {
      type: ActionType.RAISE;
      payload: BetPayload;
      subject?: string;
    }
  | {
      type: ActionType.ERROR;
      payload: ErrorPayload;
      subject?: string;
    };

// Type guards or utility types can differentiate between client and server messages if needed
export type ClientMessage = Omit<Message, "subject">;
export type ServerMessage = Message & { subject?: string };

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

export type MessageClient =
  | {
      type: ActionType.EDIT_BALANCE;
      payload: EditBalancePayload;
    }
  | {
      type: ActionType.BET;
      payload: BetPayload;
    }
  | {
      type: ActionType.WITHDRAW;
      payload: WithdrawPayload;
    }
  | {
      type: ActionType.JOIN;
      payload: JoinPayload;
    }
  | {
      type: ActionType.LEAVE;
      payload?: never;
    }
  | {
      type: ActionType.ERROR;
      payload: ErrorPayload;
    };

interface EditBalancePayload {
  username: string;
  amount: number;
}

interface BetPayload {
  amount: number;
}

interface WithdrawPayload {
  amount: number;
}

export interface ErrorPayload {
  message: string;
  code?: number; // maybe in the future it will useful
}

interface JoinPayload {
  ws: ServerWebSocket<{
    username: string;
    table: string;
  }>;
}

// ---------------------------------------------------------------------------
// Types of messages sent or received by the server

export type MessageServer =
  | {
      type: ActionType.TABLE_STATE;
      payload: TableStatePayload;
      subject?: string;
    }
  | {
      type: ActionType.EDIT_BALANCE;
      payload: EditBalancePayload;
      subject: string;
    }
  | {
      type: ActionType.BET;
      payload: BetPayload;
      subject: string;
    }
  | {
      type: ActionType.WITHDRAW;
      payload: WithdrawPayload;
      subject: string;
    }
  | {
      type: ActionType.JOIN;
      payload: JoinPayload;
      subject: string;
    }
  | {
      type: ActionType.LEAVE;
      payload?: never;
      subject: string;
    }
  | {
      type: ActionType.FOLD;
      payload?: never;
      subject: string;
    }
  | {
      type: ActionType.CHECK;
      payload?: never;
      subject: string;
    }
  | {
      type: ActionType.RAISE;
      payload: BetPayload;
      subject: string;
    }
  | {
      type: ActionType.ERROR;
      payload: ErrorPayload;
      subject?: string;
    };


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
  messages: MessageServer[];
  connected: boolean;
}

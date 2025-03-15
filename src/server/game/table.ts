import {
  ActionType,
  type MessageClient,
  type MessageServer,
  type TableStatePayload,
} from "@shared/sharedTypes";
import { Player } from "./player";

export class Table {
  private players: Map<string, Player> = new Map();
  private connections: Map<string, WebSocket> = new Map();
  private pot: number = 0;

  constructor(public id: string) {}

  get state(): TableStatePayload {
    return {
      tableId: this.id,
      username: null,
      pot: this.pot,
      players: Object.fromEntries(
        Array.from(this.players.entries()).map(([username, player]) => [
          username,
          player.toStateFormat(),
        ])
      ),
      messages: [], // You might want to maintain a message history in the Table class
      connected: true,
    };
  }
  

  handleAction(action: MessageClient & { username: string }) {
    try {
      switch (action.type) {
        case ActionType.JOIN:
          this.handleJoin(
            action.username,
            action.payload.ws as unknown as WebSocket
          );
          break;

        case ActionType.BET:
          this.handleBet(action.username, action.payload.amount);
          break;

        case ActionType.LEAVE:
          this.handleLeave(action.username);
          break;

        case ActionType.WITHDRAW:
          this.handleWithdraw(action.username, action.payload.amount);
          break;

        case ActionType.EDIT_BALANCE:
          this.handleEditBalance(action.username, action.payload);
          break;

        default:
          throw new Error(`Unknown action type: ${(action as any).type}`);
      }

      // Broadcast the action and updated state
      this.broadcastAction({
        subject: action.username,
        type: ActionType.TABLE_STATE,
        payload:  this.state,
      });
    } catch (error) {
      // todo fix it
      console.error(`Error handling action ${action.type}:`, error);
      // Optionally broadcast error to clients
      this.broadcastAction({
        subject: action.username,
        type: ActionType.ERROR,
        payload: {
          type: ActionType.ERROR,
          payload: {
            message: error as string,
          },
        },
      });
      throw error;
    }
  }

  // Update individual handlers to not broadcast themselves
  handleWithdraw(username: string, amount: number) {
    // Guard against negative amounts
    if (amount <= 0) throw new Error("Withdrawal amount must be positive");

    const player = this.players.get(username);
    if (!player) throw new Error("Player not found");

    player.withdraw(amount);
    this.pot -= amount;
  }

  handleEditBalance(
    username: string,
    payload: { username: string; amount: number }
  ) {
    const player = this.players.get(payload.username);
    if (!player) throw new Error("Player not found");

    player.editBalance(payload.amount);
  }

  handleBet(username: string, amount: number) {
    const player = this.players.get(username);
    if (!player) throw new Error("Player not found");

    if (player.bet(amount)) {
      this.pot += amount;
      return { success: true };
    } else {
      throw new Error("Betting error!");
    }
  }

  handleLeave(username: string) {
    // const player = this.players.get(username);
    // if (!player) throw new Error("Player not found");
    // this.players.delete(username);
    // this.connections.delete(username);
  }

  private handleJoin(username: string, ws: WebSocket) {
    let player = this.players.get(username);

    if (!player) {
      player = new Player(username);
      this.players.set(username, player);
    }

    this.connections.set(username, ws);
  }

  /**
   * Broadcast action to all players
   */
  private broadcastAction(message: MessageServer) {
    const msg = { ...message, ...this.state };
    const messageStr = JSON.stringify(msg);

    for (const ws of this.connections.values()) {
      ws.send(messageStr);
    }
  }
}

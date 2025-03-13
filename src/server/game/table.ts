import type { GameAction } from "./gameAction";
import { Player } from "./player";

export class Table {
  private players: Map<string, Player> = new Map();
  private connections: Map<string, WebSocket> = new Map();
  private pot: number = 0;

  constructor(public id: string) {}

  get state() {
    return {
      players: Object.fromEntries(
        Array.from(this.players.entries()).map(([username, player]) => [
          username,
          player.toStateFormat(),
        ])
      ),
      pot: this.pot,
    };
  }

  handleAction(action: GameAction) {
    switch (action.type) {
      case "JOIN":
        return this.handleJoin(action.username, action.payload.ws);
      case "BET":
        return this.handleBet(action.username, action.payload.amount);
      case "LEAVE":
        return this.handleLeave(action.username);
      case "WITHDRAW":
        return this.handleWithdraw(action.username, action.payload.amount);
      case "EDIT_BALANCE":
        return this.handleEditBalance(action.username, action.payload);
    }
  }

  handleWithdraw(username: string, amount: number) {
    // TODO fix the negative amount
    const player = this.players.get(username);

    if (!player) throw new Error("Player not found");

    player.withdraw(amount);
    this.pot -= amount;

    this.broadcast({
      type: "WITHDRAW",
      payload: { username, amount },
    });
  }

  handleEditBalance(
    username: string,
    payload: { username: string; amount: number }
  ) {
    const player = this.players.get(payload.username);
    if (!player) throw new Error("Player not found");

    player.editBalance(payload.amount);

    this.broadcast({
      type: "EDIT_BALANCE",
      payload: { username: payload.username, amount: payload.amount },
    });
  }


  handleBet(username: string, amount: number) {
    const player = this.players.get(username);

    if (!player) throw new Error("Player not found");

    if (player.bet(amount)) {
      this.pot += amount;

      this.broadcast({
        type: "PLAYER_BET",
        payload: { username, amount },
      });
    } else {
      throw new Error("Betting error!");
    }
  }

  handleLeave(username: any) {
    // throw new Error("Method not implemented.");
  }

  private handleJoin(username: string, ws: WebSocket) {
    let player = this.players.get(username);

    if (!player) {
      player = new Player(username);
      this.players.set(username, player);
    }

    this.connections.set(username, ws);

    ws.send(
      JSON.stringify({
        type: "TABLE_STATE",
        payload: this.state,
      })
    );

    this.broadcast({
      type: "PLAYER_JOINED",
      payload: { username, position: player.position },
    });
  }

  /**
   * Broadcast message to all players and update the state of the table
   *
   */
  private broadcast(message: any) {
    const messageStr = JSON.stringify(message);
    for (const ws of this.connections.values()) {
      ws.send(messageStr);
      ws.send(
        JSON.stringify({
          type: "TABLE_STATE",
          payload: this.state,
        })
      );
    }
  }
}

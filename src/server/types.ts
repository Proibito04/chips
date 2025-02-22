export interface Player {
  username: string;
  chips: number;
  tableId: string | null;
  connected: boolean;
}

export interface Table {
  id: string;
  players: Player[];
  pot: number;
  lastActivity: Date;
  logs: GameLog[];
}

export interface GameLog {
  timestamp: Date;
  type: 'JOIN' | 'LEAVE' | 'BET' | 'TRANSFER';
  player: string;
  amount?: number;
  toPlayer?: string;
}
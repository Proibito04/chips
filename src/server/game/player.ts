enum ActionType {
  "BET",
  "TAKE",
  "EDIT",
}

export class Player {
  private balance: number = 1000;

  private actionHistory: Array<{
    type: ActionType;
    amount: number;
    timestamp: Date;
  }> = [];
  position: any;

  constructor(private username: string) {}

  editBalance(amount: number) {
    this.balance += amount;
  }

  bet(amount: number): boolean {
    if (this.balance < amount) return false;

    this.balance -= amount;
    this.actionHistory.push({
      type: ActionType.BET,
      amount,
      timestamp: new Date(),
    });
    return true;
  }

  withdraw(amount: number){
    this.balance += amount

    this.actionHistory.push({
      type: ActionType.TAKE,
      amount,
      timestamp: new Date(),
    });
  }

  toStateFormat(): {
    username: string;
    chips: number;
  } {
    return {
      username: this.username,
      chips: this.balance,
    };
  }
}

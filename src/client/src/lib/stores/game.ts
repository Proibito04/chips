// stores/game.ts
import { writable } from "svelte/store";

interface GameState {
  tableId: string | null;
  username: string | null;
  pot: number;
  players: {
    [username: string]: {
      username: string;
      chips: number;
    };
  };
  messages: any[];
  connected: boolean;
}

function createGameStore() {
  const { subscribe, set, update } = writable<GameState>({
    tableId: null,
    username: null,
    players: {},
    messages: [],
    connected: false,
    pot: 0,
  });

  let ws: WebSocket | null = null;

  return {
    subscribe,
    connect: (tableId: string, username: string) => {
      ws = new WebSocket(
        `ws://localhost:3000/game?table=${tableId}&username=${username}`,
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const payload = data.payload;
        switch (data.type) {
          case "TABLE_STATE":
            update((state) => {
              const message = state.messages.push(payload);

              return {
                ...state,
                ...payload,
                message,
                connected: true,
              };
            });

            break;

          default:
            // console.log(data.type, "Non so che fare");

            break;
        }
      };

      ws.onopen = () => {
        update((state) => ({ ...state, connected: true }));
      };

      ws.onclose = () => {
        update((state) => ({ ...state, connected: false }));
      };

      update((state) => ({
        ...state,
        tableId,
        username,
      }));
    },

    send: (message: any) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    },

    disconnect: () => {
      if (ws) {
        ws.close();
        ws = null;
      }
      set({
        tableId: null,
        username: null,
        players: {},
        messages: [],
        connected: false,
        pot: 0,
      });
    },
  };
}

export const gameStore = createGameStore();

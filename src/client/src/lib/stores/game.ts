import { writable } from "svelte/store";
import {
  ActionType,
  type MessageClient,
  type MessageServer,
  type TableStatePayload,
} from "@shared/sharedTypes";

function createGameStore() {
  const { subscribe, set, update } = writable<TableStatePayload>({
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
        `ws://192.168.1.105:3000/game?table=${tableId}&username=${username}`,
      );

      // message coming from the server
      ws.onmessage = (event) => {
        const data: MessageServer = JSON.parse(event.data);
        const payload = data.payload;

        switch (data.type) {
          case ActionType.TABLE_STATE:
            update((state) => {
              console.log("table state");
              state = data.payload;
              return state;
            });

            break;

          default:
            console.log("message", data, payload);

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

    send: (message: MessageClient) => {
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

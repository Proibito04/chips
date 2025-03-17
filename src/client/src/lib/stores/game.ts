import { writable } from "svelte/store";
import {
  ActionType,
  type Message,
  type TableStatePayload,
} from "@shared/sharedTypes";
import {  PUBLIC_WEBSOCKET_URL } from '$env/static/public';

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
        `${PUBLIC_WEBSOCKET_URL}/game?table=${tableId}&username=${username}`,
      );

      // message coming from the server
      ws.onmessage = (event) => {
        const data: Message = JSON.parse(event.data);
        const payload = data.payload;

        switch (data.type) {
          case ActionType.TABLE_STATE:
            update((state) => {
              state = data.payload;
              return state;
            });
            break;

          default:
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

    send: (message: Message) => {
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

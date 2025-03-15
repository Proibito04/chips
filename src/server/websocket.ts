import { ActionType } from "@shared/sharedTypes";
import { Table } from "./game/table";

const tables: Map<string, Table> = new Map();

const server = Bun.serve<{ username: string; table: string }, {}>({
  async fetch(req, server) {
    const url = new URL(req.url);
    const tableId = url.searchParams.get("table");
    const username = url.searchParams.get("username");

    // Path
    if (url.pathname === "/game") {
      if (!username) {
        return new Response("Missing parameters", { status: 400 });
      }

      const success = server.upgrade(req, {
        data: { username, table: tableId },
      });

      return success
        ? undefined
        : new Response("WebSocket upgrade error", { status: 400 });
    }

    return new Response("Hello world");
  },
  websocket: {
    open(ws) {
      let table = tables.get(ws.data.table);

      if (!table && ws.data.table) {
        ws.send(JSON.stringify({ type: "ERROR", message: "Table not found" }));
        return;
      }

      if (!table) {
        const id = Math.random().toString(16).slice(2);
        table = new Table(id);
        tables.set(id, table);
        ws.send(JSON.stringify({ type: "TABLE_CREATED", tableId: table.id }));
      }

      table.handleAction({
        type: ActionType.JOIN,
        username: ws.data.username,
        payload: { ws },
      });
    },
    message(ws, message) {
      try {
        const table = tables.get(ws.data.table);
        if (!table) return;

        const action = JSON.parse(message as string);
        table.handleAction({
          ...action,
          username: ws.data.username,
        });
      } catch (error) {
        console.error("Error handling message:", error);
      }
    },
    close(ws) {
      const table = tables.get(ws.data.table);
      if (table) {
        table.handleAction({
          type: ActionType.LEAVE,
          username: ws.data.username,
        });
      }
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

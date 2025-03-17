#!/bin/bash

SERVER_CMD="bun run build"
CLIENT_CMD="bun --bun run build"
PORT=8080

cleanup() {
  echo "Stopping all background processes..."
  pkill -P $$
  exit 1
}

# Trap the interrupt signal (CTRL + C)
trap cleanup SIGINT

pkill -f "$SERVER_CMD"
pkill -f "$CLIENT_CMD"

(
  cd src/server
  $SERVER_CMD 2>&1 | sed 's/^/\x1b[32m[server]\x1b[0m /'
) &

(
  cd src/client
  rm -rf build
  $CLIENT_CMD 2>&1 | sed 's/^/\x1b[33m[client]\x1b[0m /' && 
  echo "running build"
  PORT=$PORT bun ./build/index.js
) &

wait

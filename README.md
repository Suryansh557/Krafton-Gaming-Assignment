# Coin Collector — Authoritative Multiplayer (GitHub-ready)

This repository contains a minimal, **authoritative server** implementation and a simple **browser client** for the "Coin Collector" test.
It demonstrates:
- Server-authoritative state (positions, coins, scoring)
- Clients send only input intents
- Server validates collisions and awards score
- Simulated ~200ms latency (both directions)
- Client interpolation and local prediction for smooth rendering

## Files
- `server.js` — Node.js WebSocket server (authoritative)
- `client.html` — Browser client (open twice to simulate two players)
- `package.json` — Node project file
- `DEMO_SCRIPT.md` — recording checklist & demo steps

## How to run (local)
1. Install Node.js (v14+).
2. Clone or download this folder.
3. Install dependencies:
   ```
   npm install
   ```
4. Start server:
   ```
   npm start
   ```
   Server listens on port 8080 by default.
5. Open `client.html` in two separate browser windows/tabs (or two different machines). If testing locally, open `http://localhost:8080/client.html` via a simple file server or open file directly — the client connects to `ws://localhost:8080`.

> Note: If using direct `file://` to open client.html and WebSocket fails due to cross-origin issues on some browsers, host the client with a simple HTTP server such as:
```
npx http-server .
```
Then open `http://localhost:8080/client.html` (adjust port as needed).

## Demo script (what to record)
1. Start server: `npm start`.
2. Open two browser windows with client.html.
3. Show console logs from server (connections, snapshots).
4. Move player in window A — observe smooth motion on window B despite latency.
5. Show coin spawn and pickup; verify only server updates score.
6. Mention the simulated latency (200ms one-way) and the interpolation buffer on client.

## Design notes & assumptions
- Tick rate: 20 Hz
- Latency: simulated server-side with `setTimeout` on both incoming and outgoing messages to approximate ~200ms one-way.
- Pickup radius: 22 pixels (simple circle collision).
- This is intentionally minimal to keep focus on networking and state-sync principles.

## Extensions & improvements
- Use UDP-like protocol or WebRTC data channels for lower latency.
- Implement sequence-number-based input ack & precise reconciliation.
- Add anti-cheat measures (rate limiting, input validation).
- Add packet loss/jitter simulation and smoothing.

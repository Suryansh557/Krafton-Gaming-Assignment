# Demo Script — Recording Checklist

Goal: Show two connected clients with smooth interpolation despite simulated 200ms latency, and server-authoritative scoring.

1. Open terminal and run:
   - npm install
   - npm start
   Show server starting log.

2. Open two browser windows/tabs with client.html.
   - Wait for 'Ready' status showing client IDs.

3. Move Player A (WASD) while Player B observes.
   - Record how Player B sees smooth movement (no teleport).

4. Spawn and pick up coins:
   - Show that when a coin is collected, only server increments score (verify server console or score display).

5. Mention or show an example of latency:
   - Server uses setTimeout to add ~200ms delay both ways (in code).

6. Optional: Show toggling latency in code and re-run to show difference.

Narration tips:
- Explain authoritative server and why it prevents cheating.
- Briefly describe interpolation buffer and client-side prediction.

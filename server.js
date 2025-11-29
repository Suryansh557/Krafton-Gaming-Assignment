const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

const TICK_RATE = 20; // server ticks per second
const MS_PER_TICK = 1000 / TICK_RATE;
const LATENCY_MS = 200; // simulated one-way latency (both directions)
const MAP_W = 800, MAP_H = 600;

let players = {}; // id -> {id,x,y,lastSeq,score,input}
let coins = [];
let nextCoinId = 1;

function spawnCoin() {
  coins.push({ id: nextCoinId++, x: Math.random()*MAP_W, y: Math.random()*MAP_H });
}
setInterval(spawnCoin, 3000);

function delayedSend(ws, data) {
  const raw = JSON.stringify(data);
  setTimeout(() => {
    try { ws.send(raw); } catch(e) {}
  }, LATENCY_MS + (Math.random()*40 - 20));
}

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).substr(2,9);
  players[id] = { id, x: Math.random()*MAP_W, y: Math.random()*MAP_H, lastSeq:0, score:0, input:{} };
  console.log('[CONNECT]', id);

  delayedSend(ws, { type:'welcome', id, map: {w: MAP_W, h: MAP_H} });

  ws.on('message', (msg) => {
    setTimeout(()=> handleMessage(id, msg), LATENCY_MS + (Math.random()*40 - 20));
  });

  ws.on('close', () => {
    console.log('[DISCONNECT]', id);
    delete players[id];
  });
});

function handleMessage(id, raw) {
  let data;
  try { data = JSON.parse(raw); } catch(e){ return; }
  if (!players[id]) return;
  const p = players[id];
  if (data.type === 'input') {
    if (typeof data.seq === 'number' && data.seq > p.lastSeq) {
      p.lastSeq = data.seq;
      p.input = data.input || {};
      p.inputTimestamp = Date.now();
    }
  }
}

function serverTick(){
  const speed = 160 / TICK_RATE;
  for (const id in players) {
    const p = players[id];
    const i = p.input || {};
    if (i.left) p.x -= speed;
    if (i.right) p.x += speed;
    if (i.up) p.y -= speed;
    if (i.down) p.y += speed;
    p.x = Math.max(0, Math.min(MAP_W, p.x));
    p.y = Math.max(0, Math.min(MAP_H, p.y));
  }

  for (const coin of [...coins]) {
    for (const id in players) {
      const p = players[id];
      const dx = p.x - coin.x, dy = p.y - coin.y;
      if (Math.hypot(dx,dy) < 22) {
        p.score = (p.score||0) + 1;
        coins = coins.filter(c => c.id !== coin.id);
        break;
      }
    }
  }

  const snapshot = {
    type: 'snapshot',
    t: Date.now(),
    players: Object.values(players).map(({id,x,y,score,lastSeq})=>({id,x,y,score,lastSeq})),
    coins
  };
  const raw = JSON.stringify(snapshot);
  wss.clients.forEach(ws => {
    try {
      setTimeout(()=> {
        try { ws.send(raw); } catch(e) {}
      }, LATENCY_MS + (Math.random()*40 - 20));
    } catch(e){}
  });
}

setInterval(serverTick, MS_PER_TICK);

console.log('Server running on port', PORT);

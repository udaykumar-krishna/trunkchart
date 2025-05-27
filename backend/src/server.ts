import app from './app';
import http from 'http';
import WebSocket from 'ws';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const clients: Set<WebSocket> = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());

        if (data.type === 'dm') {
            clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'dm', message: data.message }));
                }
            })
        }
    });

    ws.on('close', () => clients.delete(ws));
})

server.listen(PORT, () => {
  console.log(`Server (HTTP + WebSocket) running on http://localhost:${PORT}`);
});

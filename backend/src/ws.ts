import WebSocket from "ws";


const wss = new WebSocket.Server({ port: 8080 });
const clients: Set<WebSocket>  = new Set();

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

console.log('WebSocket server running on ws://localhost:8080');
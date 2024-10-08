import WebSocket, { Server } from 'ws';

const wss: Server = new WebSocket.Server({ port: 3000 });
const clients: Set<WebSocket> = new Set();

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    clients.add(ws);

    ws.on('message', (message: WebSocket.Data) => {
        try {
            // Parse the message (assuming it's a JSON string)
            const parsedMessage = JSON.parse(message.toString());
            const { username, message: text } = parsedMessage;

            // Format the message as `username: message`
            const broadcastMessage = `${username}: ${text}`;
            console.log('Received:', broadcastMessage);

            // Broadcast the formatted message to all clients
            for (const client of clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(broadcastMessage); // Send formatted message
                }
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

console.log('WebSocket server running on ws://localhost:3000');

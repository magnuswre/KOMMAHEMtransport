"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
// Create a new WebSocket server
var wss = new ws_1.default.Server({ port: 3000 });
var clients = new Set(); // Keep track of all connected clients
wss.on('connection', function (ws) {
    console.log('Client connected');
    clients.add(ws); // Add the new client to the set of connected clients
    ws.on('message', function (message) {
        console.log('Received:', message);
        // Broadcast the message to all connected clients
        for (var _i = 0, clients_1 = clients; _i < clients_1.length; _i++) {
            var client = clients_1[_i];
            if (client.readyState === ws_1.default.OPEN) { // Ensure the client is open
                // Send the message as a string
                client.send(message.toString()); // Ensure it is sent as a string
            }
        }
    });
    ws.on('close', function () {
        console.log('Client disconnected');
        clients.delete(ws); // Remove the client from the set when it disconnects
    });
});
console.log('WebSocket server running on ws://localhost:3000');

import { wss } from "../app";

export const initializeWs = () => {
    wss.on("connection", (ws: WebSocket) => {
        console.log("New client authenticated and connected");

        wss.on("message", (message: string) => {
            console.log(`Message received: ${message}`);
            ws.send(`Message sent: ${message}`);
        });

        wss.on("close", () => {
            console.log("Client has disconnected");
        });
    });
}

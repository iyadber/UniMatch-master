import { WebSocketServer, WebSocket as WS } from 'ws';
import { Server } from 'http';

interface WebSocketMessage<T = unknown> {
  type: string;
  data: T;
}

class WebSocketHandler {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WS> = new Map();
  private connectionCount = 0;
  private maxLoggedConnections = 5;

  initialize(server: Server): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WS) => {
      this.connectionCount++;
      
      // Only log first few connections to avoid console spam
      if (this.connectionCount <= this.maxLoggedConnections) {
        console.log(`WebSocket connection #${this.connectionCount}`);
      } else if (this.connectionCount % 50 === 0) {
        // Log occasionally for monitoring purposes
        console.log(`WebSocket connections: ${this.connectionCount}`);
      }

      ws.on('message', (message: WS.Data) => {
        try {
          const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
          this.handleMessage(ws, parsedMessage);
        } catch (error) {
          console.error('Error handling message:', error instanceof Error ? error.message : 'Unknown error');
        }
      });

      ws.on('close', () => {
        this.connectionCount = Math.max(0, this.connectionCount - 1);
        
        // Remove client from the map when they disconnect
        for (const [userId, client] of this.clients.entries()) {
          if (client === ws) {
            this.clients.delete(userId);
            break;
          }
        }
      });
    });
  }

  private handleMessage(ws: WS, message: WebSocketMessage): void {
    if (message.type === 'authenticate' && typeof message.data === 'string') {
      this.clients.set(message.data, ws);
    }
  }

  broadcastMessage<T>(message: T): void {
    if (!this.wss) return;

    const messageStr = JSON.stringify(message);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WS.OPEN) {
        client.send(messageStr);
      }
    });
  }

  sendToUser<T>(userId: string, message: T): void {
    const client = this.clients.get(userId);
    if (client?.readyState === WS.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

export const wsHandler = new WebSocketHandler(); 
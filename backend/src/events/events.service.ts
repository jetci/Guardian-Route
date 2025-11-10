import { Injectable } from '@nestjs/common';
import { Response } from 'express';

interface Client {
  id: string;
  response: Response;
}

@Injectable()
export class EventsService {
  private clients: Map<string, Client> = new Map();

  subscribe(clientId: string, response: Response): void {
    this.clients.set(clientId, { id: clientId, response });

    // Send initial connection message
    this.sendToClient(clientId, 'connected', { message: 'Connected to resource events' });

    // Remove client on connection close
    response.on('close', () => {
      this.clients.delete(clientId);
    });
  }

  sendEvent(event: string, data: any): void {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

    this.clients.forEach((client) => {
      try {
        client.response.write(message);
      } catch (error) {
        // Remove client if write fails
        this.clients.delete(client.id);
      }
    });
  }

  private sendToClient(clientId: string, event: string, data: any): void {
    const client = this.clients.get(clientId);
    if (client) {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      try {
        client.response.write(message);
      } catch (error) {
        this.clients.delete(clientId);
      }
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

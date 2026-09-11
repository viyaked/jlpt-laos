import type { Response } from 'express';

const clients = new Set<Response>();

export function registerSSEClient(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  clients.add(res);

  // Send initial handshake
  res.write(`event: connected\ndata: ${JSON.stringify({ time: new Date().toISOString() })}\n\n`);

  res.on('close', () => {
    clients.delete(res);
  });
}

export function broadcastEvent(event: string, data: any = {}) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.write(message);
    } catch (err) {
      clients.delete(client);
    }
  }
}

// Keep-alive heartbeat every 25 seconds
setInterval(() => {
  for (const client of clients) {
    try {
      client.write(': keep-alive\n\n');
    } catch {
      clients.delete(client);
    }
  }
}, 25000);

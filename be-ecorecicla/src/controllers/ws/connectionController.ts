import type { Request } from 'express';
import { WebSocket } from 'ws';

const connections = new Map<string, WebSocket>();

export const handleWSConnection = (ws: WebSocket, req: Request) => {
    const params = req.params as { barcode?: string };

    if (!params.barcode) {
        ws.close(1008, 'Falta barcode');
        return;
    }
    
    const barcode = params.barcode;
    try {

        console.log(`📲 Usuario conectado por WS: ${barcode}`);
        connections.set(barcode, ws);

        ws.on('message', (msg) => {
            console.log(`💬 Mensaje de ${barcode}:`, msg.toString());
        });

        ws.on('close', () => {
            console.log(`❌ Usuario desconectado: ${barcode}`);
            connections.delete(barcode);
        });
    } catch (error) {

    }
};

export const sendToUser = (usuario_id: string, data: object) => {
    const ws = connections.get(usuario_id);
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(data));
        return true;
    }
    return false;
};

export const isUserConnected = (usuario_id: string) => {
    return connections.has(usuario_id);
};
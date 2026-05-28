import type { NextFunction, Request, Response } from 'express';

const authApi = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Falta el header Authorization' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        if (token !== process.env.API_TOKEN) {
            return res.status(404).json({ error: 'No autorizado' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

export default authApi;

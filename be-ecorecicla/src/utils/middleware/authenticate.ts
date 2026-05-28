import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaclient';

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Falta el header Authorization' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; email: string; roleId: number };

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            },
            include: {
                role: true,
                userban: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado en la base de datos' });
        }

        if (user.userban) {
            const now = new Date();
            const isPermanentBan = user.userban.until === null;
            const isStillBanned = isPermanentBan || (user.userban.until && user.userban.until > now);

            if (isStillBanned) {
                return res.status(403).json({ error: 'Usuario baneado', reason: user.userban.reason });
            }
        }

        // Inyectar el usuario en la request
        req.user = {
            id: user.id,
            barcode: user.barcode,
            email: user.email,
            role: user.role.name,
            isAdmin: user.role.name === 'ADMIN'
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

export default authenticate;

import type { Request, Response } from 'express';
import { prisma } from '../utils/prismaclient';

export const getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                name: true,
                picture: {
                    select: {
                        url: true
                    }
                }
            }
        })

        if (user) {
            return res.status(200).json({ user });
        }

        return res.status(400).json({ error: "No se ha podido encontrar el perfil" });
    } catch (error) {
        return res.status(400).json({ error: "No se ha podido encontrar el perfil" });
    }
}

export const getMyProfile = async (req: Request, res: Response): Promise<any> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                name: true,
                money: true,
                totalPoints: true,
                picture: {
                    select: {
                        url: true
                    }
                }
            }
        })

        if (user) {
            return res.status(200).json({ user });
        }

        return res.status(400).json({ error: "No se ha podido encontrar el perfil" });
    } catch (error) {
        return res.status(400).json({ error: "No se ha podido encontrar el perfil" });
    }
}
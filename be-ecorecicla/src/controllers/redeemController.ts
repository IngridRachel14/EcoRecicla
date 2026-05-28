import type { Request, Response } from 'express';
import { prisma } from '../utils/prismaclient';

interface RedeemProductRequest {
    userId: number;
    productId: number;
    quantity?: number;
}

export const redeemProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { productId, quantity = 1 }: RedeemProductRequest = req.body;

        if (!productId) {
            return res.status(400).json({
                error: 'productId son requeridos'
            });
        }

        const userId = req.user.id
        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    totalPoints: true,
                    name: true,
                    email: true
                }
            });

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const product = await tx.product.findUnique({
                where: { id: productId },
                select: {
                    id: true,
                    name: true,
                    price: true,
                    units: true,
                    descr: true
                }
            });

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            if (product.units < quantity) {
                throw new Error(`Stock insuficiente. Disponible: ${product.units}, Solicitado: ${quantity}`);
            }

            const totalCost = product.price * quantity;

            if (user.totalPoints < totalCost) {
                throw new Error(`Puntos insuficientes. Tienes: ${user.totalPoints}, Necesitas: ${totalCost}`);
            }

            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    totalPoints: {
                        decrement: totalCost
                    }
                }
            });

            await tx.product.update({
                where: { id: productId },
                data: {
                    units: {
                        decrement: quantity
                    }
                }
            });

            const redemption = await tx.productRedemption.create({
                data: {
                    userId: userId,
                    productId: productId,
                    quantity,
                    pointsUsed: totalCost,
                    claimedAt: new Date(),
                    delivered: false
                }
            });


            return {
                redemption,
                user: updatedUser,
                product,
                quantity,
                totalCost,
                remainingPoints: updatedUser.totalPoints
            };
        });

        return res.status(200).json({
            success: true,
            message: 'Producto canjeado exitosamente',
            data: {
                redemptionId: result.redemption.id,
                productName: result.product.name,
                quantity: result.quantity,
                pointsUsed: result.totalCost,
                remainingPoints: result.remainingPoints,
                claimedAt: result.redemption.claimedAt
            }
        });

    } catch (error: any) {
        console.error('Error al canjear producto:', error);

        // Manejar errores específicos
        if (error.message.includes('no encontrado') ||
            error.message.includes('insuficiente') ||
            error.message.includes('Puntos insuficientes')) {
            return res.status(400).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: 'Error interno del servidor al procesar el canje'
        });
    }
};

export const getUserRedemptions = async (req: Request, res: Response): Promise<any> => {
    try {
        const redemptions = await prisma.productRedemption.findMany({
            where: { userId: req.user.id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        descr: true,
                        image: {
                            select: { url: true },
                            take: 1
                        }
                    }
                }
            },
            orderBy: {
                claimedAt: 'desc'
            }
        });


        return res.status(200).json({
            success: true,
            redemptions: redemptions.map(redemption => ({
                id: redemption.id,
                productId: redemption.productId,
                productName: redemption.product.name,
                description: redemption.product.descr,
                image: redemption.product.image?.[0]?.url || null,
                claimedAt: redemption.claimedAt,
                delivered: redemption.delivered,
                quantity: redemption.quantity,
                pointsUsed: redemption.pointsUsed
            }))
        });

    } catch (error) {
        console.error('Error al obtener historial de canjes:', error);
        return res.status(500).json({
            error: 'No se pudo obtener el historial de canjes'
        });
    }
};

export const markRedemptionAsDelivered = async (req: Request, res: Response): Promise<any> => {
    try {
        const { redemptionId } = req.params;

        if (!redemptionId) {
            return res.status(400).json({ error: 'redemptionId es requerido' });
        }

        const updatedRedemption = await prisma.productRedemption.update({
            where: { id: parseInt(redemptionId) },
            data: { delivered: true }
        });

        return res.status(200).json({
            success: true,
            message: 'Canje marcado como entregado',
            redemption: updatedRedemption
        });

    } catch (error) {
        console.error('Error al marcar canje como entregado:', error);
        return res.status(500).json({
            error: 'No se pudo actualizar el estado del canje'
        });
    }
};

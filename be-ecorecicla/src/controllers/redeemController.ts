import type { Request, Response } from 'express';
import { prisma } from '../utils/prismaclient';
import { sendMail } from "../utils/mailclient";

interface RedeemProductRequest {
    userId: number;
    productId: number;
    quantity?: number;
}

function escapeHtml(value: string | null | undefined): string {
    return (value ?? "").replace(/[&<>"']/g, (char) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
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
                userName: user.name,
                userEmail: user.email,
                product,
                quantity,
                totalCost,
                remainingPoints: updatedUser.totalPoints
            };
        });

        try {
    const fechaCanje = new Date(result.redemption.claimedAt).toLocaleString(
        "es-PA",
        {
            dateStyle: "long",
            timeStyle: "short",
            timeZone: "America/Panama"
        }
    );

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #263238; line-height: 1.6;">
            <div style="text-align: center; padding: 24px 16px; background-color: #e8f5e9; border-radius: 12px;">
              <img
                 src="https://res.cloudinary.com/dspzioalk/image/upload/Eco-recicla-panam%C3%A1_hwcrck.png"
                 alt="Logo de EcoRecicla"
                 width="180"
                style="display: block; width: 180px; max-width: 100%; height: auto; margin: 0 auto 16px;"
              />
                <h1 style="color: #218838; margin-bottom: 8px;">¡Felicidades, ${escapeHtml(result.userName)}!</h1>
                <p style="margin: 0;">Tu canje en EcoRecicla se ha realizado correctamente.</p>
            </div>

            <div style="padding: 20px 8px;">
                <p>Gracias por formar parte de EcoRecicla y contribuir al reciclaje. Estos son los detalles de tu canje:</p>

                <div style="background-color: #f7f9f7; padding: 18px; border-radius: 10px;">
                    <p><strong>Producto:</strong> ${escapeHtml(result.product.name)}</p>
                    <p><strong>Cantidad:</strong> ${result.quantity}</p>
                    <p><strong>Puntos utilizados:</strong> ${result.totalCost}</p>
                    <p><strong>Puntos restantes:</strong> ${result.remainingPoints}</p>
                    <p><strong>Fecha del canje:</strong> ${fechaCanje}</p>
                    <p><strong>Número de canje:</strong> ${result.redemption.id}</p>
                </div>

                <p>¡Sigue reciclando, acumulando puntos y disfrutando de nuevas recompensas!</p>

                <p style="color: #607d68; font-size: 12px; text-align: center;">
                    Este es un correo automático de EcoRecicla. Conserva este mensaje como comprobante de tu canje.
                </p>
            </div>
        </div>
    `;

    await sendMail(
        result.userEmail,
        "¡Tu canje en EcoRecicla fue exitoso!",
        html
    );
} catch (emailError) {
    console.error(
        "El canje se completó, pero no se pudo enviar el correo de confirmación:",
        emailError
    );
}

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

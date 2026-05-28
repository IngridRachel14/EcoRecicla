import type { Request, Response } from "express";
import { isUserConnected, sendToUser } from "../ws/connectionController";
import { getScannedCode, getScannedtrans, setScannedCode, setScannedtrans } from "../../utils/cacheCodes";
import { prisma } from "../../utils/prismaclient";
import path from 'path';

export const getBarcodeScan = async (req: Request, res: Response): Promise<any> => {
    const { barcode } = req.params;
    if (!barcode) {
        return res.status(400).json({ message: 'CÃ³digo de barras (barcode) es requerido' });
    }

    try {
        if (getScannedCode() !== '') {
            setScannedCode('')
        } else {
            return res.status(409).json({ message: 'El cÃ³digo ya fue escaneado anteriormente' });
        }

        if (isUserConnected(barcode)) {
            const user = await prisma.user.findFirst({
                where: {
                    barcode
                }
            })

            if (user) {
                const trans = await prisma.transaction.create({
                    data: {
                        userId: user.id
                    }
                })

                setScannedtrans(trans.id)

                const sent = sendToUser(barcode, {
                    event: 'redirect',
                    payload: {
                        redirectTo: '/(authorized)/scanner',
                    },
                });

                if (sent) {
                    res.send(`âœ… Mensaje enviado a ${barcode}`);
                }
            } else {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        } else {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteBarcodeScan = async (req: Request, res: Response): Promise<any> => {
    const { barcode } = req.params;

    if (!barcode) {
        return res.status(400).json({ message: 'Codigo de barras (barcode) es requerido' });
    }

    try {
        if (getScannedCode() == barcode) {
            setScannedCode('')
        } else {
            return res.status(409).json({ message: 'El codigo no se encuentra' });
        }

        if (isUserConnected(barcode)) {
            const sent = sendToUser(barcode, {
                event: 'delete',
                payload: {
                    redirectTo: '/(authorized)/(tabs)',
                },
            });

            if (sent) {
                res.send(`Mensaje enviado a ${barcode}`);
            } else {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const cancelScan = async (req: Request, res: Response): Promise<any> => {
    try {
        if (getScannedCode() == req.user.barcode) {
            setScannedCode('')
            const sent = sendToUser(req.user.barcode, {
                event: 'cancel_transaction',
                payload: {
                    redirectTo: '/(authorized)/(tabs)',
                },
            });
            if (sent) {
                await prisma.transaction.update({
                    where: {
                        id: getScannedtrans()
                    },
                    data: {
                        completed: true
                    }
                })
                setScannedCode('')
                return res.status(200).json({ message: `CÃ³digo ${req.user.barcode} eliminado correctamente` });
            } else {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        } else {
            return res.status(404).json({ message: 'CÃ³digo no encontrado' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const cancelScanError = async (req: Request, res: Response): Promise<any> => {
    try {
        await prisma.transaction.update({
            where: {
                id: getScannedtrans()
            },
            data: {
                completed: true
            }
        })
        setScannedCode('')
        return res.status(200).json({ message: `transaccion terminada` });

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const verifyMachine = async (req: Request, res: Response): Promise<any> => {
    const { barcode } = req.params;

    if (!barcode) {
        return res.status(400).json({ message: 'CÃ³digo de barras (barcode) es requerido' });
    }

    if (getScannedCode() == barcode) {
        return res.status(200).json({ message: true });
    } else {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const verifyImage = async (req: Request, res: Response): Promise<any> => {
    const { description, valid, bottle } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }

    const imageRecord = await prisma.itemScanned.create({
        data: {
            valid: Boolean(valid),
            bottle: Number(bottle),
            description: description,
            transactionId: getScannedtrans(),
            url: `/temp/${file.filename}`
        }
    });

    return res.status(201).json({
        message: imageRecord
    })
}

export const getImagesByTransaction = async (req: Request, res: Response): Promise<any> => {
    try {
        const images = await prisma.itemScanned.findMany({
            where: { transactionId: getScannedtrans() },
            select: { id: true, url: true, description: true, createdAt: true, bottle: true, valid: true },
        });


        const imagesConUrlPublica = images.map(img => {
            const fileName = path.basename(img.url);
            return {
                ...img,
                url: `https://api.sakuraocean.app/uploads/${fileName}`,
            };
        });
        
        return res.status(200).json({ images: imagesConUrlPublica });
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener imÃ¡genes' });
    }
}

export const getTransactionHistory = async (req: Request, res: Response): Promise<any> => {
    const userId = req.user.id;

    const transactions = await prisma.transaction.findMany({
        where: { userId, completed: true },
        orderBy: { createdAt: 'desc' },
        include: {
            itemscanned: true
        }
    });

    const result = transactions.map(tx => ({
        id: tx.id,
        createdAt: tx.createdAt,
        totalPoints: tx.totalPoints,
        items: tx.itemscanned.map(img => ({
            ...img,
            url: `https://api.sakuraocean.app/uploads/${path.basename(img.url)}`
        }))
    }));

    res.status(200).json({ transactions: result });
};

export const completeTransaction = async (req: Request, res: Response): Promise<any> => {
    try {
        const transactionId = getScannedtrans();

        if (!transactionId) {
            return res.status(400).json({ message: 'transactionId no válido' });
        }

        const scannedItems = await prisma.itemScanned.findMany({
            where: {
                transactionId,
                valid: true
            }
        });

        const totalPoints = scannedItems.reduce((acc, item) => acc + (item.bottle * 10), 0);

        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            select: { userId: true }
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        await prisma.user.update({
            where: { id: transaction.userId },
            data: {
                totalPoints: { increment: totalPoints }
            }
        });

        const updatedTransaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                completed: true,
                totalPoints
            }
        });

        const user = await prisma.user.findFirst({
            where: {
                transactions: {
                    some: {
                        id: transactionId
                    }
                }
            },
            select: {
                barcode: true
            }
        });


        sendToUser(user.barcode, {
            event: 'redirect',
            payload: {
                redirectTo: '/(authorized)/(tabs)',
            },
        });

        return res.status(200).json({
            message: 'Transacción completada',
            totalPoints: updatedTransaction.totalPoints
        });

    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor', error });
    }
};
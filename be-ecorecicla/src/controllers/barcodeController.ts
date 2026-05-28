import type { Request, Response } from "express";
import BwipJs from "bwip-js/node";
import { prisma } from "../utils/prismaclient";

export const getBarcode = async (req: Request, res: Response): Promise<any> => {
    try {
        const barcodeBuffer = await BwipJs.toBuffer({
            bcid: 'qrcode',
            text: req.user.barcode,
            scale: 6,
            textxalign: 'center',
        });

        res.set('Content-Type', 'image/png');
        res.send(barcodeBuffer);
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const readBarcode = async (req: Request, res: Response): Promise<any> => {
    try {
        const { uuid } = req.params;
        const user = await prisma.user.findUnique({
            select: {
                id: true,
                name: true,
                picture: {
                    select: {
                        url: true
                    }
                }
            },
            where: {
                barcode: uuid
            }
        })
        if (!user) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


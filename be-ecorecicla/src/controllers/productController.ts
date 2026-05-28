import type { Request, Response } from 'express';
import { prisma } from '../utils/prismaclient';
import { generateSignedCloudFrontUrl } from '../utils/s3client';
import type { Product, Image } from '@prisma/client';

export const getProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        image: true,
      },
    });

    const productsWithImageUrls = await Promise.all(
      products.map(async (product: Product & { image: Image[] }) => {
        const imagesWithUrls = await Promise.all(
          product.image.map(async (image: Image) => ({
            url: generateSignedCloudFrontUrl(image.url),
          }))
        );

        const { image, ...productData } = product;

        return {
          ...productData,
          images: imagesWithUrls,
        };
      })
    );

    return res.status(200).json({ products: productsWithImageUrls });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'No se pudo obtener los productos' });
  }
};


import type { Request, Response } from 'express';
import { prisma } from '../utils/prismaclient';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import type { Product, Image } from '@prisma/client';

export const getProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const products = await prisma.product.findMany({
      include: { image: true },
    });

    const result = products.map((product: Product & { image: Image[] }) => {
      const { image, ...productData } = product;
      return {
        ...productData,
        images: image.map((img: Image) => ({ url: img.url })),
      };
    });

    return res.status(200).json({ products: result });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ error: 'No se pudo obtener los productos' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, descr, units, price } = req.body;

    if (!name || !descr || !units || !price) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        descr,
        units: Number(units),
        price: Number(price),
      }
    });

    return res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ error: 'No se pudo crear el producto' });
  }
};

export const uploadProductImage = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    const imageUrl = await uploadImageToCloudinary(
      file.buffer,
      file.mimetype,
      'products'
    );

    const image = await prisma.image.create({
      data: {
        url: imageUrl,
        productId: parseInt(productId as string),
      }
    });

    return res.status(201).json({ success: true, image });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return res.status(500).json({ error: 'No se pudo subir la imagen' });
  }
};
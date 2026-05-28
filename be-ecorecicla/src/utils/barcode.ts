import { prisma } from "./prismaclient";

export async function generateUniqueBarcode(): Promise<string> {
  let barcode: string;

  do {
    barcode = Array.from({ length: 22 }, () => Math.floor(Math.random() * 10)).join('');
  } while (await prisma.user.findUnique({ where: { barcode } }));

  return barcode;
}


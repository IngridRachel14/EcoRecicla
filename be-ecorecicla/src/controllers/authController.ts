import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { prisma } from "../utils/prismaclient";
import Bun from 'bun'
import { sendMail } from "../utils/mailclient";
import { generateUniqueBarcode } from "../utils/barcode";

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, name, referralCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: 'El usuario ya está registrado' });
    }

    let referredByUser = null;

    if (referralCode) {
      referredByUser = await prisma.user.findUnique({
        where: { referralCode }
      });

      if (!referredByUser) {
        return res.status(400).json({ error: 'Código de referido inválido' });
      }
    }

    const hashedPassword = await Bun.password.hash(password, {
      algorithm: "bcrypt"
    });

    const barcode = await generateUniqueBarcode();

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roleId: 1,
        pictureId: 1,
        referredById: referredByUser?.id,
        barcode
      }
    });

    return res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await Bun.password.verify(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        name: user.name,
        barcode: user.barcode
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d',
      }
    );

    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    }
  });

  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
  const subject = 'Recuperación de contraseña';

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Recuperación de contraseña</h2>
      <p>Hola ${user.name || ''},</p>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón:</p>
      <a href="${resetLink}" style="
        display: inline-block;
        padding: 10px 20px;
        margin: 10px 0;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      ">Restablecer contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste esto, puedes ignorar este correo.</p>
      <p>Saludos,<br>Equipo de soporte</p>
    </div>
  `;

  try {
    await sendMail(user.email, subject, html);
    return res.status(200).json({ message: 'Token enviado por correo' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.params
  const { password } = req.body

  const tokenRecord = await prisma.passwordResetToken.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() }
    },
    include: { user: true }
  })

  if (!tokenRecord) {
    return res.status(400).json({ message: 'Token inválido o expirado' })
  }
  if (!password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt"
  });

  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { password: hashedPassword }
  })

  await prisma.passwordResetToken.delete({
    where: { id: tokenRecord.id }
  })

  return res.status(200).json({ message: 'Contraseña actualizada con éxito' })
}

export const validateToken = async (req: Request, res: Response): Promise<any> => {
  return res.status(200).json({ valid: true });
}

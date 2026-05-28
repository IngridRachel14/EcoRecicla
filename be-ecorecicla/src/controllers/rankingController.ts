import type { Request, Response } from 'express';
import { prisma } from "../utils/prismaclient";

export const getLeaderboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.id;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        transactions: {
          where: { completed: true },
          select: { totalPoints: true }
        }
      }
    });

    const userScores = users.map(user => {
      const totalPoints = user.transactions.reduce(
        (acc, tx) => acc + (tx.totalPoints ?? 0),
        0
      );
      return {
        id: user.id,
        name: user.name,
        totalPoints
      };
    });

    const sorted = userScores.sort((a, b) => b.totalPoints - a.totalPoints);

    const top10 = sorted.slice(0, 10);

    const currentUserIndex = sorted.findIndex(u => u.id === currentUserId);
    const currentUser = sorted[currentUserIndex];

    return res.status(200).json({
      top10,
      currentUser: {
        id: currentUser?.id,
        name: currentUser?.name,
        totalPoints: currentUser?.totalPoints ?? 0,
        rank: currentUserIndex >= 0 ? currentUserIndex + 1 : null
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al generar ranking' });
  }
};


import type { Request, Response } from 'express';
import { prisma } from "../utils/prismaclient";

export const getLeaderboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.id;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        totalPoints: true,
        transactions: {
          where: {
            completed: true
          },
          select: {
            itemscanned: {
              where: {
                valid: true
              },
              select: {
                bottle: true
              }
            }
          }
        }
      }
    });

    const sorted = users
      .map(user => ({
        id: user.id,
        name: user.name,
        totalPoints: user.totalPoints,
        totalBottles: user.transactions.reduce(
          (total, transaction) =>
            total +
            transaction.itemscanned.reduce(
              (sum, item) => sum + Number(item.bottle || 0),
              0
            ),
          0
        )
      }))
      .sort((a, b) =>
        b.totalBottles - a.totalBottles ||
        b.id - a.id
      );

    const top10 = sorted.slice(0, 10);

    const currentUserIndex = sorted.findIndex(
      user => user.id === currentUserId
    );

    const currentUser = sorted[currentUserIndex];

    return res.status(200).json({
      top10,
      currentUser: {
        id: currentUser?.id,
        name: currentUser?.name,
        totalPoints: currentUser?.totalPoints ?? 0,
        totalBottles: currentUser?.totalBottles ?? 0,
        rank: currentUserIndex >= 0 ? currentUserIndex + 1 : null
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al generar ranking'
    });
  }
};

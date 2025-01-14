// adminController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AdminController {
  public async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const [userCount, movieCount, movieListCount] = await Promise.all([
        prisma.user.count(),
        prisma.movie.count(),
        prisma.movieList.count(),
      ]);

      const metrics = {
        totalUsers: {
          title: "Toplam Kullanıcı",
          value: userCount,
          description: "Hedef: 100 kullanıcı",
        },
        totalMovies: {
          title: "Toplam Film",
          value: movieCount,
          description: "Aylık film ekleme hedefi: 50",
        },
        totalMovieLists: {
          title: "Toplam Film Listesi",
          value: movieListCount,
          description: "Aylık film ekleme hedefi: 50",
        },
      };

      res.status(200).json({ metrics });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

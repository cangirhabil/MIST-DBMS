// src/controllers/movieController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MovieController {
async searchMoviesByName(req: Request, res: Response) {
    try {
        const { name } = req.query;

        const movies = await prisma.movie.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: name as string,
                            mode: "insensitive",
                        },
                    },
                    {
                        title: {
                            startsWith: name as string,
                            mode: "insensitive",
                        },
                    },
                    {
                        title: {
                            endsWith: name as string,
                            mode: "insensitive",
                        },
                    }
                ]
            },
            include: {
                genres: true,
            },
        });

        res.json(movies);
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
}

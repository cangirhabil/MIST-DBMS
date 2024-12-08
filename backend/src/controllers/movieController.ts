// src/controllers/movieController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MovieController {
  async getAllMovies(req: Request, res: Response) {
    try {
      const movies = await prisma.movie.findMany({
        include: {
          genres: true,
        },
      });
      res.json(movies);
    } catch (error) {
      res
        .status(500)
        .json({
          error: error instanceof Error ? error.message : "Unknown error",
        });
    }
  }

  async createMovie(req: Request, res: Response) {
    try {
      const movie = await prisma.movie.create({
        data: req.body,
        include: {
          genres: true,
        },
      });
      res.status(201).json(movie);
    } catch (error) {
      res
        .status(400)
        .json({
          error: error instanceof Error ? error.message : "Unknown error",
        });
    }
  }
}

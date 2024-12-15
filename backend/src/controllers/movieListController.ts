// src/controllers/movieController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MovieListController {
  async updateMovieListTitle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const updatedList = await prisma.movieList.update({
        where: { id },
        data: {
          title,
          description,
        },
      });

      res.json(updatedList);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async deleteMovieList(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.movieList.delete({
        where: { id },
      });

      res.json({ message: "Movie list deleted successfully" });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getMovieListsByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const movieLists = await prisma.movieList.findMany({
        where: {
          userId: userId,
        },
        include: {
          movies: {
            include: {
              genres: true,
            },
          },
        },
      });
      res.json(movieLists);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async addMovieToList(req: Request, res: Response) {
    try {
      const { listId, movieId } = req.params;

      const updatedList = await prisma.movieList.update({
        where: { id: listId },
        data: {
          movies: {
            connect: { id: parseInt(movieId) },
          },
          movieCount: {
            increment: 1,
          },
        },
        include: {
          movies: true,
        },
      });

      res.json(updatedList);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async removeMovieFromList(req: Request, res: Response) {
    try {
      const { listId, movieId } = req.params;

      const updatedList = await prisma.movieList.update({
        where: { id: listId },
        data: {
          movies: {
            disconnect: { id: parseInt(movieId) },
          },
          movieCount: {
            decrement: 1,
          },
        },
        include: {
          movies: true,
        },
      });

      res.json(updatedList);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async createMovieList(req: Request, res: Response) {
    try {
      const { title, description, userId } = req.body;

      const newList = await prisma.movieList.create({
        data: {
          title,
          description,
          userId,
          movieCount: 0,
        },
        include: {
          movies: true,
        },
      });

      res.status(201).json(newList);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

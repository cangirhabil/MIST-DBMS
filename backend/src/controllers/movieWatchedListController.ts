import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
export class MovieWatchedListController {
  constructor() {
    this.addMovieToWatchedList = this.addMovieToWatchedList.bind(this);
    this.removeMovieFromWatchedList = this.removeMovieFromWatchedList.bind(this);
    this.getWatchedMoviesByUserId = this.getWatchedMoviesByUserId.bind(this);
  }

  public async addMovieToWatchedList(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const {
        movieId,
        title,
        releaseYear,
        posterUrl,
        rating,
        director,
        duration,
        overview,
      } = req.body;

      // Önce filmin gerçekten var olup olmadığını kontrol et
      const movieExists = await prisma.movie.findUnique({
        where: { id: movieId }
      });

      if (!movieExists) {
        res.status(404).json({ error: "Movie not found in database" });
        return;
      }

      // Kullanıcının var olup olmadığını kontrol et
      const userExists = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!userExists) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const watchedMovie = await prisma.movieWatchedList.create({
        data: {
          userId,
          movieId,
          title,
          releaseYear,
          posterUrl,
          rating,
          director,
          duration,
          overview,
        },
      });

      res.status(201).json(watchedMovie);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          res.status(400).json({ error: "Movie already in watched list" });
          return;
        }
      }
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async removeMovieFromWatchedList(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if the watched movie exists
      const watchedMovie = await prisma.movieWatchedList.findUnique({
        where: {
          id: id
        },
      });

      if (!watchedMovie) {
        res.status(404).json({ error: "Movie not found in watched list" });
        return;
      }

      await prisma.movieWatchedList.delete({
        where: {
          id: id
        },
      });

      res.json({ message: "Movie removed from watched list successfully" });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  public async getWatchedMoviesByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Kullanıcının var olup olmadığını kontrol et
      const userExists = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!userExists) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const watchedMovies = await prisma.movieWatchedList.findMany({
        where: { userId },
      });

      res.json(watchedMovies);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
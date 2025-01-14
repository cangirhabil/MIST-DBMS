// src/controllers/movieController.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MovieController {
  async searchMovies(req: Request, res: Response) {
    try {
      const {
        searchTerm,
        genre,
        startYear,
        endYear,
        sortBy = "relevance",
      } = req.query;

      // Base query
      const whereClause: any = {};

      // Search term filter
      if (searchTerm) {
        whereClause.OR = [
          {
            title: {
              contains: searchTerm as string,
              mode: "insensitive",
            },
          },
          {
            overview: {
              contains: searchTerm as string,
              mode: "insensitive",
            },
          },
        ];
      }

      // Year range filter
      if (startYear || endYear) {
        whereClause.releaseYear = {
          gte: startYear ? parseInt(startYear as string) : 1900,
          lte: endYear ? parseInt(endYear as string) : new Date().getFullYear(),
        };
      }

      // Genre filter
      if (genre) {
        whereClause.genres = {
          some: {
            name: {
              equals: (genre as string).toLowerCase(),
              mode: "insensitive",
            },
          },
        };
      }

      // Determine sorting
      let orderBy: any = {};
      switch (sortBy) {
        case "year":
          orderBy = { releaseYear: "desc" };
          break;
        case "rating":
          orderBy = { rating: "desc" };
          break;
        case "title":
          orderBy = { title: "asc" };
          break;
        default:
          // For 'relevance' or default case
          orderBy = { releaseYear: "desc" };
      }

      const movies = await prisma.movie.findMany({
        where: whereClause,
        include: {
          genres: {
            select: {
              name: true,
            },
          },
        },
        orderBy,
        take: 50, // Limit results to prevent overwhelming response
      });

      res.json({
        results: movies.map((movie) => ({
          id: movie.id,
          title: movie.title,
          releaseYear: movie.releaseYear,
          posterUrl: movie.posterUrl,
          rating: movie.rating,
          director: movie.director,
          duration: movie.duration,
          overview: movie.overview,
          genres: movie.genres.map((g) => g.name),
        })),
        total: movies.length,
      });
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }

  async getMovieCount(req: Request, res: Response) {
    try {
      const count = await prisma.movie.count();
      res.json({ count });
    } catch (error) {
      console.error("Count error:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }
}

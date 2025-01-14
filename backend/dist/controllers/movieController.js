"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class MovieController {
    async searchMovies(req, res) {
        try {
            const { searchTerm, genre, startYear, endYear, sortBy = "relevance", } = req.query;
            // Base query
            const whereClause = {};
            // Search term filter
            if (searchTerm) {
                whereClause.OR = [
                    {
                        title: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                    {
                        overview: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                ];
            }
            // Year range filter
            if (startYear || endYear) {
                whereClause.releaseYear = {
                    gte: startYear ? parseInt(startYear) : 1900,
                    lte: endYear ? parseInt(endYear) : new Date().getFullYear(),
                };
            }
            // Genre filter
            if (genre) {
                whereClause.genres = {
                    some: {
                        name: {
                            equals: genre.toLowerCase(),
                            mode: "insensitive",
                        },
                    },
                };
            }
            // Determine sorting
            let orderBy = {};
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
        }
        catch (error) {
            console.error("Search error:", error);
            res.status(500).json({
                error: error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
            });
        }
    }
    async getMovieCount(req, res) {
        try {
            const count = await prisma.movie.count();
            res.json({ count });
        }
        catch (error) {
            console.error("Count error:", error);
            res.status(500).json({
                error: error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
            });
        }
    }
}
exports.MovieController = MovieController;

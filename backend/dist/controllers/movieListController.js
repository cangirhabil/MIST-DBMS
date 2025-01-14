"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieListController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class MovieListController {
    async updateMovieListTitle(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async deleteMovieList(req, res) {
        try {
            const { id } = req.params;
            await prisma.movieList.delete({
                where: { id },
            });
            res.json({ message: "Movie list deleted successfully" });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async getMovieListsByUserId(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async addMovieToList(req, res) {
        try {
            const { listId, movieId } = req.params;
            const updatedList = await prisma.movieList.update({
                where: { id: listId },
                data: {
                    movies: {
                        connect: { id: parseInt(movieId) },
                    },
                },
                include: {
                    movies: true,
                },
            });
            res.json(updatedList);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async removeMovieFromList(req, res) {
        try {
            const { listId, movieId } = req.params;
            const updatedList = await prisma.movieList.update({
                where: { id: listId },
                data: {
                    movies: {
                        disconnect: { id: parseInt(movieId) },
                    },
                },
                include: {
                    movies: true,
                },
            });
            res.json(updatedList);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async createMovieList(req, res) {
        try {
            const { title, description, userId } = req.body;
            const newList = await prisma.movieList.create({
                data: {
                    title,
                    description,
                    userId,
                },
                include: {
                    movies: true,
                },
            });
            res.status(201).json(newList);
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async getMovieListsCount(req, res) {
        try {
            const count = await prisma.movieList.count();
            res.json({ count });
        }
        catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.MovieListController = MovieListController;

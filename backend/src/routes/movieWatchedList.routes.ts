import { Router } from "express";
import { MovieWatchedListController } from "../controllers/movieWatchedListController";

const router = Router();
const movieWatchedListController = new MovieWatchedListController();

// Define routes
router.post(
  "/users/:userId/watched",
  movieWatchedListController.addMovieToWatchedList
);
router.delete(
  "/watched/:id",
  movieWatchedListController.removeMovieFromWatchedList
);
router.get(
  "/users/:userId/watched",
  movieWatchedListController.getWatchedMoviesByUserId
);

export default router;

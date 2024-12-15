import { Router } from "express";
import { MovieListController } from "../controllers/movieListController";

const router = Router();
const movieListController = new MovieListController();

router.get(
  "/getMovieLists/userId=:id",
  movieListController.getMovieListsByUserId
);
router.delete("/deleteMovieList/:id", movieListController.deleteMovieList);
router.put("/updateMovieList/:id", movieListController.updateMovieListTitle);
router.post(
  "/addMovieToList/:listId/:movieId",
  movieListController.addMovieToList
);
router.delete(
  "/removeMovieFromList/:listId/:movieId",
  movieListController.removeMovieFromList
);
router.post("/createMovieList", movieListController.createMovieList);

export default router;

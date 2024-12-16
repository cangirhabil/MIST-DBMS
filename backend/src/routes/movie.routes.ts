import { Router } from "express";
import { MovieController } from "../controllers/movieController";

const router = Router();
const movieController = new MovieController();

 
router.get(
    "/search",
    movieController.searchMoviesByName.bind(movieController)
);

export default router;

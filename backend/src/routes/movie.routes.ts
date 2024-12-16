import { Router } from "express";
import { MovieController } from "../controllers/movieController";

const router = Router();
const movieController = new MovieController();

router.get("/search", (req, res) => movieController.searchMovies(req, res));

export default router;

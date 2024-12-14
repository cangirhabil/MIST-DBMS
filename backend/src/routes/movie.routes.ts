import { Router } from "express";
import { MovieController } from "../controllers/movieController";

const router = Router();
const movieController = new MovieController();

router.get("/", movieController.getAllMovies);
router.post("/", movieController.createMovie);

export default router;

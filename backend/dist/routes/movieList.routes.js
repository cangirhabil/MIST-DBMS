"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movieListController_1 = require("../controllers/movieListController");
const router = (0, express_1.Router)();
const movieListController = new movieListController_1.MovieListController();
router.get("/getMovieLists/userId=:userId", movieListController.getMovieListsByUserId);
router.delete("/deleteMovieList/:id", movieListController.deleteMovieList);
router.put("/updateMovieList/:id", movieListController.updateMovieListTitle);
router.post("/addMovieToList/:listId/:movieId", movieListController.addMovieToList);
router.delete("/removeMovieFromList/:listId/:movieId", movieListController.removeMovieFromList);
router.post("/createMovieList", movieListController.createMovieList);
exports.default = router;
//# sourceMappingURL=movieList.routes.js.map
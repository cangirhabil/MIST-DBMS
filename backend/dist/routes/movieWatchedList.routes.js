"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movieWatchedListController_1 = require("../controllers/movieWatchedListController");
const router = (0, express_1.Router)();
const movieWatchedListController = new movieWatchedListController_1.MovieWatchedListController();
// Define routes
router.post("/users/:userId/watched", movieWatchedListController.addMovieToWatchedList);
router.delete("/watched/:id", movieWatchedListController.removeMovieFromWatchedList);
router.get("/users/:userId/watched", movieWatchedListController.getWatchedMoviesByUserId);
exports.default = router;
//# sourceMappingURL=movieWatchedList.routes.js.map
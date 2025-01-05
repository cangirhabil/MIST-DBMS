"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movieController_1 = require("../controllers/movieController");
const router = (0, express_1.Router)();
const movieController = new movieController_1.MovieController();
router.get("/search", (req, res) => movieController.searchMovies(req, res));
exports.default = router;

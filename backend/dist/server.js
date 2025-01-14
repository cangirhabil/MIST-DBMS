"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const movieList_routes_1 = __importDefault(require("./routes/movieList.routes"));
const movie_routes_1 = __importDefault(require("./routes/movie.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const movieWatchedList_routes_1 = __importDefault(require("./routes/movieWatchedList.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/auth", auth_routes_1.default);
app.use("/lists", movieList_routes_1.default);
app.use("/user", user_routes_1.default);
app.use("/movie", movie_routes_1.default);
app.use("/watched", movieWatchedList_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.use(error_middleware_1.errorHandler);
app.listen(config_1.config.port, () => {
    console.log(`Server running on port ${config_1.config.port}`);
});

import express from "express";
import cors from "cors";
import { config } from "./config";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes"
import movieListRoutes from "./routes/movieList.routes";
import movieRoutes from "./routes/movie.routes";
import { errorHandler } from "./middleware/error.middleware";
import userRoutes from "./routes/user.routes"
import movieWatchedListRoutes from "./routes/movieWatchedList.routes"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/lists", movieListRoutes);
app.use("/user", userRoutes)
app.use("/movie", movieRoutes);
app.use("/watched", movieWatchedListRoutes)
app.use("/admin", adminRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});


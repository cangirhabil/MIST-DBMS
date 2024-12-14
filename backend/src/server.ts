import express from "express";
import cors from "cors";
import { config } from "./config";
import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import { errorHandler } from "./middleware/error.middleware";
import userProfileRoutes from "./routes/userProfile.routes"
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/user", userProfileRoutes)

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});


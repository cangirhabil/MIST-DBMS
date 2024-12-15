import express from "express";
import cors from "cors";
import { config } from "./config";
import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movieList.routes";
import { errorHandler } from "./middleware/error.middleware";
import userRoutes from "./routes/user.routes"
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/lists", movieRoutes);
app.use("/user", userRoutes)

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});


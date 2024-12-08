// src/server.ts
import express, { Express } from "express";
import cors from "cors";
import { config } from "./config";
import movieRoutes from "./routes/movie.routes";
import { errorHandler } from "./middleware/error.middleware";

const app: Express = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/movies", movieRoutes);

// Error handling
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

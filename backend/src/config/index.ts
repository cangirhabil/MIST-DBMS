// src/config/index.ts
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "postgresql",
  jwtSecret: process.env.JWT_SECRET || "jwtsecret",
};

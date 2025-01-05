"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// src/config/index.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL || "postgresql",
    jwtSecret: process.env.JWT_SECRET || "jwtsecret",
};

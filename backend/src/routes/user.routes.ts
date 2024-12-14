// backend/src/routes/user.routes.ts
import express from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:id", authMiddleware, UserController.getProfile);
router.put("/profile", authMiddleware, UserController.updateProfile);
router.put("/password", authMiddleware, UserController.updatePassword);

export default router;

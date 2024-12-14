import { Router } from "express";
import { register, login } from "../controllers/authController";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validate.middleware";

const router = Router();

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").exists(),
    validateRequest,
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").exists(), validateRequest],
  login
);

export default router;

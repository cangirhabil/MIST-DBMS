// src/routes/userProfileRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import { UserProfileController } from "../controllers/userProfileController";
import { body } from "express-validator";
import { validationResult } from "express-validator";

const router = Router();
const userProfileController = new UserProfileController();

// Inline validation middleware
const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

// Wrapper function for getUserProfile
router.get("/:userId", (req: Request, res: Response, next: NextFunction) => {
  userProfileController.getUserProfile(req, res).catch(next);
});

// Wrapper function for updateUserProfile
router.put(
  "/:userId",
  [
    body("name")
      .optional()
      .isString()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
  ],
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    userProfileController.updateUserProfile(req, res).catch(next);
  }
);

export default router;

// src/routes/userProfileRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/userController";
import { body } from "express-validator";
import { validationResult } from "express-validator";

const router = Router();
const userProfileController = new UserController();

// Inline validation middleware
const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

router.get(
  "/getUser/id=:id",
  (req: Request, res: Response, next: NextFunction) => {
    userProfileController.getUserById(req, res).catch(next);
  }
);

// Update user
router.put(
  "/updateUser/id=:id",
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
    userProfileController.updateUser(req, res).catch(next);
  }
);


router.put(
  "/updatePassword/id=:id",
  [
    body("currentPassword")
      .isString()
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isString()
      .notEmpty()
      .withMessage("New password is required"),
  ],
  validateRequest,
  (req: Request, res: Response, next: NextFunction) => {
    userProfileController.updatePassword(req, res).catch(next);
  }
);


router.delete(
  "/users/:id",
  (req: Request, res: Response, next: NextFunction) => {
    userProfileController.deleteUser(req, res).catch(next);
  }
);

// Get all users
router.get("/users", (req: Request, res: Response, next: NextFunction) => {
  userProfileController.getAllUsers(req, res).catch(next);
});

router.get("/usersCount", (req: Request, res: Response, next: NextFunction) => {
  userProfileController.getUserCount(req, res).catch(next);
});
export default router;
// Update password

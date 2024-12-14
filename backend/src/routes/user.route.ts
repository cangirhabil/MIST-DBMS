import { Router } from "express";
import { UserProfileController } from "../controllers/userProfileController";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validate.middleware";

const router = Router();
const userProfileController = new UserProfileController();


router.get("/:userId", userProfileController.getUserProfile);

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
  userProfileController.updateUserProfile
);

export default router;

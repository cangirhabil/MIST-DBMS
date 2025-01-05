"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userProfileRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const express_validator_1 = require("express-validator");
const express_validator_2 = require("express-validator");
const router = (0, express_1.Router)();
const userProfileController = new userController_1.UserController();
// Inline validation middleware
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_2.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    else {
        next();
    }
};
router.get("/getUser/id=:id", (req, res, next) => {
    userProfileController.getUserById(req, res).catch(next);
});
// Update user
router.put("/updateUser/id=:id", [
    (0, express_validator_1.body)("name")
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty"),
    (0, express_validator_1.body)("email").optional().isEmail().withMessage("Invalid email format"),
], validateRequest, (req, res, next) => {
    userProfileController.updateUser(req, res).catch(next);
});
router.put("/updatePassword/id=:id", [
    (0, express_validator_1.body)("currentPassword")
        .isString()
        .notEmpty()
        .withMessage("Current password is required"),
    (0, express_validator_1.body)("newPassword")
        .isString()
        .notEmpty()
        .withMessage("New password is required"),
], validateRequest, (req, res, next) => {
    userProfileController.updatePassword(req, res).catch(next);
});
exports.default = router;
// Update password

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const express_validator_1 = require("express-validator");
const validate_middleware_1 = require("../middleware/validate.middleware");
const router = (0, express_1.Router)();
router.post("/register", [
    (0, express_validator_1.body)("email").isEmail(),
    (0, express_validator_1.body)("password").isLength({ min: 6 }),
    (0, express_validator_1.body)("name").exists(),
    validate_middleware_1.validateRequest,
], authController_1.register);
router.post("/login", [(0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").exists(), validate_middleware_1.validateRequest], authController_1.login);
exports.default = router;

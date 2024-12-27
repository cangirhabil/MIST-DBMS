"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const passwordUtils_1 = require("../utils/passwordUtils");
const prisma = new client_1.PrismaClient();
class UserController {
    async getUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({
                error: "Failed to get user",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const { name } = req.body;
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    name: name,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            });
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes("Record not found")) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(500).json({
                error: "Failed to update user",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
    async updatePassword(req, res) {
        try {
            const userId = req.params.id;
            const { currentPassword, newPassword } = req.body;
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    password: true,
                },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // Use comparePassword from passwordUtils
            const isPasswordValid = await (0, passwordUtils_1.comparePassword)(currentPassword, user.password);
            if (!isPasswordValid) {
                return res
                    .status(401)
                    .json({ message: "Current password is incorrect" });
            }
            // Hash the new password before saving
            const hashedPassword = await (0, passwordUtils_1.hashPassword)(newPassword);
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: {
                    password: hashedPassword,
                },
                select: {
                    id: true,
                },
            });
            return res.status(200).json({ message: "Password updated successfully" });
        }
        catch (error) {
            return res.status(500).json({
                error: "Failed to update password",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
}
exports.UserController = UserController;

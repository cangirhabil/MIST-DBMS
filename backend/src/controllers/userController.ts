import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
const prisma = new PrismaClient();

export class UserController {
  async getUserById(req: Request, res: Response) {
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
    } catch (error) {
      return res.status(500).json({
        error: "Failed to get user",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateUser(req: Request, res: Response) {
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
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Record not found")
      ) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(500).json({
        error: "Failed to update user",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updatePassword(req: Request, res: Response) {
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
      const isPasswordValid = await comparePassword(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      // Hash the new password before saving
      const hashedPassword = await hashPassword(newPassword);
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
    } catch (error) {
      return res.status(500).json({
        error: "Failed to update password",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      res.json({
        users,
        total: users.length,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      // First delete all movie lists associated with the user
      await prisma.movieList.deleteMany({
        where: {
          userId: userId,
        },
      });

      // Then delete the user
      const deletedUser = await prisma.user.delete({
        where: {
          id: userId,
        },
      });

      res.json({
        message: "User and associated movie lists deleted successfully",
        user: deletedUser,
      });
    } catch (error) {
      console.error("Error deleting user and movie lists:", error);
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  }

  async getUserCount(req: Request, res: Response) {
    try {
      const count = await prisma.user.count();
      return res.status(200).json({ count });
    } catch (error) {
      return res.status(500).json({
        error: "Failed to get user count",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

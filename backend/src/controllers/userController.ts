import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

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
      const { name, email, password } = req.body;

      // First, check if user exists and verify password
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          password: true,
        },
      });

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Compare passwords (assuming you're using bcrypt or similar)
      if (existingUser.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name,
          email: email,
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
}

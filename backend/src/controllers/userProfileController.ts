import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserProfileController {
  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          lists: {
            include: {
              movies: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const { name, email } = req.body;

      // Validate that at least one field is provided
      if (!name && !email) {
        return res
          .status(400)
          .json({
            error: "At least one field (name or email) must be provided",
          });
      }

      const updateData: { name?: string; email?: string } = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);

      // Handle specific Prisma error for user not found
      if (
        error instanceof Error &&
        error.message.includes("Record not found")
      ) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(400).json({
        error: "Invalid update request",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

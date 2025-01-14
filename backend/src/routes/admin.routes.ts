// admin.routes.ts
import { Router, Request, Response } from "express";
import { AdminController } from "../controllers/adminController";

const router = Router();
const adminController = new AdminController();

const getMetricsHandler = async (req: Request, res: Response) => {
  return await adminController.getMetrics(req, res);
};

router.get("/getStatistics", getMetricsHandler);

export default router;

import express from "express";
import { Disponibili, getClassi } from "../controllers/subController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/disponibili", authenticateToken, Disponibili);
router.get("/classi", authenticateToken, getClassi);

export default router;
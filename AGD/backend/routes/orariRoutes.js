import express from "express";
import { salvaOrari } from "../controllers/orariController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

// Route per salvare gli orari delle lezioni
router.post("/salva", authenticateToken, salvaOrari);

export default router;
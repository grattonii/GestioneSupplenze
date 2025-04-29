import express from "express";
import { salvaDisponibilita, getDisponibilita } from "../controllers/dispController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

// Route per salvare le disponibilità, con autenticazione se necessaria
router.post("/disponibilita", authenticateToken, salvaDisponibilita);
router.get("/disponibilita/:token", authenticateToken, getDisponibilita);

export default router;
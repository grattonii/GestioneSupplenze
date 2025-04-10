import express from "express";
import { salvaOrari, getOrari, fasceOrarie } from "../controllers/orariController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

// Route per salvare gli orari delle lezioni
router.post("/salva", authenticateToken, salvaOrari);
router.get("/modifica", authenticateToken, getOrari);
router.get("/fasce-orarie", authenticateToken, fasceOrarie); 

export default router;
import express from "express";
import { Disponibili, getClassi, aggiungiSupplenza, getSupplenzeOdierne } from "../controllers/subController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/disponibili", authenticateToken, Disponibili);
router.get("/classi", authenticateToken, getClassi);
router.post("/sub", authenticateToken, aggiungiSupplenza);
router.get("/odierne", authenticateToken, getSupplenzeOdierne);

export default router;
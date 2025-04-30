import express from "express";
import { Disponibili, getClassi, aggiungiSupplenza, getSupplenzeOdierne, getStoricoSupplenze, getSupplenzeDocente } from "../controllers/subController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/disponibili", authenticateToken, Disponibili);
router.get("/classi", authenticateToken, getClassi);
router.post("/sub", authenticateToken, aggiungiSupplenza);
router.get("/odierne", authenticateToken, getSupplenzeOdierne);
router.get("/storico", authenticateToken, getStoricoSupplenze);
router.get("/sub/:id", authenticateToken, getSupplenzeDocente);

export default router;
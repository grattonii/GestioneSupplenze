import express from "express";
import { UtentiEsistenti, ModificaRuolo, EliminaUtente, ResetPassword  } from "../controllers/adminController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/utenti", authenticateToken, UtentiEsistenti);
router.patch("/ruolo/:id", authenticateToken, ModificaRuolo);
router.patch("/annullaUtente/:id", authenticateToken, EliminaUtente);
router.patch("/reset/:id", authenticateToken, ResetPassword);

export default router;
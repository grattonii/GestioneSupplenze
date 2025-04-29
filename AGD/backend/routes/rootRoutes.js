import express from "express";
import { GeneraAdmin, AdminEsistenti, ModificaStato, EliminaAdmin, AggiornaAdmin, SegnalaProblema, Segnalazioni, ModificaStatoSegnalazione, EliminaSegnalazioni } from "../controllers/rootController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/admin", authenticateToken, GeneraAdmin);
router.get("/accountAdmin", authenticateToken, AdminEsistenti);
router.patch("/admin/:id", authenticateToken, ModificaStato);
router.delete("/annullaAdmin/:id", authenticateToken, EliminaAdmin);
router.patch("/modificaAdmin/:id", authenticateToken, AggiornaAdmin);
router.post("/segnalaProblema", authenticateToken, SegnalaProblema);
router.get("/segnalazioni", authenticateToken, Segnalazioni);
router.patch("/modificaStato/:id", authenticateToken, ModificaStatoSegnalazione);
router.delete("/annullaSegnalazione", authenticateToken, EliminaSegnalazioni);

export default router;
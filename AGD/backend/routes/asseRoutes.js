import express from "express";
import { Assenze, assenzaAccettata, assenzaDocente, asssenzaNegata } from "../controllers/asseController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/docenti", authenticateToken, Assenze);
router.post("/docente", authenticateToken, assenzaDocente);
router.patch("/docente/:idAssenza", authenticateToken, assenzaAccettata);
router.patch("/negata/:idAssenza", authenticateToken, asssenzaNegata);

export default router;
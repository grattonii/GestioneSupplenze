import express from "express";
import { Assenze, assenzaAccettata, assenzaDocente } from "../controllers/asseController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/docenti", authenticateToken, Assenze);
router.post("/docente", authenticateToken, assenzaDocente);
router.patch("/docente/:idAssenza", authenticateToken, assenzaAccettata);

export default router;
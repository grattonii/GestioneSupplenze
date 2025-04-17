import express from "express";
import { Assenze, assenzaDocente } from "../controllers/asseController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/docenti", authenticateToken, Assenze);
router.post("/docente", authenticateToken, assenzaDocente);

export default router;
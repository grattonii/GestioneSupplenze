import express from "express";
import { GeneraAdmin, AdminEsistenti, ModificaStato } from "../controllers/rootController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/admin", authenticateToken, GeneraAdmin);
router.get("/admin", authenticateToken, AdminEsistenti);
router.patch("/admin/:id", authenticateToken, ModificaStato);

export default router;
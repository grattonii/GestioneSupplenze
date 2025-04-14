import express from "express";
import { GeneraAdmin, AdminEsistenti, ModificaStato, EliminaAdmin, AggiornaAdmin  } from "../controllers/rootController.js";
import { authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/admin", authenticateToken, GeneraAdmin);
router.get("/admin", authenticateToken, AdminEsistenti);
router.patch("/admin/:id", authenticateToken, ModificaStato);
router.patch("/annullaAdmin/:id", authenticateToken, EliminaAdmin);
router.patch("/modificaAdmin/:id", authenticateToken, AggiornaAdmin);

export default router;
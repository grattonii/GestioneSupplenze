import express from "express";
import { GeneraAdmin } from "../controllers/rootController.js";

const router = express.Router();

router.post("/admin", GeneraAdmin);

export default router;
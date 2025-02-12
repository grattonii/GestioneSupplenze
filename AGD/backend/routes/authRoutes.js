import express from "express";
import { login, updateUser, authenticateToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.put("/update", authenticateToken, updateUser);

export default router;
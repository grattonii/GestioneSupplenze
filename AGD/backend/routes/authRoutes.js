import express from "express";
import { login, updateUser, authenticateToken, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.put("/update", authenticateToken, updateUser);
router.post("/refresh", refreshToken);
router.post("/logout", (req, res) => {
    res.clearCookie("refreshToken", { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Assicurati che venga usato HTTPS in produzione
        sameSite: "Strict"
    });
    res.json({ message: "Logout effettuato con successo!" });
});

export default router;
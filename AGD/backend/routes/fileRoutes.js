// In router.js
import { uploadDocenti } from "../controllers/fileController.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/upload", upload.fields([
    { name: 'fileDocenti', maxCount: 1 },  // File docenti
    { name: 'fileOrari', maxCount: 1 }     // File orari
]), uploadDocenti);

export default router;
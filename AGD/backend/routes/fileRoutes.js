import { uploadDocenti } from "../controllers/fileController.js";
import express from "express";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post("/upload", upload.single("file"), uploadDocenti);

export default router;
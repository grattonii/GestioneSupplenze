import express from "express";
import multer from "multer";
import { uploadProf } from "../controllers/fileController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadProf);

export default router;
import { uploadProf } from "../controllers/fileController.js";

router.post("/upload", upload.single("file"), uploadProf);

export default router;
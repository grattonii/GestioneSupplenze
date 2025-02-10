import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Importiamo le route
app.use("/auth", authRoutes);  // Per login
app.use("/files", fileRoutes); // Per la gestione dei file

app.listen(5000, () => console.log("Server in ascolto sulla porta 5000"));
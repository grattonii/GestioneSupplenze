import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import dispRoutes from "./routes/dispRoutes.js";
import rootRoutes from "./routes/rootRoutes.js";
import orariRoutes from "./routes/orariRoutes.js";
import asseRoutes from "./routes/asseRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import subRoutes from "./routes/subRoutes.js";
import dotenv from "dotenv";
import './utils/inits.js';
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",  // Specifica il frontend
    credentials: true                  // Permette l'invio dei cookie
  })); 
app.use(express.json());

// Importiamo le route
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/disp", dispRoutes);
app.use("/root", rootRoutes);
app.use("/orari", orariRoutes);
app.use("/admin", adminRoutes);
app.use("/supplenze", subRoutes);
app.use("/assenze", asseRoutes);

app.listen(5000, () => console.log("Server in ascolto sulla porta 5000"));
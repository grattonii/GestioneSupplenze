import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import dispRoutes from "./routes/dispRoutes.js";
import rootRoutes from "./routes/rootRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",  // Specifica il frontend
    credentials: true                  // Permette l'invio dei cookie
  })); 
app.use(express.json());

// Importiamo le route
app.use("/auth", authRoutes);  // Per login e aggiornamento credenziali
app.use("/files", fileRoutes); // Per la gestione dei file
app.use("/disp", dispRoutes);
app.use("/root", rootRoutes);

app.listen(5000, () => console.log("Server in ascolto sulla porta 5000"));
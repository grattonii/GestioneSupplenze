import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import dispRoutes from "./routes/dispRoutes.js";
import rootRoutes from "./routes/rootRoutes.js";
import orariRoutes from "./routes/orariRoutes.js";
import asseRoutes from "./routes/asseRoutes.js";
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
app.use("/auth", authRoutes);
app.use("/files", fileRoutes);
app.use("/disp", dispRoutes);
app.use("/root", rootRoutes);
app.use("/orari", orariRoutes);
app.use("/api/assenze", asseRoutes);
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(5000, () => console.log("Server in ascolto sulla porta 5000"));
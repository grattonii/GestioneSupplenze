import express from "express";
import fs from "fs";
import path from "path";
import { authenticateToken } from "../controllers/authController.js"; // Importa il middleware per autenticare il token

const router = express.Router();
const assenzeFilePath = path.join(__dirname, "../data/assenze.json");

// Funzione per leggere il file JSON
const readAssenze = () => {
  if (!fs.existsSync(assenzeFilePath)) {
    fs.writeFileSync(assenzeFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(assenzeFilePath);
  return JSON.parse(data);
};

// Funzione per scrivere nel file JSON
const writeAssenze = (assenze) => {
  fs.writeFileSync(assenzeFilePath, JSON.stringify(assenze, null, 2));
};

// Endpoint per aggiungere una nuova assenza
router.post("/", authenticateToken, (req, res) => {
  const { date, reason, note } = req.body;

  if (!date || !reason) {
    return res.status(400).json({ error: "Data e motivo sono obbligatori." });
  }

  const assenze = readAssenze();
  const newAbsence = {
    id: Date.now(),
    idProfessore: req.user.id, // Ottieni l'ID del professore dal token
    idAdmin: req.user.adminId, // Ottieni l'ID dell'admin dal token
    date,
    reason,
    note,
  };

  assenze.push(newAbsence);
  writeAssenze(assenze);

  res.status(201).json(newAbsence);
});

// Endpoint per ottenere tutte le assenze di un admin
router.get("/", authenticateToken, (req, res) => {
  const assenze = readAssenze();

  // Filtra le assenze per ID admin
  const filteredAssenze = assenze.filter((assenza) => assenza.idAdmin === req.user.id);
  res.json(filteredAssenze);
});

export default router;
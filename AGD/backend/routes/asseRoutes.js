import express from "express";
const router = express.Router();

let assenze = []; // Array per memorizzare le richieste di assenza

// Endpoint per aggiungere una nuova assenza
router.post("/", (req, res) => {
  const { date, reason, note } = req.body;

  if (!date || !reason) {
    return res.status(400).json({ error: "Data e motivo sono obbligatori." });
  }

  const newAbsence = { id: Date.now(), date, reason, note };
  assenze.push(newAbsence);

  res.status(201).json(newAbsence);
});

// Endpoint per ottenere tutte le assenze
router.get("/", (req, res) => {
  res.json(assenze);
});

export default router;
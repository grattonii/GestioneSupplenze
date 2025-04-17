import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const filePath = path.join(__dirname, '../data/disp.json');

export const salvaDisponibilita = (req, res) => {
  const loadData = () => {
    if (!fs.existsSync(filePath)) return [];
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Errore nella lettura del file JSON:", error);
      return [];
    }
  };

  const saveData = (data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw new Error("Errore durante il salvataggio dei dati: " + error.message);
    }
  };

  const { id, disponibilita } = req.body;

  if (!id || !disponibilita || typeof disponibilita !== 'object') {
    return res.status(400).json({ error: 'Formato non valido: id e disponibilita richiesti' });
  }

  // Valorizza i dati esistenti
  let data = loadData();

  // Trova o aggiorna la disponibilità del docente
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index].disponibilita = disponibilita;
  } else {
    data.push({ id, disponibilita });
  }

  try {
    saveData(data);
    res.status(200).json({ message: 'Disponibilità salvata correttamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il salvataggio dei dati' });
  }
};

export default router;

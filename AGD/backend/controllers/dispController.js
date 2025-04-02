import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const filePath = path.join(__dirname, './data/disp.json');

export const salvaDisponibilita = (req, res) => {
  // Funzione helper per caricare i dati esistenti
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

  // Funzione helper per salvare i dati sul file
  const saveData = (data) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      throw new Error("Errore durante il salvataggio dei dati: " + error.message);
    }
  };

  const { idDocente, disponibilita } = req.body;

  if (!idDocente || !disponibilita) {
    return res.status(400).json({ error: 'Sono richiesti idDocente e disponibilita' });
  }

  let data = loadData();
  const index = data.findIndex(item => item.idDocente === idDocente);
  if (index !== -1) {
    data[index].disponibilita = disponibilita;
  } else {
    data.push({ idDocente, disponibilita });
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

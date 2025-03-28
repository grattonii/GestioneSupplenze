import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "./data/orario.json");

// Funzione per caricare i dati esistenti
const loadData = () => {
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Errore nella lettura del file JSON:", error);
    return [];
  }
};

// Funzione per salvare i dati
const saveData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    throw new Error("Errore durante il salvataggio dei dati: " + error.message);
  }
};

// Funzione controller per salvare gli orari
export const salvaOrari = (req, res) => {
  const { idAdmin, orari } = req.body;

  if (!idAdmin || !orari) {
    return res.status(400).json({ error: "Dati orari mancanti" });
  }

  let data = loadData();
  data = [{ idAdmin, orari }]; // Salva anche l'idAdmin nel file

  try {
    saveData(data);
    res.status(200).json({ message: "Orari salvati correttamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il salvataggio dei dati" });
  }
};
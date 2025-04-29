import { writeFileSync, readFileSync, existsSync} from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../data/disp.json');

const loadData = () => {
  if (!existsSync(filePath)) return [];
  try {
    const data = readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Errore nella lettura del file JSON:", error);
    return [];
  }
};

const saveData = (data) => {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error("Errore durante il salvataggio dei dati: " + error.message);
  }
};

export const salvaDisponibilita = (req, res) => {

  const { id, disponibilita } = req.body;

  if (!id || !disponibilita || typeof disponibilita !== 'object') {
    return res.status(400).json({ error: 'Formato non valido: id e disponibilita richiesti' });
  }

  let data = loadData();

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

export const getDisponibilita = (req, res) => {
  const { token } = req.params;

  let id;
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS);
    id = decodedToken?.id;
  } catch (err) {
    return res.status(401).json({ error: 'Token non valido' });
  }


  if (!id) {
    return res.status(400).json({ error: 'ID richiesto' });
  }

  const data = loadData();
  const disponibilita = data.find(item => item.id === id);

  if (!disponibilita) {
    return res.status(404).json({ error: 'Disponibilità non trovata' });
  }

  res.status(200).json(disponibilita);
}
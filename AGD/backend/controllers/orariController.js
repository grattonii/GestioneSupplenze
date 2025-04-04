import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/orario.json");
const filePath2 = path.join(__dirname, "../data/users.json");

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
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    throw new Error("Errore durante il salvataggio dei dati: " + error.message);
  }
};

export const salvaOrari = (req, res) => {
  const { idAdmin, orari } = req.body;

  if (!idAdmin || !orari) {
    return res.status(400).json({ error: "Dati orari mancanti" });
  }

  let data = loadData();

  // Cerca se l'idAdmin esiste già
  const index = data.findIndex((item) => item.idAdmin === idAdmin);

  if (index !== -1) {
    // Se esiste, aggiorna solo i suoi orari
    data[index].orari = orari;
  } else {
    // Se non esiste, aggiungilo
    data.push({ idAdmin, orari });
  }

  try {
    saveData(data);
    res.status(200).json({ message: "Orari salvati correttamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore durante il salvataggio dei dati" });
  }
};

// Funzione per ottenere gli orari
export const getOrari = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS);
    const idAdmin = decodedToken?.id;

    if (!idAdmin) {
      return res.status(400).json({ error: "ID amministratore non trovato" });
    }

    const data = loadData();
    const adminData = data.find((item) => item.idAdmin === idAdmin);

    if (!adminData || !adminData.orari) {
      return res.status(404).json({ error: "Orari non trovati" });
    }

    res.status(200).json(adminData.orari);
  } catch (error) {
    console.error("Errore nel decodificare il token:", error);
    return res.status(401).json({ error: "Token non valido o scaduto" });
  }
};

// Funzione per ottenere le fasce orarie
export const fasceOrarie = (req, res) => {
  console.log("Richiesta ricevuta per /orari/fasce-orarie");
  console.log("Token ricevuto:", req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS);
    const id = decodedToken?.id;
    const role = decodedToken?.role;
    let idAdmin;

    if (!id) {
      return res.status(400).json({ error: "ID non trovato nel token" });
    }

    if (role === "admin") {
      idAdmin = id;
    } else {
      if (!fs.existsSync(filePath2)) {
        return res.status(500).json({ error: "File utenti non trovato" });
      }

      try {
        const dati = fs.readFileSync(filePath2, "utf8");
        const utenti = JSON.parse(dati);
        const user = utenti.find((u) => u.id === id);

        if (!user) {
          return res.status(404).json({ error: "Utente non trovato" });
        }

        // Prendiamo l'idAdmin associato al professore
        idAdmin = user.idAdmin;
      } catch (error) {
        console.error("Errore nella lettura del file users.json:", error);
        return res.status(500).json({ error: "Errore interno nel recupero utenti" });
      }
    }

    const data = loadData();
    const adminData = data.find((item) => item.idAdmin === idAdmin);

    if (!adminData) {
      return res.status(404).json({ error: "Orari non trovati per questo amministratore" });
    }

    const { inizioPrimaLezione, fineUltimaLezione, inizioRicreazione, fineRicreazione, durataLezioni, giorniLezione } = adminData.orari;

    const aggiungiMinuti = (orario, minuti) => {
      if (typeof orario !== "string" || !orario.includes(":")) {
        console.error("Formato orario non valido:", orario);
        return "00:00";
      }

      let [ore, min] = orario.split(":").map(Number);
      if (isNaN(ore) || isNaN(min)) {
        console.error("Errore nel parsing dell'orario:", orario);
        return "00:00";
      }

      let totaleMinuti = ore * 60 + min + minuti;
      let nuoveOre = Math.floor(totaleMinuti / 60);
      let nuoviMin = totaleMinuti % 60;

      return `${String(nuoveOre).padStart(2, "0")}:${String(nuoviMin).padStart(2, "0")}`;
    };

    let fasce = [];
    let orarioCorrente = inizioPrimaLezione;

    while (orarioCorrente < fineUltimaLezione) {
      let fineLezione = aggiungiMinuti(orarioCorrente, durataLezioni);
      if (fineLezione > fineUltimaLezione) break;

      if (fineLezione > inizioRicreazione && orarioCorrente < inizioRicreazione) {
        fasce.push({ giorniLezione, inizio: orarioCorrente, fine: inizioRicreazione });
        fasce.push({ giorniLezione, inizio: inizioRicreazione, fine: fineRicreazione });
        orarioCorrente = fineRicreazione;
        continue;
      }

      fasce.push({ giorniLezione, inizio: orarioCorrente, fine: fineLezione });
      orarioCorrente = fineLezione;
    }

    res.status(200).json(fasce);
  } catch (error) {
    console.error("Errore nel decodificare il token", error);
    return res.status(401).json({ error: "Token non valido o scaduto" });
  }
};
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
  const { orari } = req.body;

  if (!orari) {
    return res.status(400).json({ success: false, error: "Dati orari mancanti" });
  }

  const token = req.headers.authorization?.split(" ")[1]; // Estrai il token
  if (!token) {
    return res.status(401).json({ success: false, error: "Token mancante" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS); // Verifica il token
    const idAdmin = decodedToken?.id; 

    if (!idAdmin) {
      return res.status(400).json({ success: false, error: "ID amministratore non trovato" });
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
      res.status(200).json({ success: true, message: "Orari salvati correttamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Errore durante il salvataggio dei dati" });
    }
  } catch (error) {
    console.error("Errore nel decodificare il token:", error);
    return res.status(401).json({ success: false, error: "Token non valido o scaduto" });
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

    // Converti la durata delle lezioni in un numero
    const durataLezioniNum = Number(durataLezioni);
    if (isNaN(durataLezioniNum)) {
      return res.status(400).json({ error: "Durata lezioni non valida" });
    }

    // Funzione per convertire un orario in minuti dalla mezzanotte
    const convertiInMinuti = (orario) => {
      const [ore, minuti] = orario.split(":").map(Number);
      return ore * 60 + minuti;
    };

    // Converto gli orari in minuti
    const inizioPrimaLezioneInMinuti = convertiInMinuti(inizioPrimaLezione);
    const fineUltimaLezioneInMinuti = convertiInMinuti(fineUltimaLezione);
    const inizioRicreazioneInMinuti = convertiInMinuti(inizioRicreazione);
    const fineRicreazioneInMinuti = convertiInMinuti(fineRicreazione);

    // Funzione per aggiungere i minuti all'orario
    const aggiungiMinuti = (orario, minuti) => {
      const totaleMinuti = convertiInMinuti(orario) + minuti;
      const ore = Math.floor(totaleMinuti / 60);
      const min = totaleMinuti % 60;
      return `${String(ore).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    };

    let fasce = [];
    let orarioCorrente = inizioPrimaLezione;

    // Genera fasce orarie prima della ricreazione
    let lezioneCount = 0;
    while (convertiInMinuti(orarioCorrente) < inizioRicreazioneInMinuti && lezioneCount < 3) {
      let fineLezione = aggiungiMinuti(orarioCorrente, durataLezioniNum);
      if (convertiInMinuti(fineLezione) > inizioRicreazioneInMinuti) break;

      fasce.push({ giorniLezione, inizio: orarioCorrente, fine: fineLezione });
      orarioCorrente = fineLezione;
      lezioneCount++;
    }

    // Dopo la ricreazione, la lezione successiva inizia subito dopo la fine della ricreazione
    if (convertiInMinuti(orarioCorrente) < fineUltimaLezioneInMinuti) {
      // La quarta ora inizia alle 11:16
      orarioCorrente = fineRicreazione;
    }

    // Genera fasce orarie dopo la ricreazione
    while (convertiInMinuti(orarioCorrente) < fineUltimaLezioneInMinuti) {
      let fineLezione = aggiungiMinuti(orarioCorrente, durataLezioniNum);
      if (convertiInMinuti(fineLezione) > fineUltimaLezioneInMinuti) break;

      fasce.push({ giorniLezione, inizio: orarioCorrente, fine: fineLezione });
      orarioCorrente = fineLezione;
    }

    res.status(200).json(fasce);
  } catch (error) {
    console.error("Errore nel decodificare il token", error);
    return res.status(401).json({ error: "Token non valido o scaduto" });
  }
};
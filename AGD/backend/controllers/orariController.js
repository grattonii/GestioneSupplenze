import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/orario.json");

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
    // Crea la cartella 'data' se non esiste
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Crea il file se non esiste
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]", "utf8");
    }

    // Salva i dati nel file JSON
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

export const getOrari = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Estrai il token dalla header 'Authorization'
  
  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }

  try {
    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const idAdmin = decodedToken?.id;

    if (!idAdmin) {
      return res.status(400).json({ error: "ID amministratore non trovato nel token" });
    }

    const data = loadData();
    const adminData = data.find((item) => item.idAdmin === idAdmin);

    if (!adminData) {
      return res.status(404).json({ error: "Orari non trovati per questo amministratore" });
    }

    res.status(200).json(adminData.orari);
  } catch (error) {
    console.error("Errore nel decodificare il token", error);
    return res.status(500).json({ error: "Errore interno" });
  }
};

export const fasceOrarie = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Estrai il token dalla header 'Authorization'
  
  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }

  try {
    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const idAdmin = decodedToken?.id;

    if (!idAdmin) {
      return res.status(400).json({ error: "ID amministratore non trovato nel token" });
    }

    const data = loadData();
    const adminData = data.find((item) => item.idAdmin === idAdmin);

    if (!adminData) {
      return res.status(404).json({ error: "Orari non trovati per questo amministratore" });
    }

    const { inizioPrimaLezione, fineUltimaLezione, inizioRicreazione, fineRicreazione, durataLezioni } = adminData.orari;

    // Funzione per sommare minuti a un orario (formato "HH:MM")
    const aggiungiMinuti = (orario, minuti) => {
      let [ore, min] = orario.split(":").map(Number);
      let totaleMinuti = ore * 60 + min + minuti;
      let nuoveOre = Math.floor(totaleMinuti / 60);
      let nuoviMin = totaleMinuti % 60;
      return `${String(nuoveOre).padStart(2, "0")}:${String(nuoviMin).padStart(2, "0")}`;
    };

    let fasce = [];
    let orarioCorrente = inizioPrimaLezione;
    let lezione = 1;

    while (orarioCorrente < fineUltimaLezione) {
      let fineLezione = aggiungiMinuti(orarioCorrente, durataLezioni);

      // Se la fine della lezione supera l'orario scolastico, interrompe il ciclo
      if (fineLezione > fineUltimaLezione) break;

      // Aggiungi solo l'orario di inizio e fine delle lezioni
      fasce.push(orarioCorrente);
      fasce.push(fineLezione);

      // Se la prossima lezione inizia durante la ricreazione, inserisce la pausa
      let prossimoInizio = aggiungiMinuti(fineLezione, durataLezioni);
      if (fineLezione <= inizioRicreazione && prossimoInizio > inizioRicreazione) {
        fasce.push(inizioRicreazione);
        fasce.push(fineRicreazione);

        // Salta la durata della ricreazione
        fineLezione = fineRicreazione;
      }

      orarioCorrente = fineLezione;
      lezione++;
    }

    res.status(200).json(fasce);
  } catch (error) {
    console.error("Errore nel decodificare il token", error);
    return res.status(500).json({ error: "Errore interno" });
  }
};
import { writeFileSync, readFileSync, existsSync } from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const USERS_FILE = "./data/users.json";
const PROFESSORS_FILE = "./data/docenti.json";
const TIME_TABLE_FILE = "./data/orario.json";
const DISPONIBILITA_FILE = "./data/disp.json";
const SEGNALE_FILE = './data/segnalazioni.json';

function generateUniqueID() {
  if (!existsSync(USERS_FILE)) return new Set();

  const users = JSON.parse(readFileSync(USERS_FILE));
  let existingIDs = new Set(users.map(user => user.id));

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let newID;
  do {
    newID = "";
    for (let i = 0; i < 3; i++) {
      newID += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (existingIDs.has(newID));

  return newID;
}

function UniqueID() {
  if (!existsSync(SEGNALE_FILE)) return new Set();

  const prob = JSON.parse(readFileSync(SEGNALE_FILE));
  let existingIDs = new Set(prob.map(prob => prob.id));

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let newID;
  do {
    newID = "";
    for (let i = 0; i < 4; i++) {
      newID += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (existingIDs.has(newID));

  return newID;
}

function generateUsername(nome1, nome2, tipologia) {
  const firstLetterNome = nome1.charAt(0).toUpperCase();
  const firstLetterCognome = nome2 ? nome2.charAt(0).toUpperCase() : "X";
  const firstLetterScuola = tipologia.charAt(0).toUpperCase();
  const randomNumbers = Math.floor(1000000 + Math.random() * 9000000);
  return `${firstLetterNome}${firstLetterCognome}${randomNumbers}${firstLetterScuola}`;
}

export const GeneraAdmin = async (req, res) => {
  const { nomeScuola, tipologia, emailReferente, codiceMeccanografico } = req.body;
  if (!nomeScuola || !tipologia || !emailReferente || !codiceMeccanografico) {
    return res.status(400).json({ success: false, message: "Tutti i campi sono obbligatori." });
  }

  const users = existsSync(USERS_FILE) ? JSON.parse(readFileSync(USERS_FILE)) : [];

  const scuolaParts = nomeScuola.trim().split(" ");
  const nome1 = scuolaParts[0];
  const nome2 = scuolaParts.length > 1 ? scuolaParts[1] : "";

  const username = generateUsername(nome1, nome2, tipologia);
  const password = username;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateUniqueID();

  const newUser = {
    attivo: true,
    id,
    username,
    password: hashedPassword,
    emailReferente,
    nomeScuola,
    tipologia,
    codiceMeccanografico,
    role: 'admin',
    firstLogin: true
  };

  users.push(newUser);
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  return res.status(201).json({
    success: true,
    message: `Account ${username} creato con successo!`,
    username,
    id
  });
};

export const AdminEsistenti = async (req, res) => {
  if (!existsSync(USERS_FILE)) return res.status(404).json({ success: false, message: "Nessun utente trovato." });

  const users = JSON.parse(readFileSync(USERS_FILE));
  const adminUsers = users.filter(user => user.role === 'admin');

  if (adminUsers.length === 0) {
    return res.status(200).json({
      "success": true,
      "adminUsers": []
    }
    );
  }

  return res.status(200).json({ success: true, adminUsers });
};

export const ModificaStato = async (req, res) => {
  const { id } = req.params;
  const { attivo } = req.body;

  if (!existsSync(USERS_FILE)) {
    return res.status(404).json({ success: false, message: "Nessun utente trovato." });
  }

  const users = JSON.parse(readFileSync(USERS_FILE));

  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Amministratore non trovato." });
  }

  // Aggiorniamo lo stato 'attivo' dell'amministratore
  users[userIndex].attivo = attivo;

  // Modifichiamo lo stato 'attivo' per tutti i professori associati a questo admin
  users.forEach(user => {
    if (user.idAdmin === id) {
      user.attivo = attivo; // Impostiamo lo stato 'attivo' anche per i professori associati
    }
  });

  // Salviamo i dati aggiornati nel file
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  return res.status(200).json({
    success: true,
    message: `Stato dell'amministratore ${users[userIndex].username} e dei professori associati aggiornato con successo!`,
    attivo: users[userIndex].attivo
  });
};

export const EliminaAdmin = async (req, res) => {
  const { id } = req.params;

  if (!existsSync(USERS_FILE)) {
    return res.status(404).json({ success: false, message: "Nessun utente trovato." });
  }

  // Carichiamo tutti gli utenti
  const users = JSON.parse(readFileSync(USERS_FILE));

  // Troviamo l'indice dell'amministratore
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Amministratore non trovato." });
  }

  // Estrai gli ID dei professori collegati a questo admin
  const professoriAssociati = users
    .filter(user => user.idAdmin === id)
    .map(user => user.id);

  // Rimuove l'amministratore e i suoi professori dal file utenti
  const utentiAggiornati = users.filter(user =>
    user.id !== id && user.idAdmin !== id
  );
  writeFileSync(USERS_FILE, JSON.stringify(utentiAggiornati, null, 2));

  // Rimuovi professori da docenti.json
  if (existsSync(PROFESSORS_FILE)) {
    const profData = JSON.parse(readFileSync(PROFESSORS_FILE));
    const updatedProf = profData.filter(prof => !professoriAssociati.includes(prof.id));
    writeFileSync(PROFESSORS_FILE, JSON.stringify(updatedProf, null, 2));
  }

  // Rimuovi disponibilità da disp.json
  if (existsSync(DISPONIBILITA_FILE)) {
    const dispData = JSON.parse(readFileSync(DISPONIBILITA_FILE));
    const updatedDisp = dispData.filter(disp => !professoriAssociati.includes(disp.id));
    writeFileSync(DISPONIBILITA_FILE, JSON.stringify(updatedDisp, null, 2));
  }

  // Rimuovi orari da orario.json (in base all'admin ID)
  if (existsSync(TIME_TABLE_FILE)) {
    const orari = JSON.parse(readFileSync(TIME_TABLE_FILE));
    const updatedOrari = orari.filter(orario => orario.idAdmin !== id);
    writeFileSync(TIME_TABLE_FILE, JSON.stringify(updatedOrari, null, 2));
  }

  return res.status(200).json({
    success: true,
    message: `Amministratore con ID ${id} e tutti i dati collegati eliminati con successo!`
  });
};

export const AggiornaAdmin = async (req, res) => {
  const { id } = req.params;
  const { nomeScuola, tipologia, emailReferente, codiceMeccanografico } = req.body;

  if (!existsSync(USERS_FILE)) {
    return res.status(404).json({ success: false, message: "File utenti non trovato." });
  }

  const users = JSON.parse(readFileSync(USERS_FILE));
  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "Amministratore non trovato." });
  }

  const user = users[userIndex];

  if (user.role !== "admin") {
    return res.status(403).json({ success: false, message: "L'utente non è un amministratore." });
  }

  // Aggiorna i dati
  users[userIndex] = {
    ...user,
    nomeScuola: nomeScuola ?? user.nomeScuola,
    tipologia: tipologia ?? user.tipologia,
    emailReferente: emailReferente ?? user.emailReferente,
    codiceMeccanografico: codiceMeccanografico ?? user.codiceMeccanografico,
  };

  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  return res.status(200).json({
    success: true,
    message: "Dati dell'amministratore aggiornati con successo.",
    updatedUser: users[userIndex],
  });
};

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // I mesi partono da 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const SegnalaProblema = async (req, res) => {
  const { descrizione } = req.body;

  if (!descrizione) {
    return res.status(400).json({ success: false, message: 'Descrizione del problema obbligatoria.' });
  }

  const token = req.headers.authorization?.split(' ')[1]; // Estrarre il token dall'header
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token mancante' });
  }

  try {
    // Decodifica il token
    const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS);
    const idAdmin = decodedToken?.id;

    if (!idAdmin) {
      return res.status(400).json({ success: false, message: 'ID amministratore non trovato nel token' });
    }

    // Carica gli utenti dal file USERS_FILE
    if (!existsSync(USERS_FILE)) {
      return res.status(404).json({ success: false, message: 'File utenti non trovato.' });
    }

    const utenti = JSON.parse(readFileSync(USERS_FILE));
    const admin = utenti.find(user => user.id === idAdmin && user.role === 'admin');

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Amministratore non trovato.' });
    }

    // Crea una nuova segnalazione
    const nuovaSegnalazione = {
      id: UniqueID(),
      nomeScuola: admin.nomeScuola,
      data: formatDate(new Date()), // Data nel formato DD-MM-YYYY
      descrizione,
      stato: false,
    };

    // Carica le segnalazioni esistenti e aggiungi la nuova
    let segnalazioni = [];
    if (existsSync(SEGNALE_FILE)) {
      segnalazioni = JSON.parse(readFileSync(SEGNALE_FILE));
    }

    segnalazioni.push(nuovaSegnalazione);

    // Salva i dati delle segnalazioni
    writeFileSync(SEGNALE_FILE, JSON.stringify(segnalazioni, null, 2));

    return res.status(201).json({
      success: true,
      message: 'Segnalazione inviata con successo.',
      segnalazione: nuovaSegnalazione,
    });
  } catch (error) {
    console.error('Errore nel decodificare il token:', error);
    return res.status(401).json({ success: false, message: 'Token non valido o scaduto' });
  }
};

export const Segnalazioni = async (req, res) => {
  if (!existsSync(SEGNALE_FILE)) {
    return res.status(404).json({ success: false, message: 'Nessuna segnalazione trovata.' });
  }

  let segnalazioni = JSON.parse(readFileSync(SEGNALE_FILE));

  if (segnalazioni.length === 0) {
    return res.status(200).json({ success: true, segnalazioni: [] });
  }

  const oggi = new Date();

  // Funzione per convertire "DD-MM-YYYY" in oggetto Date
  const parseData = (dataStr) => {
    const [giorno, mese, anno] = dataStr.split('-').map(Number);
    return new Date(anno, mese - 1, giorno);
  };

  // Filtra ed elimina quelle con stato: true più vecchie di 90 giorni
  const filtrate = segnalazioni.filter(seg => {
    const dataSegnalazione = parseData(seg.data);
    const diffTime = oggi - dataSegnalazione;
    const diffGiorni = diffTime / (1000 * 60 * 60 * 24);
    return !(seg.stato === true && diffGiorni > 90);
  });

  // Aggiorna il file solo se sono state rimosse segnalazioni
  if (filtrate.length !== segnalazioni.length) {
    writeFileSync(SEGNALE_FILE, JSON.stringify(filtrate, null, 2));
  }

  // Ordina le segnalazioni dalla più recente alla più vecchia
  filtrate.sort((a, b) => parseData(b.data) - parseData(a.data));

  return res.status(200).json({ success: true, segnalazioni: filtrate });
};

export const ModificaStatoSegnalazione = async (req, res) => {
  const { id } = req.params;
  const { stato } = req.body;

  if (!existsSync(SEGNALE_FILE)) {
    return res.status(404).json({ success: false, message: 'Nessuna segnalazione trovata.' });
  }

  let segnalazioni = JSON.parse(readFileSync(SEGNALE_FILE));
  const segnalazioneIndex = segnalazioni.findIndex(seg => seg.id === id);

  if (segnalazioneIndex === -1) {
    return res.status(404).json({ success: false, message: 'Segnalazione non trovata.' });
  }

  segnalazioni[segnalazioneIndex].stato = stato;
  writeFileSync(SEGNALE_FILE, JSON.stringify(segnalazioni, null, 2));

  return res.status(200).json({
    success: true,
    message: 'Stato della segnalazione aggiornato con successo.',
    segnalazione: segnalazioni[segnalazioneIndex],
  });
};

export const EliminaSegnalazioni = async (req, res) => {
  if (!existsSync(SEGNALE_FILE)) {
    return res.status(404).json({ success: false, message: 'Nessuna segnalazione trovata.' });
  }

  // Sovrascrivi il file con un array vuoto
  writeFileSync(SEGNALE_FILE, JSON.stringify([], null, 2));

  return res.status(200).json({
    success: true,
    message: 'Tutte le segnalazioni sono state eliminate con successo.',
  });
};
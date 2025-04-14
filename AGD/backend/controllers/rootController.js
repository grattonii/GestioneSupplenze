import { writeFileSync, readFileSync, existsSync } from 'fs';
import bcrypt from 'bcrypt';

const USERS_FILE = "./data/users.json";
const PROFESSORS_FILE = "./data/docenti.json";
const TIME_TABLE_FILE = "./data/orario.json";
const DISPONIBILITA_FILE = "./data/disp.json";

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
    return res.status(404).json({ success: false, message: "Nessun amministratore trovato." });
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
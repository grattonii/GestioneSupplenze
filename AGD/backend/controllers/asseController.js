import { existsSync, writeFileSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assenzeFilePath = path.join(__dirname, "../data/assenze.json");
const USERS_FILE = path.join(__dirname,"../data/users.json");

// Funzione per leggere il file JSON
const readAssenze = () => {
    if (!existsSync(assenzeFilePath)) {
        writeFileSync(assenzeFilePath, JSON.stringify([]));
    }
    const data = readFileSync(assenzeFilePath);
    return JSON.parse(data);
};

// Funzione per scrivere nel file JSON
const writeAssenze = (assenze) => {
    writeFileSync(assenzeFilePath, JSON.stringify(assenze, null, 2));
};

// Endpoint per aggiungere una nuova assenza
export const assenzaDocente = (req, res) => {
    const { date, reason, note } = req.body;

    if (!date || !reason) {
        return res.status(400).json({ error: "Data e motivo sono obbligatori." });
    }

    const token = req.headers.authorization?.split(' ')[1]; // Estrarre il token dall'header
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token mancante' });
    }

    try {
        // Decodifica il token
        const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS);
        const id = decodedToken?.id;

        if (!id) {
            return res.status(400).json({ success: false, message: 'ID non trovato nel token' });
        }

        if (!existsSync(USERS_FILE)) {
            return res.status(404).json({ success: false, message: 'File utenti non trovato.' });
        }

        const utenti = JSON.parse(readFileSync(USERS_FILE));
        const user = utenti.find(user => user.id === id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utente non trovato.' });
        }

        const assenze = readAssenze();
        const newAbsence = {
            id: id,
            idAdmin: user.idAdmin,
            date,
            reason,
            note,
            accettata: false,
        };

        assenze.push(newAbsence);
        writeAssenze(assenze);
        return res.status(201).json(newAbsence);
    }
    catch (error) {
        console.error("Errore nella decodifica del token:", error);
        return res.status(401).json({ success: false, message: 'Token non valido' });
    }
};

export const Assenze = (req, res) => {
    const assenze = readAssenze();

    const filteredAssenze = assenze.filter((assenza) => assenza.idAdmin === req.user.id);
    res.json(filteredAssenze);
};
import express, { json } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { readFileSync, writeFileSync } from "fs";

const app = express();
app.use(cors());
app.use(json());

const USERS_FILE = "users.json";

// Funzione per registrare un nuovo utente
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Compila tutti i campi!" });
    }

    try {
        // Legge gli utenti esistenti
        const users = JSON.parse(readFileSync(USERS_FILE));

        // Controlla se l'utente esiste già
        if (users.some(user => user.username === username)) {
            return res.status(400).json({ message: "Utente già esistente!" });
        }

        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 è il numero di salt rounds

        // Aggiunge il nuovo utente
        users.push({ username, password: hashedPassword });

        // Salva nel file JSON
        writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

        res.json({ success: true, message: "Registrazione completata!" });
    } catch (error) {
        res.status(500).json({ message: "Errore del server!" });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Compila tutti i campi!" });
    }

    try {
        // Legge gli utenti dal file JSON
        const users = JSON.parse(readFileSync(USERS_FILE));

        // Cerca l'utente corrispondente
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(401).json({ success: false, message: "Credenziali errate!" });
        }

        // Confronta la password inserita con quella hashata
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Credenziali errate!" });
        }

        res.json({ success: true, message: "Login riuscito!" });
    } catch (error) {
        res.status(500).json({ message: "Errore del server!" });
    }
});
import { writeFileSync, readFileSync, existsSync } from 'fs';
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/users.json");

export const UtentiEsistenti = async (req, res) => {
    if (!existsSync(filePath)) return res.status(404).json({ success: false, message: "Nessun utente trovato." });

    const users = JSON.parse(readFileSync(filePath));
    const Users = users.filter(user => user.role === 'professore' || user.role === 'admin2');

    if (Users.length === 0) {
        return res.status(404).json({ success: false, message: "Nessun utente trovato." });
    }

    return res.status(200).json({ success: true, Users });
};

export const ModificaRuolo = async (req, res) => {
    const { id } = req.params;
    const { ruolo } = req.body;

    if (!existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "Nessun utente trovato." });
    }

    const users = JSON.parse(readFileSync(filePath));

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utente non trovato." });
    }

    users[userIndex].ruolo = ruolo;

    // Salviamo i dati aggiornati nel file
    writeFileSync(filePath, JSON.stringify(users, null, 2));

    return res.status(200).json({
        success: true,
        message: `Ruolo dell'utente ${users[userIndex].username} aggiornato con successo!`,
        ruolo: users[userIndex].ruolo
    });
};

export const EliminaUtente = async (req, res) => {
    const { id } = req.params;

    if (!existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "Nessun utente trovato." });
    }

    const users = JSON.parse(readFileSync(filePath));
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utente non trovato." });
    }

    users.splice(userIndex, 1); // Rimuoviamo l'utente dall'array
    writeFileSync(filePath, JSON.stringify(users, null, 2));

    return res.status(200).json({
        success: true,
        message: `Utente con ID ${id} eliminato con successo!`
    });
}

export const ResetPassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "Nessun utente trovato." });
    }

    const users = JSON.parse(readFileSync(filePath));
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utente non trovato." });
    }

    users[userIndex].password = bcrypt.hashSync(users[userIndex].username, 10); // Impostiamo la password a quella di default (username)
    users[userIndex].firstLogin = true; // Impostiamo firstLogin a true
    writeFileSync(filePath, JSON.stringify(users, null, 2));

    return res.status(200).json({
        success: true,
        message: `Password dell'utente ${users[userIndex].username} aggiornata con successo!`,
        password: users[userIndex].password
    });
}
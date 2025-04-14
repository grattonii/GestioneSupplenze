import { writeFileSync, readFileSync, existsSync } from 'fs';
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROFESSORS_FILE = path.join(__dirname,"../data/docenti.json");
const USERS_FILE = path.join(__dirname,"../data/users.json");
const ORARIO_FILE = path.join(__dirname,"../data/orario.json");
const DISP_FILE = path.join(__dirname,"../data/disp.json");


export const UtentiEsistenti = async (req, res) => {
    if (!existsSync(USERS_FILE)) return res.status(404).json({ success: false, message: "Nessun utente trovato." });

    const users = JSON.parse(readFileSync(USERS_FILE));
    const Users = users.filter(user => user.role === 'docente' || user.role === 'admin2');

    if (Users.length === 0) {
        return res.status(404).json({ success: false, message: "Nessun utente trovato." });
    }

    return res.status(200).json({ success: true, Users });
};

export const ModificaRuolo = async (req, res) => {
    const { id } = req.params;
    const { ruolo } = req.body;

    if (!existsSync(USERS_FILE)) {
        return res.status(404).json({ success: false, message: "Nessun utente trovato." });
    }

    const users = JSON.parse(readFileSync(USERS_FILE));

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utente non trovato." });
    }

    users[userIndex].role = ruolo;

    // Salviamo i dati aggiornati nel file
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return res.status(200).json({
        success: true,
        message: `Ruolo dell'utente ${users[userIndex].username} aggiornato con successo!`,
        ruolo: users[userIndex].role
    });
};

export const EliminaUtente = async (req, res) => {
    const { id } = req.params;

    if (!existsSync(USERS_FILE)) {
        return res.status(404).json({ success: false, message: "Nessun utente trovato." });
    }

    const users = JSON.parse(readFileSync(USERS_FILE));
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utente non trovato." });
    }

    users.splice(userIndex, 1); // Rimuoviamo l'utente dall'array
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    if (existsSync(PROFESSORS_FILE)) {
        const professors = JSON.parse(readFileSync(PROFESSORS_FILE));
        const professorIndex = professors.findIndex(prof => prof.id === id);

        if (professorIndex !== -1) {
            professors.splice(professorIndex, 1); // Rimuoviamo il professore dall'array
            writeFileSync(PROFESSORS_FILE, JSON.stringify(professors, null, 2));
        }
    }

    if (existsSync(ORARIO_FILE)) {
        const orario = JSON.parse(readFileSync(ORARIO_FILE));
        const orarioIndex = orario.findIndex(or => or.id === id);

        if (orarioIndex !== -1) {
            orario.splice(orarioIndex, 1); // Rimuoviamo l'orario dall'array
            writeFileSync(ORARIO_FILE, JSON.stringify(orario, null, 2));
        }
    }

    if (existsSync(DISP_FILE)) {
        const disp = JSON.parse(readFileSync(DISP_FILE));
        const dispIndex = disp.findIndex(d => d.id === id);

        if (dispIndex !== -1) {
            disp.splice(dispIndex, 1); // Rimuoviamo la disponibilità dall'array
            writeFileSync(DISP_FILE, JSON.stringify(disp, null, 2));
        }
    }

    return res.status(200).json({
        success: true,
        message: `Utente con ID ${id} eliminato con successo!`
    });
}

export const ResetPassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!existsSync(USERS_FILE)) {
        return res.status(404).json({ success: false, message: "Nessun utente trovato." });
    }

    const users = JSON.parse(readFileSync(USERS_FILE));
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "Utente non trovato." });
    }

    users[userIndex].password = bcrypt.hashSync(users[userIndex].username, 10); // Impostiamo la password a quella di default (username)
    users[userIndex].firstLogin = true; // Impostiamo firstLogin a true
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return res.status(200).json({
        success: true,
        message: `Password dell'utente ${users[userIndex].username} aggiornata con successo!`,
        password: users[userIndex].password
    });
}
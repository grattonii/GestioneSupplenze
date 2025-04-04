import { writeFileSync, readFileSync, existsSync } from 'fs';
import bcrypt from 'bcrypt';

const USERS_FILE = "./data/users.json";

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
    const firstLetterCognome = nome2 ? nome2.charAt(0).toUpperCase() : "X"; // Default "X" se manca
    const firstLetterScuola = tipologia.charAt(0).toUpperCase();
    const randomNumbers = Math.floor(1000000 + Math.random() * 9000000); // 7 cifre casuali
    return `${firstLetterNome}${firstLetterCognome}${randomNumbers}${firstLetterScuola}`;
}

export const GeneraAdmin = async (req, res) => {
    const { nomeScuola, tipologia, emailReferente, codiceMeccanografico } = req.body;
    if (!nomeScuola || !tipologia || !emailReferente || !codiceMeccanografico) {
        return res.status(400).json({ success: false, message: "Tutti i campi sono obbligatori." });
    }

    const users = existsSync(USERS_FILE) ? JSON.parse(readFileSync(USERS_FILE)) : [];

    const scuolaParts = nomeScuola.trim().split(" "); 
    const nome1 = scuolaParts[0]; // Primo nome
    const nome2 = scuolaParts.length > 1 ? scuolaParts[1] : ""; // Secondo nome opzionale

    const username = generateUsername(nome1, nome2, tipologia);
    const password = username; // Password uguale allo username
    const hashedPassword = bcrypt.hashSync(password, 10);
    const id = generateUniqueID(); // Genera un ID unico

    users.push({
        attivo: true,
        id,
        username,
        password: hashedPassword,
        email: emailReferente,
        codiceMeccanografico,
        role: 'admin',
        firstLogin: true
    });

    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return res.status(201).json({ success: true, message: `Account ${username} creato con successo!` });
};
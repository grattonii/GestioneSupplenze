import { writeFileSync, readFileSync, existsSync } from 'fs';
import bcrypt from 'bcrypt';

const USERS_FILE = "./data/users.json";

function generateUsername(nome1, nome2, tipologia) {
    const firstLetterNome = nome1.charAt(0).toUpperCase();
    const firstLetterCognome = nome2.charAt(0).toUpperCase();
    const firstLetterScuola = tipologia.charAt(0).toUpperCase();
    const randomNumbers = Math.floor(1000000 + Math.random() * 9000000); // 7 cifre casuali
    return `${firstLetterNome}${firstLetterCognome}${randomNumbers}${firstLetterScuola}`;
}

export const GeneraAdmin = async (req, res) => {
    const { nomeScuola, tipologia } = req.body;
    const users = existsSync(USERS_FILE) ? JSON.parse(readFileSync(USERS_FILE)) : [];

    const scuolaParts = nomeScuola.trim().split(" "); 
    const nome1 = scuolaParts[0]; // Primo nome
    const nome2 = scuolaParts.length > 1 ? scuolaParts[1] : ""; // Secondo nome (o stringa vuota se manca)

    if (!nome1 || !nome2) {
        return res.status(400).json({ success: false, message: "Il nome della scuola deve contenere almeno nome e cognome." });
    }

    const username = generateUsername(nome1, nome2, tipologia);
    const password = username; // Password uguale allo username
    const hashedPassword = bcrypt.hashSync(password, 10);
    const id = nome1.charAt(0).toUpperCase() + "1";

    users.push({ attivo: true, id, username, password: hashedPassword, email, role: 'professore', firstLogin: true });

    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return { success: true, message: `Account  ${username} creato con successo!` };

}
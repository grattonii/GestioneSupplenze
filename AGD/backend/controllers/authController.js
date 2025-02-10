import bcrypt from "bcrypt";
import { readFileSync, writeFileSync, existsSync } from "fs";

const USERS_FILE = "./data/users.json";

// Se il file non esiste, creiamo l'admin di default
if (!existsSync(USERS_FILE)) {
    const hashedAdminPassword = bcrypt.hashSync("admin", 10);
    const defaultUsers = [
        { username: "admin", password: hashedAdminPassword, role: "admin" }
    ];
    
    writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
} else {
    // Se il file esiste, assicuriamoci che contenga almeno l'utente admin
    const users = JSON.parse(readFileSync(USERS_FILE));
    if (!users.some(user => user.username === "admin")) {
        const hashedAdminPassword = bcrypt.hashSync("admin", 10);
        users.push({ username: "admin", password: hashedAdminPassword, role: "admin" });
        writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    }
}

// Funzione per il login
export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Compila tutti i campi!" });
    }

    try {
        const users = JSON.parse(readFileSync(USERS_FILE));
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(401).json({ message: "Credenziali errate!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenziali errate!" });
        }

        res.json({ success: true, message: "Login riuscito!", role: user.role });
    } catch (error) {
        res.status(500).json({ message: "Errore del server!" });
    }
};
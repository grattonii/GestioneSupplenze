import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readFileSync, writeFileSync, existsSync } from "fs";

const USERS_FILE = "./data/users.json";
const SECRET_KEY = "G7X9B2M4Q5Z1";

// Se il file non esiste, creiamo l'admin di default
if (!existsSync(USERS_FILE)) {
    const hashedAdminPassword = bcrypt.hashSync("admin", 10);
    const defaultUsers = [
        { username: "admin", password: hashedAdminPassword, role: "admin", firstLogin: true }
    ];

    writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
}

// Funzione per il login
export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Compila tutti i campi!" });
    }

    try {
        let users = JSON.parse(readFileSync(USERS_FILE));
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(401).json({ message: "Credenziali errate!" });
        }


        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenziali errate!" });
        }

        const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

        // Controlliamo se è il primo login
        const userIndex = users.findIndex(u => u.username === username);
        const firstLogin = user.firstLogin;
        if (firstLogin) {
            users[userIndex].firstLogin = false;
            writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        }

        res.json({
            success: true,
            message: "Login riuscito!",
            token,
            role: user.role,
            firstLogin
        });

    } catch (error) {
        res.status(500).json({ message: "Errore del server!" });
    }
};

// Middleware per verificare il token
export const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Token mancante, accesso negato!" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token non valido!" });
        }
        req.user = user;
        next();
    });
};

// Funzione per aggiornare username e password
export const updateUser = async (req, res) => {
    const { newUsername, newPassword } = req.body;

    if (!newUsername || !newPassword) {
        return res.status(400).json({ message: "Compila tutti i campi!" });
    }

    try {
        let users = JSON.parse(readFileSync(USERS_FILE));
        const userIndex = users.findIndex(u => u.username === req.user.username);

        if (userIndex === -1) {
            return res.status(404).json({ message: "Utente non trovato!" });
        }

        users[userIndex].username = newUsername;
        users[userIndex].password = bcrypt.hashSync(newPassword, 10);

        writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

        const newToken = jwt.sign(
            { username: newUsername, role: users[userIndex].role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.json({
            success: true,
            message: "Username e password aggiornati!",
            token: newToken // Restituiamo il nuovo token
        });
        
    } catch (error) {
        res.status(500).json({ message: "Errore del server!" });
    }
};
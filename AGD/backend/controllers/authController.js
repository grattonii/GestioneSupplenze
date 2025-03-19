import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { readFileSync, writeFileSync, existsSync } from "fs";

const USERS_FILE = "./data/users.json";
dotenv.config();

// Se il file non esiste, creiamo l'root di default
if (!existsSync(USERS_FILE)) {
    const hashedAdminPassword = bcrypt.hashSync("AGDagency", 10);
    const defaultUsers = [
        { id: "R1", username: "AGDagency", password: hashedAdminPassword, role: "root" }
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
        let users = [];
        try {
            users = JSON.parse(readFileSync(USERS_FILE));
        } catch (error) {
            console.error("Errore nella lettura del file utenti:", error);
            users = [];
        }
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(401).json({ message: "Credenziali errate!" });
        }


        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Credenziali errate!" });
        }

        const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.SECRET_ACCESS, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_REFRESH, { expiresIn: "7d" });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        });

        // Controlliamo se è il primo login
        const userIndex = users.findIndex(u => u.username === username);
        const firstLogin = user.firstLogin || false;
        if (firstLogin) {
            users[userIndex].firstLogin = false;
            writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        }

        res.json({
            success: true,
            message: "Login riuscito!",
            accessToken,
            role: user.role,
            firstLogin
        });

    } catch (error) {
        console.error("Errore durante il login:", error);
        res.status(500).json({ message: "Errore del server!", error: error.message });
    }
};

// Middleware per verificare il token
export const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Token mancante, accesso negato!" });
    }

    jwt.verify(token, process.env.SECRET_ACCESS, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token non valido!" });
        }
        req.user = user;
        next();
    });
};

export const refreshToken = (req, res) => {
    const refreshToken = req.cookies?.refreshToken; // Controlla se il cookie esiste

    if (!refreshToken) {
        return res.status(200).json({ accessToken: null, message: "Nessun token di refresh presente. Effettua il login." });
    }

    jwt.verify(refreshToken, process.env.SECRET_REFRESH, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token non valido" });
        }

        const newAccessToken = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.SECRET_ACCESS,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    });
};


// Funzione per aggiornare username e password
export const updateUser = async (req, res) => {
    const { newPassword } = req.body;

    try {
        let users = JSON.parse(readFileSync(USERS_FILE));
        const userIndex = users.findIndex(u => u.username === req.user.username);

        if (userIndex === -1) {
            return res.status(404).json({ message: "Utente non trovato!" });
        }

        users[userIndex].password = bcrypt.hashSync(newPassword, 10);

        writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

        const newToken = jwt.sign(
            { id: users[userIndex].id, username: users[userIndex].username, role: users[userIndex].role },
            SECRET_ACCESS,
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
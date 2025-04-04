import { writeFileSync, readFileSync, existsSync } from 'fs';
import bcrypt from 'bcrypt';
import pkg from 'exceljs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { Workbook } = pkg;

const USERS_FILE = './data/users.json';
const DOCENTI_FILE = './data/docenti.json';

function generateUniqueID() {
    if (!existsSync(USERS_FILE)) return "AAA"; // ID di default

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

function generateUsername(nome, cognome) {
    const firstLetterNome = nome.charAt(0).toUpperCase();
    const firstLetterCognome = cognome.charAt(0).toUpperCase();
    const randomNumbers = Math.floor(1000000 + Math.random() * 9000000);
    return `${firstLetterNome}${firstLetterCognome}${randomNumbers}D`;
}

export const generateAccounts = (req, docenti) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        console.error("Token mancante");
        return;
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS);
        const idAdmin = decodedToken?.id;
        if (!idAdmin) {
            console.error("ID amministratore non trovato nel token");
            return;
        }

        if (!existsSync(DOCENTI_FILE)) {
            console.error('Nessun file docenti trovato!');
            return;
        }

        const users = existsSync(USERS_FILE) ? JSON.parse(readFileSync(USERS_FILE)) : [];

        docenti.forEach(docente => {
            const { id, nome, cognome, email } = docente;
            if (!nome || !cognome || !email) {
                console.warn(`Dati incompleti per: ${nome} ${cognome}, saltato.`);
                return;
            }

            const username = generateUsername(nome, cognome);
            const password = username;
            const hashedPassword = bcrypt.hashSync(password, 10);

            users.push({ attivo: true, idAdmin, id, username, password: hashedPassword, email, role: 'professore', firstLogin: true });
        });

        writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('Account professori creati con successo!');

    } catch (error) {
        console.error('Errore nella generazione degli account:', error);
    }
};

export const uploadDocenti = async (req, res) => {
    const filePath = req.file.path;

    try {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        const docenti = [];

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const id = generateUniqueID();
                const nome = row.getCell(1).text.trim();
                const cognome = row.getCell(2).text.trim();
                const email = row.getCell(3).text.trim();
                const numero = row.getCell(4).text.trim();
                const materie = row.getCell(5).text.trim();
                const classi = row.getCell(6).text.trim().split(',').map(c => c.trim());

                if (!nome || !cognome || !email) {
                    console.warn(`Dati incompleti per: ${nome} ${cognome}, saltato.`);
                    return;
                }

                docenti.push({ id, nome, cognome, email, numero, materie, classi });
            }
        });

        writeFileSync(DOCENTI_FILE, JSON.stringify(docenti, null, 2));
        generateAccounts(req, docenti);

        res.json({ success: true, message: 'Dati docenti caricati con successo!' });

    } catch (error) {
        console.error('Errore nel caricamento:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Errore nel caricamento!' });
        }
    }
};
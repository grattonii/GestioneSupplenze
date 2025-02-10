import pkg from 'exceljs';
import { writeFileSync, readFileSync } from "fs";
import bcrypt from "bcrypt";

const { Workbook } = pkg;
const USERS_FILE = "./data/users.json";

function generateRandomPassword(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateUsername(nome, cognome) {
    const firstLetterNome = nome.charAt(0).toUpperCase();
    const firstLetterCognome = cognome.charAt(0).toUpperCase();
    const randomNumbers = Math.floor(1000000 + Math.random() * 9000000); // 7 cifre casuali
    return `${firstLetterNome}${firstLetterCognome}${randomNumbers}D`;
}

// Funzione per caricare Excel e creare utenti
export const uploadProf = async (req, res) => {
    const filePath = req.file.path;

    try {
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        const users = JSON.parse(readFileSync(USERS_FILE));

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Salta l'intestazione
                const nome = row.getCell(1).text.trim();
                const cognome = row.getCell(2).text.trim();
                const email = row.getCell(3).text.trim();

                const username = generateUsername(nome, cognome);
                const password = generateRandomPassword();
                const hashedPassword = bcrypt.hashSync(password, 10);

                users.push({ username, password: hashedPassword, email, role: "professore" });

                console.log(`Creato account: ${username} con password: ${password}`);
            }
        });

        writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

        res.json({ success: true, message: "Professori caricati con successo!" });
    } catch (error) {
        console.error("Errore nel caricamento:", error);
        res.status(500).json({ message: "Errore nel caricamento!" });
    }
};
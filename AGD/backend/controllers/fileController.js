import { writeFileSync, readFileSync, existsSync } from 'fs';
import bcrypt from 'bcrypt';
import pkg from 'exceljs';
const { Workbook } = pkg;

const USERS_FILE = './data/users.json';
const DOCENTI_FILE = './data/docenti.json';
const MATERIE_FILE = './data/materie.txt';

function loadMaterie() {
    if (!existsSync(MATERIE_FILE)) {
        throw new Error('File delle materie non trovato!');
    }
    return readFileSync(MATERIE_FILE, 'utf-8').split(',').map(m => m.trim().toLowerCase());
}

function generateUsername(nome, cognome) {
    const firstLetterNome = nome.charAt(0).toUpperCase();
    const firstLetterCognome = cognome.charAt(0).toUpperCase();
    const randomNumbers = Math.floor(1000000 + Math.random() * 9000000); // 7 cifre casuali
    return `${firstLetterNome}${firstLetterCognome}${randomNumbers}D`;
}

export const generateAccounts = (res) => {
    try {
        // Controlla se il file docenti.json esiste
        if (!existsSync(DOCENTI_FILE)) {
            return res.status(400).json({ message: 'Nessun file docenti trovato! Carica prima i docenti.' });
        }

        // Legge i dati dei docenti
        let num = 2;
        const docenti = JSON.parse(readFileSync(DOCENTI_FILE));
        const users = existsSync(USERS_FILE) ? JSON.parse(readFileSync(USERS_FILE)) : [];

        docenti.forEach(docente => {
            const { nome, cognome, email } = docente;

            if (!nome || !cognome || !email) {
                console.warn(`Dati incompleti per: ${nome} ${cognome}, saltato.`);
                return;
            }

            const username = generateUsername(nome, cognome);
            const password = username; // Password uguale allo username
            const hashedPassword = bcrypt.hashSync(password, 10);
            const id = "I" + num;

            users.push({ attivo: true, id, username, password: hashedPassword, email, role: 'professore', firstLogin: true });
            num++;
        });

        // Salva gli utenti aggiornati
        writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

       return { success: true, message: 'Account professori creati con successo!' };
    } catch (error) {
        console.error('Errore nel caricamento:', error);
        res.status(500).json({ message: 'Errore nel caricamento!' });
    }
};

// Funzione per caricare ODS e salvare dati docenti
export const uploadDocenti = async (req, res) => {
    const filePath = req.file.path;
    
    try {
        const materieList = loadMaterie();
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        
        const docenti = [];
        

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) { // Salta l'intestazione
                const nome = row.getCell(1).text.trim();
                const cognome = row.getCell(2).text.trim();
                const email = row.getCell(3).text.trim();
                const numero = row.getCell(4).text.trim();
                const materie = row.getCell(5).text.trim();
                const classi = row.getCell(6).text.trim().split(',').map(c => c.trim()); // Converte in array
                
                // Controllo sui tipi di dati
                //!! Da gestire in caso di non rispetto dei tipi di dati un messaggio di errore apprropriato con reinserimento
                if (!nome || typeof nome !== 'string'|| nome.length < 2 || nome.length > 50) { //! Controllo nome
                    return res.status(400).json({ message: `Errore nel nome del docente alla riga ${rowNumber}.` });
                }
                if (!cognome || typeof cognome !== 'string' || cognome.length < 2 || cognome.length > 50) { //! Controllo cognome
                    return res.status(400).json({ message: `Errore nel cognome del docente alla riga ${rowNumber}.` });
                }
                if (!email || !emailRegex.test(email)) { //! Controllo email
                    return res.status(400).json({ message: `Email non valida per il docente alla riga ${rowNumber}.` });
                }
                if (isNaN(numero) || numero.length < 7 || numero.length > 10) { //! Controllo numero di telefono
                    return res.status(400).json({ message: `Numero di telefono non valido alla riga ${rowNumber}.` });
                }
                if (!materie || !materie.split(',').map(m => m.trim().toLowerCase()).every(m => materieList.includes(m))) { //! Controllo materie
                    return res.status(400).json({ message: `Errore nelle materie assegnate al docente alla riga ${rowNumber}.` });
                }
                
                if (!Array.isArray(classi) || classi.length === 0) { //! Controllo classi
                     return res.status(400).json({ message: `Errore nelle classi assegnate al docente alla riga ${rowNumber}.` });
                }
                
                docenti.push({ nome, cognome, email, numero, materie, classi });
            }
        });

        writeFileSync(DOCENTI_FILE, JSON.stringify(docenti, null, 2));

        generateAccounts(res); // Genera account per i docenti

        res.json({ success: true, message: 'Dati docenti caricati con successo!' });
    } catch (error) {
        console.error('Errore nel caricamento:', error);
        res.status(500).json({ message: 'Errore nel caricamento!' });
    }
};

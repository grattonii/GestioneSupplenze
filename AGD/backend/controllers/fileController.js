import { writeFileSync, readFileSync, existsSync } from 'fs';
import bcrypt from 'bcrypt';
import pkg from 'exceljs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const { Workbook } = pkg;

const USERS_FILE = './data/users.json';
const DOCENTI_FILE = './data/docenti.json';
const MATERIE_FILE = './data/materie.txt';
const CLASSI_FILE = './data/classi.json';
const ORARIDOCENTI_FILE = './data/orariDocenti.json';
const ORARI_FILE = './data/orario.json';

function loadMaterie() {
    if (!existsSync(MATERIE_FILE)) {
        throw new Error('File delle materie non trovato!');
    }
    return readFileSync(MATERIE_FILE, 'utf-8').split(',').map(m => m.trim().toLowerCase());
}

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

            users.push({ attivo: true, idAdmin, id, username, password: hashedPassword, email, role: 'docente', firstLogin: true });
        });

        writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('Account professori creati con successo!');

    } catch (error) {
        console.error('Errore nella generazione degli account:', error);
    }
};

export const uploadDocenti = async (req, res) => {
    const fileDocenti = req.files['fileDocenti']?.[0];
    const fileOrari = req.files['fileOrari']?.[0];

    if (!fileDocenti || !fileOrari) {
        return res.status(400).json({ message: "Entrambi i file sono richiesti: file docenti e file orari." });
    }

    const { path: filePath } = fileDocenti;

    try {
        const materieList = loadMaterie();
        const workbook = new Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);

        const docenti = [];
        const classiUniche = new Set();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const id = generateUniqueID();
                const cognome = row.getCell(1).text.trim();
                const nome = row.getCell(2).text.trim();
                const email = row.getCell(3).text.trim();
                const numero = row.getCell(4).text.trim();
                const materie = row.getCell(5).text.trim();

                const classi = row.getCell(6).text.trim().split(',').map(c => c.trim());

                classi.forEach(c => {
                    if (c) classiUniche.add(c);
                });

                if (!nome || !cognome || !email) {
                    console.warn(`Dati incompleti per: ${nome} ${cognome}, saltato.`);
                    return;
                }

                // Controllo sui tipi di dati
                //!! Da gestire in caso di non rispetto dei tipi di dati un messaggio di errore apprropriato con reinserimento
                if (!nome || typeof nome !== 'string' || nome.length < 2 || nome.length > 50) { //! Controllo nome
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

                docenti.push({ id, nome, cognome, email, numero, materie, classi });
            }
        });

        writeFileSync(DOCENTI_FILE, JSON.stringify(docenti, null, 2));
        generateAccounts(req, docenti);

        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS);
            const idAdmin = decodedToken?.id;

            if (!idAdmin) {
                return res.status(401).json({ message: "Token non valido: ID admin non trovato." });
            }

            const nuoveClassi = [...classiUniche].sort();

            let classiData = [];
            if (existsSync(CLASSI_FILE)) {
                classiData = JSON.parse(readFileSync(CLASSI_FILE));
            }

            const index = classiData.findIndex(entry => entry.idAdmin === idAdmin);

            if (index >= 0) {
                // Unione e rimozione duplicati
                const classiSet = new Set([...classiData[index].classi, ...nuoveClassi]);
                classiData[index].classi = Array.from(classiSet).sort();
            } else {
                classiData.push({ idAdmin, classi: nuoveClassi });
            }

            writeFileSync(CLASSI_FILE, JSON.stringify(classiData, null, 2));
        } catch (err) {
            console.error("Errore durante la scrittura di classi.json:", err);
        }

        const esitoOrario = await OrarioDocente(req, docenti, fileOrari);

        if (esitoOrario?.error) {
            return res.status(esitoOrario.status || 500).json({
                message: 'Errore nel file orari.',
                dettagli: esitoOrario.dettagli || []
            });
        }

        return res.json({ success: true, message: 'Dati docenti caricati con successo!' });


    } catch (error) {
        console.error('Errore nel caricamento:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Errore nel caricamento!' });
        }
    }
};

const espandiGiorni = range => {
    const giorniSettimana = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
    const abbreviazioni = ["lun", "mar", "mer", "gio", "ven", "sab"];

    const [start, end] = range.split('-').map(s => s.trim().toLowerCase());
    const startIndex = abbreviazioni.indexOf(start);
    const endIndex = abbreviazioni.indexOf(end);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) return [];

    return giorniSettimana.slice(startIndex, endIndex + 1);
};

export const OrarioDocente = async (req, docenti, fileOrari) => {
    const { path: filePath } = fileOrari;
    const workbook = new Workbook();

    try {
        await workbook.xlsx.readFile(filePath);
    } catch (err) {
        console.error("Errore durante la lettura del file Excel:", err);
        return { error: true, status: 400, message: "Il file orari non è leggibile o non è un file Excel valido." };
    }

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
        return { error: true, status: 400, message: "Il foglio Excel non contiene dati." };
    }

    // Carica le fasce orarie dell'admin dal file orario.json
    let fasceOrarieAdmin;
    let giorniEspansi = [];
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS);
        const idAdmin = decodedToken?.id;

        if (!idAdmin) throw new Error("ID amministratore non trovato nel token");

        const orariData = fs.existsSync(ORARI_FILE) ? JSON.parse(fs.readFileSync(ORARI_FILE, "utf8")) : [];
        const orariAdmin = orariData.find(o => o.idAdmin === idAdmin);

        if (!orariAdmin || !orariAdmin.orari) {
            return { error: true, status: 400, message: "Fasce orarie non trovate per questo amministratore." };
        }

        const { inizioPrimaLezione, fineUltimaLezione, durataLezioni, giorniLezione } = orariAdmin.orari;
        giorniEspansi = espandiGiorni(giorniLezione); // ["Lunedì", ..., "Sabato"]


        const convertiInMinuti = orario => {
            const [ore, minuti] = orario.split(":").map(Number);
            return ore * 60 + minuti;
        };

        const durataLezione = parseInt(durataLezioni, 10);
        const inizio = convertiInMinuti(inizioPrimaLezione);
        const fine = convertiInMinuti(fineUltimaLezione);
        const numeroOre = Math.floor((fine - inizio) / durataLezione);
        fasceOrarieAdmin = { giorni: giorniLezione, ore: numeroOre };

    } catch (error) {
        console.error("Errore durante il recupero delle fasce orarie:", error);
        return { error: true, status: 400, message: "Impossibile validare le fasce orarie dell’amministratore." };
    }

    // Mappa colonne-giorni
    const giorniMap = [];
    const giornoRiga = worksheet.getRow(1);
    const colCount = worksheet.columnCount;
    let col = 2;
    let giornoCorrente = null;
    let colStart = col;

    while (col <= colCount + 1) {
        const cell = col <= colCount ? giornoRiga.getCell(col) : { text: '' };
        const giorno = cell.text.trim();

        if (giorno && giorno !== giornoCorrente) {
            if (giornoCorrente !== null) {
                giorniMap.push({ giorno: giornoCorrente, colStart, colEnd: col - 1 });
            }
            giornoCorrente = giorno;
            colStart = col;
        }

        col++;
    }

    if (giornoCorrente !== null) {
        giorniMap.push({ giorno: giornoCorrente, colStart, colEnd: col - 1 });
    }

    // Verifica struttura file
    const giorniNelFile = giorniMap.map(g => g.giorno);
    console.log("Giorni attesi:", giorniEspansi);
    console.log("Giorni trovati nel file:", giorniNelFile);

    if (
        giorniNelFile.length !== giorniEspansi.length ||
        !giorniEspansi.every(g => giorniNelFile.includes(g))
    ) {
        return {
            error: true,
            status: 400,
            message: "I giorni presenti nel file orari non corrispondono a quelli configurati dall’amministratore.",
            dettagli: { attesi: giorniEspansi, trovati: giorniNelFile }
        };
    }

    const numOreNelFile = giorniMap[0]?.colEnd - giorniMap[0]?.colStart + 1;
    console.log("Colonne nel file per giorno:", numOreNelFile);
    console.log("Ore calcolate dal config admin:", fasceOrarieAdmin.ore);

    if (numOreNelFile !== fasceOrarieAdmin.ore) {
        return {
            error: true,
            status: 400,
            message: `Il numero di ore per giorno (${numOreNelFile}) non corrisponde alle fasce orarie configurate (${fasceOrarieAdmin.ore}).`
        };
    }

    const orariPerDocente = [];
    const errori = [];

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const nomeCompleto = row.getCell(1).text.trim();
        if (!nomeCompleto) {
            console.warn(`Nome docente mancante alla riga ${rowNumber}`);
            return;
        }

        const docente = docenti.find(d =>
            `${d.cognome} ${d.nome}`.toLowerCase() === nomeCompleto.toLowerCase()
        );

        if (!docente) {
            console.warn(`Docente non presente nei dati caricati: ${nomeCompleto} (riga ${rowNumber})`);
            return;
        }

        const orario = {};
        const classiOrario = new Set();

        for (const g of giorniMap) {
            orario[g.giorno] = [];
            for (let col = g.colStart; col <= g.colEnd; col++) {
                const cell = row.getCell(col);
                const value = cell.text.trim();
                if (value) {
                    orario[g.giorno].push(value);
                    classiOrario.add(value);
                }
            }
        }

        const classiNonValide = [...classiOrario]
            .filter(classe => !docente.classi.includes(classe))  // Esclude le classi che il docente ha
            .filter(classe => classe !== 'X'); // Esclude le ore buche (X) e valori undefined/null
        if (classiNonValide.length > 0) {
            errori.push(`Errore nelle classi per il docente "${nomeCompleto}" alla riga ${rowNumber}: ${classiNonValide.join(', ')}`);
        }

        orariPerDocente.push({
            id: docente.id,
            giorni: orario,
        });
    });

    if (errori.length > 0) {
        return { error: true, status: 400, dettagli: errori };
    }

    try {
        writeFileSync(ORARIDOCENTI_FILE, JSON.stringify(orariPerDocente, null, 2));
        console.log('Orari dei docenti salvati correttamente!');
    } catch (err) {
        console.error("Errore durante il salvataggio degli orari:", err);
        return { error: true, status: 500, message: "Errore durante il salvataggio del file orari." };
    }
};
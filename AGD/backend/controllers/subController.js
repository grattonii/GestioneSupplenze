import { readFileSync, existsSync, writeFileSync } from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dayjs from "dayjs";
import 'dayjs/locale/it.js';
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DISP_FILE = path.join(__dirname, "../data/disp.json");
const DOCENTI_FILE = path.join(__dirname, "../data/docenti.json");
const CLASSI_FILE = path.join(__dirname, "../data/classi.json");
const SUB_FILE = path.join(__dirname, '../data/sub.json');

export const Disponibili = async (req, res) => {
    const { data, ora, classe } = req.query;

    if (!data || !ora || !classe) {
        return res.status(400).json({ error: "Data, ora e classe sono obbligatorie" });
    }

    if (!existsSync(DISP_FILE) || !existsSync(DOCENTI_FILE)) {
        return res.status(500).json({ error: "File non trovati" });
    }

    const disponibilitaRaw = JSON.parse(readFileSync(DISP_FILE, "utf8"));
    const docentiData = JSON.parse(readFileSync(DOCENTI_FILE, "utf8"));

    const giornoSettimana = dayjs(data, "DD/MM/YYYY").locale("it").format("dddd");
    const giornoCapitalizzato = giornoSettimana.charAt(0).toUpperCase() + giornoSettimana.slice(1);

    const docentiDisponibili = disponibilitaRaw
        .filter(docente => {
            const giorno = docente.disponibilita[giornoCapitalizzato];
            if (!giorno?.attivo) return false;

            return giorno.orari.some(entry => entry.fascia === ora);
        })
        .map(docente => docentiData.find(d => d.id === docente.id))
        .filter(Boolean);

    const docentiPreferiti = docentiDisponibili.filter(docente =>
        docente.classi.includes(classe)
    );

    const docentiFallback = docentiDisponibili.filter(docente =>
        !docente.classi.includes(classe)
    );

    const risultatoFinale = [...docentiPreferiti, ...docentiFallback];

    if (risultatoFinale.length === 0) {
        return res.status(404).json({ error: "Nessun docente disponibile" });
    }

    // Restituisci solo ID, nome e cognome
    const docentiRitorno = risultatoFinale.map(docente => ({
        id: docente.id,
        nome: docente.nome,
        cognome: docente.cognome
    }));

    res.json(docentiRitorno);
};

export const getClassi = (req, res) => {
    if (!existsSync(CLASSI_FILE)) {
        return res.status(500).json({ error: "File non trovato" });
    }

    const token = req.headers.authorization?.split(' ')[1]; // Estrarre il token dall'header
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token mancante' });
    }

    try {
        // Decodifica il token
        const decodedToken = jwt.verify(token, process.env.SECRET_ACCESS);
        const idAdmin = decodedToken?.id;

        if (!idAdmin) {
            return res.status(400).json({ success: false, message: 'ID non trovato nel token' });
        }

        const classiData = JSON.parse(readFileSync(CLASSI_FILE));
        const classi = classiData.find(entry => entry.idAdmin === idAdmin)?.classi || [];

        res.json(classi.map(c => ({ id: c, nome: c })));
    }
    catch (error) {
        console.error('Errore durante la lettura del file classi.json:', error);
        res.status(500).json({ error: "Errore durante la lettura del file classi.json" });
    }
};

export const aggiungiSupplenza = (req, res) => {
    const nuova = req.body;

    if (!nuova || !nuova.id || !nuova.docente || !nuova.classe || !nuova.data || !nuova.ora) {
        return res.status(400).json({ error: 'Dati mancanti' });
    }

    const supplenze = existsSync(SUB_FILE)
        ? JSON.parse(readFileSync(SUB_FILE, 'utf8'))
        : [];

    supplenze.push(nuova);

    try {
        writeFileSync(SUB_FILE, JSON.stringify(supplenze, null, 2), 'utf8');
        res.json({ success: true, id: nuova.id });
    } catch (err) {
        console.error('Errore scrittura sub.json:', err);
        res.status(500).json({ error: 'Errore scrittura file' });
    }
};

// Funzione per leggere solo le supplenze di oggi
export const getSupplenzeOdierne = (req, res) => {
    if (!existsSync(SUB_FILE) || !existsSync(DOCENTI_FILE)) {
        return res.status(200).json([]);
    }

    const tutte = JSON.parse(readFileSync(SUB_FILE, 'utf8'));
    const docenti = JSON.parse(readFileSync(DOCENTI_FILE));

    const oggi = dayjs().format("DD/MM/YYYY");
    const odierne = tutte
        .filter(s => s.data === oggi)
        .map((s) => {
            const docente = docenti.find(d => d.id === s.id);
            const docenteName = docente ? `${docente.nome} ${docente.cognome}` : "Docente non trovato";
            return {
                ...s,
                docente: docenteName,
            };
        });

    res.json(odierne);
};

export const getStoricoSupplenze = (req, res) => {
    if (!existsSync(SUB_FILE) || !existsSync(DOCENTI_FILE)) {
        return res.status(200).json([]);
    }

    const tutte = JSON.parse(readFileSync(SUB_FILE, 'utf8'));
    const docenti = JSON.parse(readFileSync(DOCENTI_FILE));

    const oggi = dayjs().format("DD/MM/YYYY");
    const storiche = tutte
        .filter(s => dayjs(s.data, "DD/MM/YYYY").isBefore(oggi))
        .map((s) => {
            const docente = docenti.find(d => d.id === s.id);
            const docenteName = docente ? `${docente.nome} ${docente.cognome}` : "Docente non trovato";
            return {
                ...s,
                docente: docenteName,
            };
        });

    res.json(storiche);
};

export const getSupplenzeDocente = (req, res) => {
    const { idDocente } = req.params;

    if (!existsSync(SUB_FILE) || !existsSync(DOCENTI_FILE)) {
        return res.status(200).json([]);
    }

    const tutte = JSON.parse(readFileSync(SUB_FILE, 'utf8'));
    const docenti = JSON.parse(readFileSync(DOCENTI_FILE));

    const supplenzeDocente = tutte
        .filter(s => s.id === idDocente)
        .map((s) => {
            const docente = docenti.find(d => d.id === s.id);
            const docenteName = docente ? `${docente.nome} ${docente.cognome}` : "Docente non trovato";
            return {
                ...s,
                docente: docenteName,
            };
        });

    res.json(supplenzeDocente);
}
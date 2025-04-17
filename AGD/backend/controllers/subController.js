import { readFileSync, existsSync } from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dayjs from "dayjs";
import 'dayjs/locale/it.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DISP_FILE = path.join(__dirname, "../data/disp.json");
const DOCENTI_FILE = path.join(__dirname, "../data/docenti.json");
const CLASSI_FILE = path.join(__dirname, "../data/classi.txt");

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

    res.json(risultatoFinale);
};

export const getClassi = (req, res) => {
    if (!existsSync(CLASSI_FILE)) {
        return res.status(500).json({ error: "File non trovato" });
    }

    const classiRaw = readFileSync(CLASSI_FILE, "utf8")
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    const classi = classiRaw.map(classe => ({
        id: classe,
        nome: classe
    }));

    res.json(classi);
};

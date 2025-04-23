import { existsSync, writeFileSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ASSENZE_FILE = path.join(__dirname, "../data/assenze.json");
const DISP_FILE = path.join(__dirname, "../data/disp.json");
const DOCENTI_FILE = path.join(__dirname, "../data/docenti.json");
const ORARIO_FILE = path.join(__dirname, "../data/orario.json");
const ORARIDOCENTI_FILE = path.join(__dirname, "../data/orariDocenti.json");
const SUB_FILE = path.join(__dirname, "../data/sub.json");

const formattaGiorno = (dateStr) => {
    const giorno = new Date(dateStr).toLocaleDateString("it-IT", { weekday: "long" });
    return giorno.charAt(0).toUpperCase() + giorno.slice(1);
};

const calcolaFasceOrarie = (orari) => {
    const {
        inizioPrimaLezione,
        fineUltimaLezione,
        inizioRicreazione,
        fineRicreazione,
        durataLezioni
    } = orari;

    const convertiInMinuti = (orario) => {
        const [ore, minuti] = orario.split(":").map(Number);
        return ore * 60 + minuti;
    };

    const aggiungiMinuti = (orario, minuti) => {
        const totaleMinuti = convertiInMinuti(orario) + minuti;
        const ore = Math.floor(totaleMinuti / 60);
        const min = totaleMinuti % 60;
        return `${String(ore).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    };

    const durata = Number(durataLezioni);
    const fasce = [];
    let orarioCorrente = inizioPrimaLezione;
    let lezioneCount = 0;

    // Prima della ricreazione
    while (convertiInMinuti(orarioCorrente) < convertiInMinuti(inizioRicreazione) && lezioneCount < 3) {
        const fine = aggiungiMinuti(orarioCorrente, durata);
        if (convertiInMinuti(fine) > convertiInMinuti(inizioRicreazione)) break;
        fasce.push(`${orarioCorrente}-${fine}`);
        orarioCorrente = fine;
        lezioneCount++;
    }

    // Dopo la ricreazione
    orarioCorrente = fineRicreazione;
    while (convertiInMinuti(orarioCorrente) < convertiInMinuti(fineUltimaLezione)) {
        const fine = aggiungiMinuti(orarioCorrente, durata);
        if (convertiInMinuti(fine) > convertiInMinuti(fineUltimaLezione)) break;
        fasce.push(`${orarioCorrente}-${fine}`);
        orarioCorrente = fine;
    }

    return fasce;
};


export const CreazioneSub = (req) => {
    const { idAssenza } = req.params;

    if (!existsSync(ASSENZE_FILE) || !existsSync(DISP_FILE) || !existsSync(DOCENTI_FILE) || !existsSync(ORARIO_FILE) || !existsSync(ORARIDOCENTI_FILE)) {
        return { error: "File non trovati" };
    }

    const assenze = JSON.parse(readFileSync(ASSENZE_FILE, "utf8"));
    const disp = JSON.parse(readFileSync(DISP_FILE, "utf8"));
    const docenti = JSON.parse(readFileSync(DOCENTI_FILE, "utf8"));
    const orario = JSON.parse(readFileSync(ORARIO_FILE, "utf8"));
    const orariDocenti = JSON.parse(readFileSync(ORARIDOCENTI_FILE, "utf8"));

    const assenza = assenze.find(a => a.idAssenza === idAssenza);

    if (!assenza) {
        return { error: "Assenza non trovata" };
    }

    const { id, idAdmin, date } = assenza;
    const giorno = formattaGiorno(date);
    const dataFormatted = new Date(date).toLocaleDateString("it-IT");
    const orarioDocenteAssente = orariDocenti.find(o => o.id === id);
    if (!orarioDocenteAssente) {
        return { error: "Orario del docente assente non trovato" };
    }
    const oreGiornaliere = orarioDocenteAssente.giorni[giorno];
    const oreBuca = oreGiornaliere
        .map((classe, i) => ({ ora: i, classe }))
        .filter(entry => entry.classe !== "X");

    const docenteAssente = docenti.find(d => d.id === id);
    const materiaAssente = docenteAssente?.materie;

    const adminData = orario.find(o => o.idAdmin === idAdmin);
    if (!adminData) return { error: "Orari admin non trovati" };

    const fasce = calcolaFasceOrarie(adminData.orari);
    const supplenze = [];

    oreBuca.forEach(({ ora, classe }) => {
        const disponibili = disp
            .filter(d => {
                const giornoDisp = d.disponibilita[giorno];
                return giornoDisp && giornoDisp.attivo && giornoDisp.orari.length > ora;
            })
            .map(d => d.id);

        const candidati = docenti.filter(d => disponibili.includes(d.id));

        let supplente =
            candidati.find(d => d.classi.includes(classe)) ||
            candidati.find(d => d.materie === materiaAssente) ||
            candidati[Math.floor(Math.random() * candidati.length)];

        if (supplente) {
            supplenze.push({
                id: supplente.id,
                classe,
                data: dataFormatted,
                ora: fasce[ora] || "Orario sconosciuto"
            });
        }
    });

    // Salvataggio su file sub.json
    writeFileSync(SUB_FILE, JSON.stringify(supplenze, null, 2));

    return {
        success: true,
        message: "Supplenze create e salvate con successo",
        supplenze
    };
};

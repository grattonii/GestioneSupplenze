import { writeFileSync, existsSync } from 'fs';

const initializeFileIfNotExists = (filePath) => {
    if (!existsSync(filePath)) {
        writeFileSync(filePath, JSON.stringify([], null, 2));
    }
};

// Esegui all'avvio dell'app
initializeFileIfNotExists('./data/docenti.json');
initializeFileIfNotExists('./data/orario.json');
initializeFileIfNotExists('./data/disp.json');
initializeFileIfNotExists('./data/segnalazioni.json');

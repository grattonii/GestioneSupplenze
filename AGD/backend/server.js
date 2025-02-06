import express, { json } from "express";
import multer from "multer";
import pkg from 'exceljs';
import cors from "cors";
import { writeFileSync, unlinkSync, existsSync, readFileSync } from "fs";

const app = express();
const { Workbook } = pkg;
app.use(cors());
app.use(json());

// Configurazione Multer per l'upload del file
const upload = multer({ dest: "uploads/" });

// Endpoint per caricare il file Excel e convertirlo in JSON
app.post("/upload", upload.single("file"), async (req, res) => {
    const filePath = req.file.path;

    // Crea una nuova istanza di ExcelJS e leggi il file Excel
    const workbook = new Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);  // Prendi il primo foglio (se ne hai più di uno, cambia il numero)

    // Array per contenere i dati in formato JSON
    const jsonData = [];

    // Itera su tutte le righe del foglio Excel e convertilo in un oggetto JSON
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {  // Salta la prima riga (intestazione)
            const rowObject = {};
            row.eachCell((cell, colNumber) => {
                const header = worksheet.getRow(1).getCell(colNumber).text;  // Usa la prima riga come intestazione
                rowObject[header] = cell.text;  // Assegna il valore della cella alla chiave corrispondente
            });
            jsonData.push(rowObject);
        }
    });

    // Salva il JSON in un file
    writeFileSync("data.json", JSON.stringify(jsonData, null, 2));

    // Elimina il file Excel dopo la conversione
    unlinkSync(filePath);

    res.json({ message: "File caricato e convertito!", data: jsonData });
});

// Endpoint per ottenere i dati JSON
app.get("/supplenze", (req, res) => {
    if (existsSync("data.json")) {
        const jsonData = readFileSync("data.json");
        res.json(JSON.parse(jsonData));
    } else {
        res.json({ message: "Nessun dato disponibile." });
    }
});

// Avvio del server
app.listen(5000, () => console.log("Server in ascolto sulla porta 5000"));
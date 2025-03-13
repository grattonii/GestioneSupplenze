const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Percorso del file disp.json
const filePath = path.join(__dirname, '../data/disp.json');

// Funzione helper per caricare i dati esistenti
const loadData = () => {
  if (!fs.existsSync(filePath)) {
    // Se il file non esiste, restituisci un array vuoto
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Errore nella lettura del file JSON:", error);
    return [];
  }
};

// Funzione helper per salvare i dati sul file
const saveData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error("Errore durante il salvataggio dei dati: " + error.message);
  }
};

// Endpoint per ricevere le disponibilità
router.post('/disponibilita', (req, res) => {
  
  const { idDocente, disponibilita } = req.body;
  
  if (!idDocente || !disponibilita) {
    return res.status(400).json({ error: 'Sono richiesti idDocente e disponibilita' });
  }
  
  // Carica i dati esistenti
  let data = loadData();
  
  // Verifica se esiste già un record per questo docente
  const index = data.findIndex(item => item.idDocente === idDocente);
  if (index !== -1) {
    // Aggiorna le disponibilità esistenti
    data[index].disponibilita = disponibilita;
  } else {
    // Aggiungi un nuovo record per il docente
    data.push({ idDocente, disponibilita });
  }
  
  // Salva i dati aggiornati
  try {
    saveData(data);
    res.status(200).json({ message: 'Disponibilità salvata correttamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il salvataggio dei dati' });
  }
});

module.exports = router;
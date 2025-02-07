import React, { useState } from "react";
import axios from "axios";
import "../styles/App.css";

function GestioneFile() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(" Nessun file");
  const [data, setData] = useState([]);

  // Gestisce la selezione del file
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  // Invia il file Excel al server
  const handleUpload = async () => {
    if (!file) return alert("Seleziona un file Excel!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData);
      setData(response.data.data || []); // Assicurati che i dati vengano impostati correttamente
    } catch (error) {
      console.error("Errore durante il caricamento del file", error);
      alert("Errore durante il caricamento del file");
    }
  };

  return (
    <div>
      <h2>Gestione Supplenze</h2>

      {/* Input file personalizzato */}
      <label className="custom-file-upload">
        <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
        📂 {fileName}
      </label>
      <button onClick={handleUpload}>Carica Excel</button>

      <h3>Supplenze:</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Data</th>
            <th>Ora</th>
            <th>Classe</th>
            <th>Docente</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.Data}</td>
                <td>{item.Ora}</td>
                <td>{item.Classe}</td>
                <td>{item.Docente}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nessun dato disponibile</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GestioneFile;
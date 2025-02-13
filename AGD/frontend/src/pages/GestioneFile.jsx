import React, { useState } from "react";
import axios from "axios";
import "../styles/App.css";
import { FaQuestionCircle } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";

function GestioneFile() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileName1, setFileName1] = useState("Nessun file");
  const [fileName2, setFileName2] = useState("Nessun file");

  // Gestisce la selezione del primo file (Professori)
  const handleFileChange1 = (event) => {
    if (event.target.files.length > 0) {
      setFile1(event.target.files[0]);
      setFileName1(event.target.files[0].name);
    }
  };

  // Gestisce la selezione del secondo file (Orari)
  const handleFileChange2 = (event) => {
    if (event.target.files.length > 0) {
      setFile2(event.target.files[0]);
      setFileName2(event.target.files[0].name);
    }
  };

  // Invia entrambi i file al backend
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file1 || !file2) {
      return alert("Seleziona entrambi i file!");
    }

    const formData = new FormData();
    formData.append("file1", file1);
    formData.append("file2", file2);

    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File caricati con successo!");
      navigate("/Dashboard");
    } catch (error) {
      console.error("Errore durante il caricamento", error);
      alert("Errore durante il caricamento dei file");
    }
  };

  return (
    <div id="FilesBox">
      <div id="titolo">
        <h1>Caricamento File</h1>
      </div>

      <form onSubmit={handleUpload}>
        <div id="formFiles">
          <p>
            Carica il file contenente i dati dei docenti{" "}
            <FaQuestionCircle
              data-tooltip-id="professoriTip"
              style={{ cursor: "pointer", color: "#007BFF" }}
            />
          </p>
          <ReactTooltip id="professoriTip" place="right" effect="solid">
            <strong>Formato del file Excel:</strong>
            <ul>
              <li>Nome</li>
              <li>Cognome</li>
              <li>Email dei professori</li>
              <li>Ordinato alfabeticamente</li>
            </ul>
          </ReactTooltip>
          <label className="custom-file-upload">
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange1}
            />
            📂 {fileName1}
          </label>

          <p>
            Carica il file con l'orario dei docenti{" "}
            <FaQuestionCircle
              data-tooltip-id="orariTip"
              style={{ cursor: "pointer", color: "#007BFF" }}
            />
          </p>
          <ReactTooltip id="orariTip" place="right" effect="solid">
            <strong>Formato del file Excel:</strong>
            <ul>
              <li>Cognome del docente in ordine alfabetico</li>
              <li>Orari per ogni giorno della settimana (Lunedì - Sabato)</li>
              <li>Le classi assegnate in ogni ora</li>
              <li>Ore di disponibilità indicate con il simbolo 'D'</li>
            </ul>
          </ReactTooltip>
          <label className="custom-file-upload">
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange2}
            />
            📂 {fileName2}
          </label>

          <div id="containerPulsanti" className="side">
            <button type="submit">Avanti</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default GestioneFile;

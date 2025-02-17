import React, { useState } from "react";
import axios from "axios";
import "../styles/Accesso.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFileArrowUp, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

function GestioneFile() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileName1, setFileName1] = useState("Carica file");
  const [fileName2, setFileName2] = useState("Carica file");

  const handleFileChange1 = (event) => {
    if (event.target.files.length > 0) {
      setFile1(event.target.files[0]);
      setFileName1(event.target.files[0].name);
    }
  };

  const handleFileChange2 = (event) => {
    if (event.target.files.length > 0) {
      setFile2(event.target.files[0]);
      setFileName2(event.target.files[0].name);
    }
  };

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
          
          <h3>
            
            <span> Carica il file contenente i dati dei docenti{" "} </span>
            <FontAwesomeIcon icon={faCircleQuestion} 
              data-tooltip-id="professoriTip"
              style={{ cursor: "pointer", color: "#007BFF" }}
            />
          </h3>
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
            <FontAwesomeIcon icon={file1 ? faFileExcel : faFileArrowUp}  style={{ color: file1  ? "#217346" : "black" }} /> {fileName1}
          </label>

    
          <h3>
            <span>  Carica il file con l'orario dei docenti{" "}  </span>
            <FontAwesomeIcon icon={faCircleQuestion}
              data-tooltip-id="orariTip"
              style={{ cursor: "pointer", color: "#007BFF" }}
            />
          </h3>
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
            <FontAwesomeIcon icon={file2 ? faFileExcel : faFileArrowUp}  style={{ color: file2 ? "#217346" : "black" }}  /> {fileName2}
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

import React, { useState } from "react";
import axios from "axios";
import "../styles/Accesso.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFileArrowUp, faCircleQuestion, faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";

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
    <>
      <div id="FilesBox">
        <div id="titolo">
          <h1>Caricamento File</h1>
        </div>

        <form onSubmit={handleUpload}>
          <div id="formFiles">
            <h3>
              <span> Carica il file contenente i dati dei docenti </span>
              <FontAwesomeIcon
                icon={faCircleQuestion}
                data-tooltip-id="professoriTip"
                style={{ cursor: "pointer", color: "#007BFF" }}
              />
            </h3>
            <ReactTooltip id="professoriTip" place="right" effect="solid">
              <strong>Formato del file Excel:</strong>
              <ul>
                <li>Ordinato alfabeticamente per cognome</li>
                <li>Nome</li>
                <li>Cognome</li>
                <li>Email dei professori</li>
                <li>Numero di telefono</li>
                <li>Materie</li>
              </ul>
            </ReactTooltip>

            <div className="uploadBottoni">
              <button
                className="custom-file-upload"
                type="button"
                onClick={() => document.getElementById("fileInput1").click()}
              >
                <input
                  id="fileInput1"
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange1}
                  style={{ display: "none" }}
                />
                <FontAwesomeIcon
                  icon={file1 ? faFileExcel : faFileArrowUp}
                  style={{ color: file1 ? "#217346" : "#007BFF" }}
                />{" "}
                <span>{fileName1} </span>
              </button>
            </div>
            <div id="containerPulsanti">
              <button type="submit" className="fileUpload">Avanti</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default GestioneFile;

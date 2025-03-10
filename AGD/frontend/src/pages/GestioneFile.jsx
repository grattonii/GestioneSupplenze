import React, { useState } from "react";
import axios from "axios";
import "../styles/Accesso.css";
import { useNavigate } from 'react-router-dom';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFileArrowUp, faCircleQuestion, faArrowUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";

function GestioneFile() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Carica file");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warn("Seleziona un file prima di procedere!", { position: "top-center" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/dashboard");
    } catch (error) {
      if (error.response)
        toast.error(error.response.data.message || "Errore sconosciuto!", { position: "top-center" }); // Errore specifico dal backend
      else
        toast.error("Errore di connessione al server!", { position: "top-center" });
    }
  };

  return (
    <>
      <ToastContainer/>
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
                <li>Cognome in ordine alfabetico</li>
                <li>Nome</li>
                <li>Email</li>
                <li>Telefono</li>
                <li>Classi</li>
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
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <FontAwesomeIcon
                  icon={file ? faFileExcel : faFileArrowUp}
                  style={{ color: file ? "#217346" : "#007BFF" }}
                />{" "}
                <span>{fileName} </span>
              </button>
            </div>

            <div id="containerPulsanti" className="side">
              <button type="submit" className="side">Avanti</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default GestioneFile;

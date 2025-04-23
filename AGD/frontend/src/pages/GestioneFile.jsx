import React, { useState } from "react";
import axios from "axios";
import "../styles/Accesso.css";
import { useNavigate } from 'react-router-dom';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFileArrowUp, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

function GestioneFile() {
  const [fileDocenti, setFileDocenti] = useState(null);
  const [fileOrari, setFileOrari] = useState(null);
  const [fileNameDocenti, setFileNameDocenti] = useState("Carica file");
  const [fileNameOrari, setFileNameOrari] = useState("Carica file");
  const navigate = useNavigate();

  const handleFileChange = (event, type) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (type === "docenti") {
        setFileDocenti(file);
        setFileNameDocenti(file.name);
      } else if (type === "orari") {
        setFileOrari(file);
        setFileNameOrari(file.name);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      const token = await refreshAccessToken();
      if (!token) {
        toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
        return;
      }
    }

    if (!fileDocenti || !fileOrari) {
      toast.warn("Seleziona entrambi i file prima di procedere!", { position: "top-center" });
      return;
    }

    const formData = new FormData();
    formData.append("fileDocenti", fileDocenti);
    formData.append("fileOrari", fileOrari);

    try {
      await axios.post("http://localhost:5000/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`
        },
      });

      navigate("/dashboard");
    } catch (error) {
      if (error.response?.data?.dettagli) {
        const dettagli = error.response.data.dettagli;
        if (Array.isArray(dettagli)) {
          dettagli.forEach(msg =>
            toast.error(msg, { position: "top-center" })
          );
        } else {
          toast.error(typeof dettagli === 'string' ? dettagli : JSON.stringify(dettagli), { position: "top-center" });
        }
      }      
      else
        toast.error("Errore di connessione al server!", { position: "top-center" });
    }
  };

  return (
    <>
      <ToastContainer />
      <div id="FilesBox">
        <div id="titolo">
          <h1>Caricamento File</h1>
        </div>

        <form onSubmit={handleUpload}>
          <div id="formFiles">
            <h3>
              <span>Carica il file contenente i dati dei docenti{" "}</span>
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
                onClick={() => document.getElementById("fileInputDocenti").click()}
              >
                <input
                  id="fileInputDocenti"
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={(e) => handleFileChange(e, "docenti")}
                  style={{ display: "none" }}
                />
                <FontAwesomeIcon
                  icon={fileDocenti ? faFileExcel : faFileArrowUp}
                  style={{ color: fileDocenti ? "#217346" : "#007BFF" }}
                />
                <span>{" "}{fileNameDocenti}</span>
              </button>
            </div>

            <h3>
              <span>Carica il file contenente gli orari dei docenti{" "}</span>
              <FontAwesomeIcon
                icon={faCircleQuestion}
                data-tooltip-id="professoriTip2"
                style={{ cursor: "pointer", color: "#007BFF" }}
              />
            </h3>
            <ReactTooltip id="professoriTip2" place="right" effect="solid">
              <strong>Formato del file Excel:</strong>
              <ul>
                <li>Cognome e Nome in ordine alfabetico</li>
                <li>Classi</li>
                <li>Ore buche segnate con X</li>
              </ul>
            </ReactTooltip>

            <div className="uploadBottoni">
              <button
                className="custom-file-upload"
                type="button"
                onClick={() => document.getElementById("fileInputOrari").click()}
              >
                <input
                  id="fileInputOrari"
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={(e) => handleFileChange(e, "orari")}
                  style={{ display: "none" }}
                />
                <FontAwesomeIcon
                  icon={fileOrari ? faFileExcel : faFileArrowUp}
                  style={{ color: fileOrari ? "#217346" : "#007BFF" }}
                />
                <span>{" "}{fileNameOrari}</span>
              </button>
            </div>
            <div id="containerPulsanti" className="side">
              <button type="submit" className="side">Avanti</button>
            </div>
          </div>
        </form >
      </div >
    </>
  );
}

export default GestioneFile;

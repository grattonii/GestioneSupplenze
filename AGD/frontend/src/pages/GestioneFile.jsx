import React, { useState } from "react";
import axios from "axios";
import "../styles/File.css";

function GestioneFile() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [fileName1, setFileName1] = useState(" Nessun file");
  const [fileName2, setFileName2] = useState(" Nessun file");
  const [data, setData] = useState([]);

  // Gestisce la selezione del file
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile1(event.target.files[0]);
      setFile2(event.target.files[0]);
      setFileName1(event.target.files[0].name);
      setFileName2(event.target.files[0].name);
    }
  };

  // Invia il file Excel al server
  const handleUpload = async () => {
    if (!file1) return alert("Seleziona un file Excel!");

    const formData = new FormData();
    formData.append("file", file1);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData
      );
      setData(response.data.data || []); // Assicurati che i dati vengano impostati correttamente
    } catch (error) {
      console.error("Errore durante il caricamento del file", error);
      alert("Errore durante il caricamento del file");
    }
  };

  return (
    <>
      <script
        src="https://kit.fontawesome.com/2f5f6d0fd4.js"
        crossorigin="anonymous"
      ></script>
      <div id="FilesBox">
        <div id="titolo">
          <h1>Caricamento File</h1>
        </div>
        <form onSubmit={handleUpload}>
          <div id="formFiles">
            <p>sdfg</p>
            <label className="custom-file-upload">
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
              />
              📂 {fileName1}
            </label>
            <p>sdfg</p>
            <label className="custom-file-upload">
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
              />
              📂 {fileName2}
            </label>
          </div>
        </form>
      </div>
    </>
  );
}

export default GestioneFile;
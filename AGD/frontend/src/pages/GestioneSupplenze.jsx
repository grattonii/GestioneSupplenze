import React, { useState } from "react";
import SupplenzeTable from "./SupplenzeTabella.jsx";
import Navbar from "../components/Navbar2.jsx";
import "../styles/Pagine.css";

function GestioneSupplenze() {
  const [supplenze, setSupplenze] = useState([
    {
      id: 1,
      docente: "Mario Rossi",
      classe: "3A",
      ora: "08:00-09:00",
      stato: "Accettata",
    },
    {
      id: 2,
      docente: "Luca Bianchi",
      classe: "2B",
      ora: "09:00-10:00",
      stato: "Rifiutata",
    },
  ]);

  const [newSupplenza, setNewSupplenza] = useState({
    docente: "",
    classe: "",
    ora: "",
    stato: "Accettata",
  });

  return (
    <div>
      <Navbar />
      <h1 className="title">Gestione Supplenze</h1>

      <SupplenzeTable rows={supplenze} setRows={setSupplenze} />
    </div>
  );
}

export default GestioneSupplenze;
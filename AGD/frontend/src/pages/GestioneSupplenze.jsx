import React, { useState } from "react";
import SupplenzeTable from "../components/SupplenzeTabella.jsx";
import Navbar from "../components/Navbar2.jsx";
import "../styles/Pagine.css";

function GestioneSupplenze() {
  const [supplenze, setSupplenze] = useState([
    {
      id: 1,
      docente: "Mario Rossi",
      classe: "3A",
      data: "12/03/2025",
      ora: "08:00-09:00",
      stato: "Accettata",
    },
    {
      id: 2,
      docente: "Luca Bianchi",
      classe: "2B",
      data: "13/03/2025",
      ora: "09:00-10:00",
      stato: "Rifiutata",
    },
    {
      id: 3,
      docente: "Michele Tarantino",
      classe: "4Bi",
      data: "14/03/2025",
      ora: "09:00-10:00",
      stato: "In attesa",
    },
  ]);

  return (
    <div>
      <Navbar />
      <h1 className="title">Gestione Supplenze</h1>

      <SupplenzeTable rows={supplenze} setRows={setSupplenze} />
    </div>
  );
}

export default GestioneSupplenze;
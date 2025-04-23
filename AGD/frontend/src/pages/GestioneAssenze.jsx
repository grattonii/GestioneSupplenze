import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar2.jsx";
import AssenzeTabella from "../components/AssenzeTable.jsx";
import { fetchWithRefresh } from "../utils/api";

function GestioneAssenze() {
  const [assenze, setAssenze] = useState([]);

  useEffect(() => {
    fetchAssenze();
  }, []);

  const fetchAssenze = async () => {
    const token = sessionStorage.getItem("accessToken");

    try {
      const response = await fetchWithRefresh("http://localhost:5000/assenze/docenti", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAssenze(data);
      } else {
        console.error("Errore durante il recupero delle assenze");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  return (
    <>
      <Navbar />
      <h1 className="title">Gestione Assenze</h1>
      <h3 className="spiegazione">Gestisci le richieste di assenza dei docenti</h3>
      <AssenzeTabella rows={assenze} setRows={setAssenze} />
    </>
  );
}

export default GestioneAssenze;
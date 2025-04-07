import React from 'react';
import Navbar from "../components/NavbarProf2.jsx";
import "../styles/Pagine.css";

const GestioneRichieste = () => {
    return (
        <>
            <Navbar />
            <h1 className="title">Richieste di Assistenza</h1>
            <h3 className="spiegazione">Qui puoi gestire le richieste di assistenza degli utenti.</h3>
        </>
    );
};

export default GestioneRichieste;
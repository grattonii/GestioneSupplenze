import React from 'react';
import Navbar from "../components/NavbarProf2.jsx";
import "../styles/Pagine.css";
import SegnalazioniTabella from "../components/SegnalazioniTabella.jsx";

const GestioneSegnalazioni = () => {
    return (
        <>
            <Navbar />
            <h1 className="title">Gestione Segnalazioni</h1>
            <h3 className="spiegazione">Qui puoi gestire le segnalazione di problemi degli utenti.</h3>
            <SegnalazioniTabella rows={[]}/>
        </>
    );
};

export default GestioneSegnalazioni;
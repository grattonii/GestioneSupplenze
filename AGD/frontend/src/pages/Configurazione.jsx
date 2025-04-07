import React from 'react';
import Navbar from "../components/NavbarProf2.jsx";
import "../styles/Pagine.css";

const Configurazione = () => {
    return (
        <>
            <Navbar />
            <h1 className="title">Configurazione del sistema</h1>
            <h3 className="spiegazione">Qui puoi configurare le impostazioni del sistema.</h3>
        </>
    );
};

export default Configurazione;
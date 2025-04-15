import { useState, useEffect } from 'react';
import Navbar from "../components/NavbarProf2.jsx";
import "../styles/Pagine.css";
import SegnalazioniTabella from "../components/SegnalazioniTabella.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { fetchWithRefresh } from "../utils/api";

const GestioneSegnalazioni = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSegnalazioni = async () => {
            try {
                // Usa fetchWithRefresh per ottenere i dati dal backend
                const response = await fetchWithRefresh("http://localhost:5000/root/segnalazioni");
                if (!response.ok) {
                    throw new Error("Errore durante il recupero delle segnalazioni");
                }
                const data = await response.json();

                if (!data.success || !Array.isArray(data.segnalazioni)) {
                    if (data?.error === "Token non valido o scaduto") {
                        toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
                        sessionStorage.removeItem("accessToken");
                        navigate("/");
                    } else {
                        toast.error("Errore nel caricamento delle segnalazioni");
                    }
                    return;
                }

                setRows(data.segnalazioni); // Aggiorna lo stato con i dati delle segnalazioni
            } catch (error) {
                toast.error("Sessione scaduta. Effettua di nuovo il login.");
                sessionStorage.removeItem("accessToken");
                navigate("/");
            }
        };

        fetchSegnalazioni();

        const interval = setInterval(fetchSegnalazioni, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <ToastContainer />
            <Navbar />
            <h1 className="title">Gestione Segnalazioni</h1>
            <h3 className="spiegazione">Qui puoi gestire le segnalazione di problemi degli utenti.</h3>
            <SegnalazioniTabella rows={rows} setRows={setRows}/>
        </>
    );
};

export default GestioneSegnalazioni;
import { useState, useEffect } from 'react';
import Navbar from "../components/NavbarProf2.jsx";
import "../styles/Pagine.css";
import SegnalazioniTabella from "../components/SegnalazioniTabella.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { fetchWithRefresh } from "../utils/api";
import { FaTrash } from "react-icons/fa";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";

const GestioneSegnalazioni = () => {
    const [rows, setRows] = useState([]);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const navigate = useNavigate();

    const handleDeleteRequest = () => {
        setConfirmDeleteOpen(true);
    };

    const confirmDelete = async () => {
        setRows([]);
        setConfirmDeleteOpen(false);

        try {
            const token = sessionStorage.getItem("accessToken");
            const response = await fetchWithRefresh(`http://localhost:5000/root/annullaSegnalazione`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Errore durante l'aggiornamento:", error);
            setRows(rows); // Ripristina lo stato precedente
        }
    };

    const cancelDelete = () => {
        setConfirmDeleteOpen(false);;
    };

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
            <SegnalazioniTabella rows={rows} setRows={setRows} />

            <div className="aggiungi-container">
                <button type="button" className="aggiungi" onClick={() => handleDeleteRequest()}>
                    <FaTrash /> Reset segnalazioni
                </button>
            </div>

            <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
                <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "black" }}>Conferma eliminazione</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontFamily: "Poppins" }}>Sei sicuro di voler eliminare tutte le segnalazioni?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} sx={{ fontFamily: "Poppins" }}>Annulla</Button>
                    <Button onClick={(e) => confirmDelete()} color="error" sx={{ fontFamily: "Poppins" }}>Conferma</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default GestioneSegnalazioni;
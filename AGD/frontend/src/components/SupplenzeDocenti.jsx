import { useState, useEffect, useRef } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import "../styles/Tabelle.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchWithRefresh } from "../utils/api";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function SupplenzeDocenti({ rows, setRows, setDisponibilitaAccettates }) {
    const rejectSubstitution = (sub) => {
        // Rimuovi la supplenza dalla lista delle supplenze in attesa
        const updatedSubstitutions = rows.filter((s) => s.id !== sub.id);
        setRows(updatedSubstitutions);
    };

    const acceptSubstitution = (sub) => {
        const dayOfWeek = new Date(
            sub.date.split(" ")[1] // Ottieni il giorno della settimana
        ).toLocaleDateString("it-IT", { weekday: "long" });

        setSchedule((prevSchedule) => {
            const updatedSchedule = { ...prevSchedule };

            if (!updatedSchedule[dayOfWeek]) {
                updatedSchedule[dayOfWeek] = []; // Se il giorno non esiste, inizializzalo
            }

            // Aggiungi l'orario solo se non è già presente
            if (!updatedSchedule[dayOfWeek].includes(sub.time)) {
                updatedSchedule[dayOfWeek] = [...updatedSchedule[dayOfWeek], sub.time];
            }

            return { ...updatedSchedule }; // Restituiamo un nuovo oggetto per forzare il re-render
        });

        setRows((prevSubstitutions) =>
            prevSubstitutions.filter((s) => s.id !== sub.id)
        );
    };

    const handleAcceptAvailability = (date, time, className) => {
        const dayName = new Date(date).toLocaleDateString("it-IT", { weekday: "long" }); // Ottieni il giorno della settimana
        const nuovaDisponibilita = { day: dayName, time, className };
        setDisponibilitaAccettate((prev) => [...prev, nuovaDisponibilita]);
        alert("Disponibilità accettata!");
    };

    return (
        <>
            <TableContainer component={Paper} sx={{
                maxWidth: "1200px",
                margin: "auto",
                marginBottom: 15,
                borderRadius: 2,
                boxShadow: 3,
            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#335C81" }}>
                            <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins" }}>Classe</TableCell>
                            <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins" }}>Data</TableCell>
                            <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins" }}>Orario</TableCell>
                            <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins" }}>Azione</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: "center", padding: 3, fontFamily: "Poppins" }}>
                                    <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                                        Nessun richiesta disponibile al momento.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{sub.class}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{sub.date}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{sub.time}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                                        <IconButton
                                            color="success"
                                            onClick={() => handleAcceptAvailability(sub.date, sub.time, sub.class)}
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => rejectSubstitution(sub)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default SupplenzeDocenti;
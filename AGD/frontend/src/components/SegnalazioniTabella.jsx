import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import "../styles/Accesso.css";
import { fetchWithRefresh } from "../utils/api.js";

function SegnalazioniTabella({ rows, setRows }) {

  const toggleStatus = async(e, id) => {
    e.stopPropagation();
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        // Cambia lo stato in base al valore booleano
        return { ...row, stato: row.stato === false ? true : false }; // Cambia stato da attivo a sospeso e viceversa
      }
      return row;
    });

    setRows(prev =>
      prev.map((row) =>
        row.id === id ? { ...row, stato: !row.stato } : row
      )
    );

    try {
      const token = sessionStorage.getItem("accessToken");
      const targetRow = updatedRows.find(r => r.id === id);

      // Invia la richiesta PATCH al backend per aggiornare lo stato
      const response = await fetchWithRefresh(`http://localhost:5000/root/modificaStato/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ stato: targetRow.stato }) // inviamo il valore booleano
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento dello stato:", error);
      // Ripristina lo stato precedente in caso di errore
      setRows(rows);
    }
  };

  return (
    <>
      {/* Tabella */}
      <TableContainer component={Paper} sx={{ maxWidth: "1200px", margin: "auto", borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#335C81" }}>
              {["Data", "Utente", "Problema", "Stato"].map((header) => (
                <TableCell key={header} sx={{ color: "white", textAlign: "center", fontFamily: "Poppins", fontWeight: 600 }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", padding: 3 }}>
                  <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                    Nessun problema segnalato.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} onClick={() => handleOpen(row)} sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  }
                }}>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.data}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.nomeScuola}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.descrizione}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                    <IconButton onClick={(e) => toggleStatus(e, row.id)}>
                      {row.stato === true ? ( // Stato Completato
                        <FaCheckCircle color="green" size={23} />
                      ) : ( // Stato In Corso
                        <FaHourglassHalf color="orange" size={23} />
                      )}
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

export default SegnalazioniTabella;
import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import "../styles/Accesso.css";

function SegnalazioniTabella({ rows }) {
  
  const toggleStatus = (e, id) => {
    e.stopPropagation();
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, stato: row.stato === "Completata" ? "In Corso" : "Completata" } : row
      )
    );
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
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.utente}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.motivo}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                    <IconButton onClick={(e) => toggleStatus(e, row.id)}>
                      {row.stato === "Completata" ? (
                        <FaCheckCircle color="green" size={23} />
                      ) : (
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
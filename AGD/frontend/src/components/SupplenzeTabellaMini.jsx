import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../styles/Accesso.css";

function SupplenzeTabellaMini({ rows }) {
  return (
    <>
      {/* Tabella */}
      <TableContainer component={Paper} sx={{ maxWidth: "1200px", margin: "auto", borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#335C81" }}>
              {["Docente", "Classe", "Data", "Ora", "Stato", ""].map((header) => (
                <TableCell key={header} sx={{ color: "white", textAlign: "center", fontFamily: "Poppins", fontWeight: 600 }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", padding: 3 }}>
                  <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                    Nessuna supplenza da gestire al momento.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} onClick={() => handleOpen(row)} sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    color: "black",
                  }
                }}>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.docente}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.classe}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.data}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.ora}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                    {row.stato === "Accettata" ? (
                      <FaCheckCircle color="green" size={23} />
                    ) : row.stato === "In attesa" ? (
                      <FaHourglassHalf color="orange" size={23} />
                    ) : (
                      <FaTimesCircle color="red" size={23} />
                    )}
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

export default SupplenzeTabellaMini;
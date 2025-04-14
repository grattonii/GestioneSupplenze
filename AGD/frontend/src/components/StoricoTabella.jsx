import { useState, useEffect, useRef  } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "../styles/Tabelle.css";

function StoricoTabella({ rows }) {

  return (
    <>
      {/* Tabella */}
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Table
          sx={{
            display: "block",
            width: "100%",
          }}
        >
          <TableHead
            sx={{
              display: "table",
              width: "100%",
              tableLayout: "fixed",
              backgroundColor: "#335C81",
            }}
          >
            <TableRow>
              {["Docente", "Classe", "Data", "Ora"].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "white",
                    textAlign: "center",
                    fontFamily: "Poppins",
                    fontWeight: 600,
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              display: "block",
              maxHeight: "510px",
              overflowY: "auto",
              width: "100%",
            }}
          >
            {rows.length === 0 ? (
              <TableRow sx={{ display: "table", width: "100%", tableLayout: "fixed" }}>
                <TableCell colSpan={4} sx={{ textAlign: "center", padding: 3 }}>
                  <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                    Nessuna supplenza avvenuta.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  sx={{
                    display: "table",
                    tableLayout: "fixed",
                    width: "100%",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                  onClick={() => handleOpen(row)}
                >
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.docente}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.classe}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.data}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.ora}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default StoricoTabella;
import React, { useState, useEffect, useRef  } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/Tabelle.css";

function AssenzeTabella({ rows, acceptSubstitution, rejectSubstitution }) {

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: "1200px",
        margin: "auto",
        marginBottom: 15,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Table sx={{ display: "block", width: "100%" }}>
        <TableHead
          sx={{
            display: "table",
            width: "100%",
            tableLayout: "fixed",
            backgroundColor: "#335C81",
          }}
        >
          <TableRow>
            {["Docente", "Data", "Motivazione", "Azione"].map((header) => (
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
            <TableRow
              sx={{
                display: "table",
                tableLayout: "fixed",
                width: "100%",
              }}
            >
              <TableCell colSpan={4} sx={{ textAlign: "center", padding: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1.2rem", fontWeight: 500 }}
                >
                  Nessuna richiesta disponibile al momento.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  display: "table",
                  tableLayout: "fixed",
                  width: "100%",
                  transition: "background 0.2s",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <TableCell
                  sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}
                >
                  {row.docente}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}
                >
                  {row.data}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}
                >
                  {row.motivazione}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}
                >
                  <IconButton color="success" onClick={() => acceptSubstitution(row)}>
                    <CheckIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => rejectSubstitution(row)}>
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AssenzeTabella;
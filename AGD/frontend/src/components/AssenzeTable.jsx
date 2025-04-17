import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function AssenzeTabella({ rows }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: "1200px",
        margin: "auto",
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
            {["Data", "Docente", "Motivo", "Note", "Azione"].map((header) => (
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
              <TableCell colSpan={5} sx={{ textAlign: "center", padding: 3 }}>
                <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 500 }}>
                  Nessun richiesta disponibile al momento.
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
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                  },
                }}
              >
                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 600 }}>
                  {row.date}
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 600 }}>
                  {row.docente}
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 600 }}>
                  {row.reason}
                </TableCell>
                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 600 }}>
                  {row.note || "Nessuna nota"}
                </TableCell>
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
  );
}

export default AssenzeTabella;
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
import { fetchWithRefresh } from "../utils/api";

function AssenzeTabella({ rows, setRows }) {
  const rejectSubstitution = async(row) => {
    const response = await fetchWithRefresh(`http://localhost:5000/assenze/negata/${idAssenza}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      
    const data = await response.json();
    if (data.success) {
      // Rimuovi la supplenza dalla lista delle supplenze in attesa
      const updatedSubstitutions = rows.filter((s) => s.idAssenza !== idAssenza);
      setRows(updatedSubstitutions);
    } else {
      console.error("Errore nell'accettazione della supplenza:", data.message);
    }
  };

  const handleAccept = async(idAssenza) => {
    const response = await fetchWithRefresh(`http://localhost:5000/assenze/docente/${idAssenza}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      
    const data = await response.json();
    if (data.success) {
      // Rimuovi la supplenza dalla lista delle supplenze in attesa
      const updatedSubstitutions = rows.filter((s) => s.idAssenza !== idAssenza);
      setRows(updatedSubstitutions);
    } else {
      console.error("Errore nell'accettazione della supplenza:", data.message);
    }
  };

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
                key={row.idAssenza}
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
                    onClick={() => handleAccept(row.idAssenza)}
                  >
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
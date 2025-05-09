import React, { useState, useEffect, useRef } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FaTrash } from "react-icons/fa";
import "../styles/Tabelle.css";

function DisponibilitaTabella({ rows, setRows }) {
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Apri il dialog con la riga selezionata
  const handleOpen = (row) => {
    setSelectedRow({ ...row }); // Copia i dati per evitare mutazioni dello stato originale
    setOpen(true);
  };

  // Chiudi il dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  // Gestisce le modifiche nei campi del dialog
  const handleChange = (e) => {
    setSelectedRow({ ...selectedRow, [e.target.name]: e.target.value });
  };

  // Aggiorna la tabella con i nuovi valori
  const handleUpdate = () => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === selectedRow.id ? { ...selectedRow } : row
      )
    );
    handleClose();
  };

  // Cancella una riga
  const handleDeleteRequest = (id) => {
    setRowToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== rowToDelete));
    setConfirmDeleteOpen(false);
    setRowToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setRowToDelete(null);
  };

  return (
    <>
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
              {["Docente", "Giorno", "Ora", ""].map((header) => (
                <TableCell
                  key={header}
                  sx={{ color: "white", textAlign: "center", fontFamily: "Poppins", fontWeight: 600 }}
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
              <TableRow sx={{ display: "table", tableLayout: "fixed", width: "100%" }}>
                <TableCell colSpan={4} sx={{ textAlign: "center", padding: 3 }}>
                  <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                    Nessun docente disponibile al momento.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleOpen(row)}
                  sx={{
                    display: "table",
                    tableLayout: "fixed",
                    width: "100%",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    }
                  }}
                >
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.docente}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.giorno}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.ora}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteRequest(row.id); }}>
                      <FaTrash color="red" />
                    </IconButton>

                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog per modificare i dati */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "#000" }}>Modifica Disponibilita</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <>
              <TextField
                label="Docente"
                name="docente"
                value={selectedRow.docente || ""}
                onChange={handleChange}
                fullWidth
                margin="dense"
                sx={{
                  "& .MuiInputBase-root": {
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    color: "#333",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#666",
                  },
                }}
              />
              <FormControl fullWidth margin="dense" sx={{
                "& .MuiInputBase-root": {
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  color: "#333",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ccc",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#666",
                },
              }}>
                <InputLabel sx={{ backgroundColor: "#fff", padding: "0px 10px 0px 5px" }}>Giorno</InputLabel>
                <Select
                  name="giorno"
                  value={selectedRow.giorno || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="Lunedi">Lunedì</MenuItem>
                  <MenuItem value="Martedi">Martedì</MenuItem>
                  <MenuItem value="Mercoledi">Mercoledì</MenuItem>
                  <MenuItem value="Giovedi">Giovedì</MenuItem>
                  <MenuItem value="Venerdi">Venerdì</MenuItem>
                  <MenuItem value="Sabato">Sabato</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Ora"
                name="ora"
                value={selectedRow.ora || ""}
                onChange={handleChange}
                fullWidth
                margin="dense"
                sx={{
                  "& .MuiInputBase-root": {
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    color: "#333",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "5px",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ccc",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#666",
                  },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" sx={{ fontFamily: "Poppins" }} >Annulla</Button>
          <Button onClick={handleUpdate} color="primary" sx={{ fontFamily: "Poppins" }}>Modifica</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "black" }}>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "Poppins" }}>Sei sicuro di voler eliminare questo utente?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} sx={{ fontFamily: "Poppins" }}>Annulla</Button>
          <Button onClick={confirmDelete} color="error" sx={{ fontFamily: "Poppins" }}>Elimina</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DisponibilitaTabella;
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";

function SupplenzeTabella({ rows, setRows }) {
  const [open, setOpen] = useState(false);
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
      prevRows.map((row) => (row.id === selectedRow.id ? { ...selectedRow } : row))
    );
    handleClose();
  };

  // Cancella una riga
  const handleDelete = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  return (
    <>
      {/* Tabella */}
      <TableContainer component={Paper} sx={{ maxWidth: "1000px", margin: "auto", borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2c3e50" }}>
              {["Docente", "Classe", "Data", "Ora", "Stato", "Azioni"].map((header) => (
                <TableCell key={header} sx={{ color: "white", textAlign: "center" }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                  Nessuna supplenza da gestire al momento.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} onClick={() => handleOpen(row)} sx={{ cursor: "pointer" }}>
                  <TableCell sx={{ textAlign: "center" }}>{row.docente}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.classe}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.data}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{row.ora}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {row.stato === "Accettata" ? (
                      <FaCheckCircle color="green" />
                    ) : row.stato === "In attesa" ? (
                      <FaHourglassHalf color="orange" />
                    ) : (
                      <FaTimesCircle color="red" />
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                    <IconButton onClick={() => handleDelete(row.id)}>
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
        <DialogTitle>Modifica Supplenza</DialogTitle>
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
              />
              <TextField
                label="Classe"
                name="classe"
                value={selectedRow.classe || ""}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Data"
                name="data"
                value={selectedRow.data || ""}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Ora"
                name="ora"
                value={selectedRow.ora || ""}
                onChange={handleChange}
                fullWidth
                margin="dense"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Modifica
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SupplenzeTabella;
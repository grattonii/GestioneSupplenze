import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FaTrash } from "react-icons/fa";

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
      prevRows.map((row) =>
        row.id === selectedRow.id ? { ...selectedRow } : row
      )
    );
    handleClose();
  };

  // Cancella una riga
  const handleDelete = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "1000px",
          margin: "auto",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2c3e50" }}>
              {["Docente", "Giorno", "Ora", "Azioni"].map((header) => (
                <TableCell
                  key={header}
                  sx={{ color: "white", textAlign: "center" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} onClick={() => handleOpen(row)} sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  color: "black",
                }
              }}>
                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 200 }}>{row.docente}</TableCell>
                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 300 }}>{row.giorno}</TableCell>
                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 300 }}>{row.ora}</TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <IconButton onClick={() => handleDelete(row.id)}>
                    <FaTrash color="red" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog per modificare i dati */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: 300 }}>Modifica Disponibilita</DialogTitle>
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
                <InputLabel sx={{backgroundColor: "#fff", padding: "0px 10px 0px 5px"}}>Giorno</InputLabel>
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
    </>
  );
}

export default SupplenzeTabella;

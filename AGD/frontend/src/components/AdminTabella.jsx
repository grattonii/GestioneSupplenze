import React, { useState } from "react";
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { FaTrash } from "react-icons/fa";

function AdminTabella({ rows, setRows }) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpen = (row) => {
    if (row) { // Controlla che row non sia undefined
      setSelectedRow({ ...row });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleChange = (e) => {
    setSelectedRow((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === selectedRow.id ? { ...selectedRow } : row))
    );
    handleClose();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); // Previene il click sulla riga
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: "1200px", margin: "auto", borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#335C81" }}>
              {["Scuola", "Email referente", "Azioni"].map((header) => (
                <TableCell key={header} sx={{ color: "white", textAlign: "center" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} style={{ textAlign: "center", padding: 3 }}>
                  <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                    Nessun admin disponibile.
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
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.nomeScuola}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.emailReferente}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton onClick={(e) => handleDelete(e, row.id)}>
                      <FaTrash color="red" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog per modificare */}
      {selectedRow && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "#000" }}>Modifica Admin</DialogTitle>
          <DialogContent>
            <TextField label="Nome Scuola" name="nomeScuola" fullWidth value={selectedRow.nomeScuola || ""} onChange={handleChange} margin="dense" sx={{
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
            }} />
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
              <InputLabel sx={{ backgroundColor: "#fff", padding: "0px 10px 0px 5px" }}>Tipologia</InputLabel>
              <Select name="tipologia" value={selectedRow.tipologia || ""} onChange={handleChange}>
                <MenuItem value="Liceo">Liceo</MenuItem>
                <MenuItem value="Tecnico">Tecnico</MenuItem>
                <MenuItem value="Professionale">Professionale</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Codice Meccanografico" name="codiceMeccanografico" fullWidth value={selectedRow.codiceMeccanografico || ""} onChange={handleChange} margin="dense" sx={{
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
            }} />
            <TextField label="Email Referente" name="emailReferente" fullWidth value={selectedRow.emailReferente || ""} onChange={handleChange} margin="dense" sx={{
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
            }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annulla</Button>
            <Button onClick={handleUpdate}>Modifica</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default AdminTabella;
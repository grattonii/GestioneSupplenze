import React, { useState } from "react";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Fab, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Navbar from "../components/Navbar2.jsx";
import "../styles/Pagine.css";

function GestioneAccount() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    if (newDisponibilita.docente && newDisponibilita.giorno && newDisponibilita.ora) {
      setDisponibilita((prev) => [...prev, { ...newDisponibilita, id: Date.now() }]); // Aggiorna la tabella
      handleClose();
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="title">Gestione Account</h1>

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Dialog con il form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "#000" }}>Crea Account</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome Scuola"
            fullWidth
            value={newDisponibilita.docente}
            onChange={(e) =>
              setNewDisponibilita({ ...newDisponibilita, docente: e.target.value })
            }
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
          <FormControl fullWidth margin="dense"
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
            }}>
            <InputLabel sx={{ backgroundColor: "#fff", padding: "0px 10px 0px 5px" }}>Tipologia</InputLabel>
            <Select
              name="giorno"
              value={newDisponibilita.giorno}
              onChange={(e) =>
                setNewDisponibilita({ ...newDisponibilita, giorno: e.target.value })
              }
            >
              <MenuItem value="Liceo">Liceo</MenuItem>
              <MenuItem value="Tecnico">Tecnico</MenuItem>
              <MenuItem value="Professionale">Professionale</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Codice Meccanografico"
            fullWidth
            value={newDisponibilita.docente}
            onChange={(e) =>
              setNewDisponibilita({ ...newDisponibilita, docente: e.target.value })
            }
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
          <TextField
            label="Nome Referente"
            fullWidth
            value={newDisponibilita.docente}
            onChange={(e) =>
              setNewDisponibilita({ ...newDisponibilita, docente: e.target.value })
            }
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" sx={{ fontFamily: "Poppins" }} >Annulla</Button>
          <Button onClick={handleAdd} color="primary" sx={{ fontFamily: "Poppins" }}>Crea</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GestioneAccount;
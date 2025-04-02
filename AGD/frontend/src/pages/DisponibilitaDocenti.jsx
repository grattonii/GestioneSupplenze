import React, { useState } from "react";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Fab, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import DisponibilitaTabella from "../components/DisponibilitaTabella.jsx";
import Navbar from "../components/Navbar2.jsx";
import "../styles/Pagine.css";

function DisponibilitaDocenti() {
  const [disponibilita, setDisponibilita] = useState([
    {
      id: 1,
      docente: "Mario Rossi",
      giorno: "Lunedi",
      ora: "08:00-09:00",
    },
    {
      id: 2,
      docente: "Luca Bianchi",
      giorno: "Martedi",
      ora: "09:00-10:00",
    },
  ]);

  const [newDisponibilita, setNewDisponibilita] = useState({
    docente: "",
    giorno: "",
    ora: "",
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewDisponibilita({ docente: "", giorno: "", ora: "" });
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
      <h1 className="title">Disponibilità Docenti</h1>

      <DisponibilitaTabella rows={disponibilita} setRows={setDisponibilita} />

      {/* Dialog con il form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "#000" }}>Aggiungi un Docente</DialogTitle>
        <DialogContent>
          <TextField
            label="Docente"
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
            <InputLabel sx={{ backgroundColor: "#fff", padding: "0px 10px 0px 5px" }}>Giorno</InputLabel>
            <Select
              name="giorno"
              value={newDisponibilita.giorno}
              onChange={(e) =>
                setNewDisponibilita({ ...newDisponibilita, giorno: e.target.value })
              }
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
            fullWidth
            value={newDisponibilita.ora}
            onChange={(e) =>
              setNewDisponibilita({ ...newDisponibilita, ora: e.target.value })
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
          <Button onClick={handleAdd} color="primary" sx={{ fontFamily: "Poppins" }}>Aggiungi</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DisponibilitaDocenti;
import React, { useState } from "react";
import { Button, TextField, Grid2, Dialog, DialogTitle, DialogContent, DialogActions, Fab} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import DisponibilitaTabella from "./DisponibilitaTabella.jsx";
import Navbar from "../components/Navbar2.jsx";
import "../styles/Pagine.css";

function DisponibilitaDocenti() {
  const [disponibilita, setDisponibilita] = useState([
    {
      id: 1,
      docente: "Mario Rossi",
      materia: "Informatica",
      ora: "08:00-09:00",
    },
    {
      id: 2,
      docente: "Luca Bianchi",
      materia: "Matematica",
      ora: "09:00-10:00",
    },
  ]);

  const [newDisponibilita, setNewDisponibilita] = useState({
    docente: "",
    materia: "",
    ora: "",
  });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewDisponibilita({ docente: "", materia: "", ora: "" });
  };

  const handleAdd = () => {
    if (newDisponibilita.docente && newDisponibilita.classe && newDisponibilita.ora) {
      setDisponibilita((prev) => [...prev, { ...newDisponibilita, id: Date.now() }]); // Aggiorna la tabella
      handleClose();
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="title">Disponibilità Docenti</h1>

      <DisponibilitaTabella rows={disponibilita} setRows={setDisponibilita} />

      {/* Bottone "+" rotondo */}
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Aggiungi un Docente</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2} marginTop={1} direction="column">
            <Grid2 item xs={12}>
              <TextField
                label="Docente"
                fullWidth
                value={newDisponibilita.docente}
                onChange={(e) =>
                  setNewDisponibilita({ ...newDisponibilita, docente: e.target.value })
                }
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Materia"
                fullWidth
                value={newDisponibilita.classe}
                onChange={(e) =>
                  setNewDisponibilita({ ...newDisponibilita, materia: e.target.value })
                }
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Ora"
                fullWidth
                value={newDisponibilita.ora}
                onChange={(e) =>
                  setNewDisponibilita({ ...newDisponibilita, ora: e.target.value })
                }
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annulla
          </Button>
          <Button onClick={handleAdd} variant="contained" color="primary">
            Aggiungi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DisponibilitaDocenti;
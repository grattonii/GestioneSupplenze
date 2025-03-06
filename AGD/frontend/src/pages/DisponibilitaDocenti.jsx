import React, { useState } from "react";
import { Button, TextField, Grid2, Dialog, DialogTitle, DialogContent, DialogActions, Fab, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
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
            <FormControl fullWidth margin="dense">
                <InputLabel>Giorno</InputLabel>
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
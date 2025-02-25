import React, { useState } from "react";
import { Button, TextField, Grid2, Dialog, DialogTitle, DialogContent, DialogActions, Fab } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import SupplenzeTable from "./SupplenzeTabella.jsx";
import Navbar from "./Navbar.jsx";
import "../styles/Pagine.css";


function GestioneSupplenze() {
  const [supplenze, setSupplenze] = useState([
    { id: 1, docente: "Mario Rossi", classe: "3A", ora: "08:00-09:00", stato: "Accettata" },
    { id: 2, docente: "Luca Bianchi", classe: "2B", ora: "09:00-10:00", stato: "Rifiutata" },
  ]);

  const [newSupplenza, setNewSupplenza] = useState({ docente: "", classe: "", ora: "", stato: "Accettata" });
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewSupplenza({ docente: "", classe: "", ora: "", stato: "Accettata" });
  };

  const handleAdd = () => {
    if (newSupplenza.docente && newSupplenza.classe && newSupplenza.ora) {
      setSupplenze((prev) => [...prev, { ...newSupplenza, id: Date.now() }]); // Aggiorna la tabella
      handleClose();
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="title">Gestione Supplenze</h1>
      
      <SupplenzeTable rows={supplenze} setRows={setSupplenze} />

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
        <DialogTitle>Aggiungi una Supplenza</DialogTitle>
        <DialogContent>
          <Grid2 container spacing={2} marginTop={1} direction="column">
            <Grid2 item xs={12}>
              <TextField
                label="Docente"
                fullWidth
                value={newSupplenza.docente}
                onChange={(e) => setNewSupplenza({ ...newSupplenza, docente: e.target.value })}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Classe"
                fullWidth
                value={newSupplenza.classe}
                onChange={(e) => setNewSupplenza({ ...newSupplenza, classe: e.target.value })}
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Ora"
                fullWidth
                value={newSupplenza.ora}
                onChange={(e) => setNewSupplenza({ ...newSupplenza, ora: e.target.value })}
              />
            </Grid2>
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Annulla</Button>
          <Button onClick={handleAdd} variant="contained" color="primary">Aggiungi</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GestioneSupplenze;
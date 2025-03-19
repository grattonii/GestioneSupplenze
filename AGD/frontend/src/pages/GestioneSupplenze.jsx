import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import SupplenzeTable from "../components/SupplenzeTabella.jsx";
import { FaPlusCircle } from "react-icons/fa";
import Navbar from "../components/Navbar2.jsx";
import "../styles/Pagine.css";

function GestioneSupplenze() {
  const [supplenze, setSupplenze] = useState([]);
  const [openSupplenza, setOpenSupplenza] = useState(false);
  const [nuovaSupplenza, setNuovaSupplenza] = useState({
    docente: "",
    classe: "",
    data: "",
    ora: "",
    stato: "In attesa",
  });

  const handleOpenSupplenza = () => setOpenSupplenza(true);
  const handleCloseSupplenza = () => {
    setOpenSupplenza(false);
    setNuovaSupplenza({ docente: "", classe: "", data: "", ora: "", stato: "In attesa" });
  };

  const handleChangeSupplenza = (e) => {
    setNuovaSupplenza({ ...nuovaSupplenza, [e.target.name]: e.target.value });
  };

  const handleAddSupplenza = () => {
    if (nuovaSupplenza.docente && nuovaSupplenza.classe && nuovaSupplenza.data && nuovaSupplenza.ora) {
      setSupplenze((prev) => [...prev, { ...nuovaSupplenza, id: Date.now() }]);
      handleCloseSupplenza();
    } else {
      alert("Tutti i campi sono obbligatori!");
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="title">Gestione Supplenze</h1>
      <h3 className="spiegazione">Visualizza e modifica le assegnazioni delle supplenze giornaliere.</h3>

      <SupplenzeTable rows={supplenze} setRows={setSupplenze} />
      <div className="aggiungi-container">
        <button type="button" className="aggiungi" onClick={handleOpenSupplenza}>
          <FaPlusCircle /> Aggiungi supplenza
        </button>
      </div>

      <Dialog open={openSupplenza} onClose={handleCloseSupplenza}>
        <DialogTitle>Aggiungi Supplenza</DialogTitle>
        <DialogContent>
          <TextField label="Docente" name="docente" fullWidth value={nuovaSupplenza.docente} onChange={handleChangeSupplenza} margin="dense" />
          <TextField label="Classe" name="classe" fullWidth value={nuovaSupplenza.classe} onChange={handleChangeSupplenza} margin="dense" />
          <TextField type="date" name="data" fullWidth value={nuovaSupplenza.data} onChange={handleChangeSupplenza} margin="dense" />
          <TextField label="Ora" name="ora" fullWidth value={nuovaSupplenza.ora} onChange={handleChangeSupplenza} margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSupplenza}>Annulla</Button>
          <Button onClick={handleAddSupplenza}>Aggiungi</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GestioneSupplenze;
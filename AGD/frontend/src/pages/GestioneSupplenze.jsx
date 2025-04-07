import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import SupplenzeTable from "../components/SupplenzeTabella.jsx";
import { FaPlusCircle } from "react-icons/fa";
import Navbar from "../components/Navbar2.jsx";
import "../styles/Pagine.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { color } from "framer-motion";

dayjs.extend(customParseFormat);

function GestioneSupplenze() {
  const [supplenze, setSupplenze] = useState([]);
  const [openSupplenza, setOpenSupplenza] = useState(false);
  const [nuovaSupplenza, setNuovaSupplenza] = useState({
    id: "",
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

  const validateDate = (date) => {
    // Controlla se la data è nel formato corretto usando dayjs con il formato 'DD-MM-YYYY'
    const parsedDate = dayjs(date, "DD-MM-YYYY", true); // 'true' forza la validazione esatta del formato
    return parsedDate.isValid(); // Se la data è valida, ritorna true
  };

  const validateTime = (time) => {
    if (!time.trim())
      return false;
  
    return /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(time);
  };  

  const handleAddSupplenza = () => {
    const { data, ora } = nuovaSupplenza;

    if (nuovaSupplenza.docente && nuovaSupplenza.classe && validateDate(data) && validateTime(ora)) {
      setSupplenze((prev) => [...prev, { ...nuovaSupplenza, id: Date.now() }]);
      handleCloseSupplenza();
    } else {
      if (!nuovaSupplenza.docente || !nuovaSupplenza.classe || !data || !ora) {
        toast.error("Compila tutti i campi!", { position: "top-center" });
        return;
      }
      else if (!validateDate(data)) {
        toast.error("Formato data non valido. Usa il formato DD-MM-YYYY", { position: "top-center" });
        return;
      }
      else if (!validateTime(ora)) {
        toast.error("Formato ora non valido. Usa il formato HH:mm", { position: "top-center" });
        return;
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <h1 className="title">Supplenze</h1>
      <h3 className="spiegazione">Gestione supplenze odierne.</h3>

      <SupplenzeTable rows={supplenze} setRows={setSupplenze} />
      <div className="aggiungi-container">
        <button type="button" className="aggiungi" onClick={handleOpenSupplenza}>
          <FaPlusCircle /> Aggiungi supplenza
        </button>
      </div>

      <Dialog open={openSupplenza} onClose={handleCloseSupplenza}>
        <DialogTitle sx={{color: "black"}}>Aggiungi Supplenza</DialogTitle>
        <DialogContent>
          <TextField label="Docente" name="docente" fullWidth value={nuovaSupplenza.docente} onChange={handleChangeSupplenza} margin="dense" sx={{
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
          <TextField label="Classe" name="classe" fullWidth value={nuovaSupplenza.classe} onChange={handleChangeSupplenza} margin="dense" sx={{
            "& .MuiInputBase-root": {
              fontFamily: "Poppins",
              fontSize: "16px",
              color: "#333",
              backgroundColor: "f9f9f9",
              borderRadius: "5px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ccc",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#666",
            },
          }} />
          <TextField
            label="Data"
            name="data"
            type="text"
            fullWidth
            value={nuovaSupplenza.data}
            onChange={handleChangeSupplenza}
            margin="dense"
            placeholder="DD-MM-YYYY"
          />
          <TextField
            label="Ora"
            name="ora"
            type="text"
            fullWidth
            value={nuovaSupplenza.ora}
            onChange={handleChangeSupplenza}
            margin="dense"
            placeholder="HH:mm"
          />
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
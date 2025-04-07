import { useState } from "react";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Fab, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FaPlusCircle } from "react-icons/fa";
import AdminTabella from "../components/AdminTabella.jsx";
import Navbar from "../components/NavbarProf2.jsx";
import "../styles/Pagine.css";

function GestioneAccount() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [adminData, setAdminData] = useState({
    nomeScuola: "",
    tipologia: "",
    codiceMeccanografico: "",
    emailReferente: ""
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAdminData({ nomeScuola: "", tipologia: "", codiceMeccanografico: "", emailReferente: "" });
  }

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!adminData.nomeScuola || !adminData.codiceMeccanografico || !adminData.emailReferente) {
      alert("Tutti i campi sono obbligatori!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/root/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      });
  
      const data = await response.json();
      if (data.success) {
        setRows([...rows, { ...adminData, id: Date.now() }]);
        handleClose();
      } else {
        alert("Errore: " + data.message);
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };  

  return (
    <>
      <Navbar />
      <h1 className="title">Gestione Account</h1>
      <h3 className="spiegazione">Gestisci gli account degli amministratori.</h3>
      <AdminTabella rows={rows} setRows={setRows} />

      <div className="aggiungi-container">
        <button type="button" className="aggiungi" onClick={handleOpen}>
          <FaPlusCircle /> Aggiungi disponibilità
        </button>
      </div>

      {/* Dialog con il form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "#000" }}>Crea Account</DialogTitle>
        <DialogContent>
          <TextField label="Nome Scuola" name="nomeScuola" fullWidth value={adminData.nomeScuola} onChange={handleChange} margin="dense" sx={{
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
            <Select name="tipologia" value={adminData.tipologia} onChange={handleChange}>
              <MenuItem value="Liceo">Liceo</MenuItem>
              <MenuItem value="Tecnico">Tecnico</MenuItem>
              <MenuItem value="Professionale">Professionale</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Codice Meccanografico" name="codiceMeccanografico" fullWidth value={adminData.codiceMeccanografico} onChange={handleChange} margin="dense" sx={{
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
          <TextField label="Email Referente" name="emailReferente" fullWidth value={adminData.emailReferente} onChange={handleChange} margin="dense" sx={{
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
          <Button onClick={handleClose} color="primary">Annulla</Button>
          <Button onClick={handleAdd} color="primary">Crea</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default GestioneAccount;
import { useState, useEffect } from "react";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FaPlusCircle } from "react-icons/fa";
import AdminTabella from "../components/AdminTabella.jsx";
import Navbar from "../components/NavbarProf2.jsx";
import "../styles/Pagine.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { fetchWithRefresh } from "../utils/api";

function GestioneAccount() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [adminData, setAdminData] = useState({
    nomeScuola: "",
    tipologia: "",
    codiceMeccanografico: "",
    emailReferente: ""
  });

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setAdminData({
      nomeScuola: "",
      tipologia: "",
      codiceMeccanografico: "",
      emailReferente: ""
    });
  };

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const codiceMeccRegex = /^[A-Z0-9]{10}$/;

  const handleAdd = async () => {
    if (!adminData.nomeScuola || !adminData.codiceMeccanografico || !adminData.emailReferente) {
      toast.warn("Tutti i campi sono obbligatori!", { position: "top-center" });
      return;
    }

    if (!codiceMeccRegex.test(adminData.codiceMeccanografico)) {
      toast.warn("Il codice meccanografico deve contenere 10 caratteri alfanumerici maiuscoli", { position: "top-center" });
      return;
    }
  
    if (!emailRegex.test(adminData.emailReferente)) {
      toast.warn("Inserisci un indirizzo email valido", { position: "top-center" });
      return;
    }

    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetchWithRefresh("http://localhost:5000/root/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();

      if (data.success) {
        const newAdmin = {
          ...adminData,
          username: data.username,
          id: data.id,
          role: "admin",
          attivo: true
        };
        setRows(prev => [...prev, newAdmin]);
        setAdminData(newAdmin); // aggiornamento con dati reali
        handleClose();
      } else {
        alert("Errore: " + data.message);
      }
    } catch (error) {
      console.error("Errore nella richiesta:", error);
    }
  };

  useEffect(() => {
    const AccountAdmin = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetchWithRefresh("http://localhost:5000/root/admin", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (!data.success || !Array.isArray(data.adminUsers)) {
          if (data?.error === "Token non valido o scaduto") {
            toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
            sessionStorage.removeItem("accessToken");
            navigate("/");
          } else {
            toast.error("Errore nel caricamento degli account admin");
          }
          return;
        }

        setRows(data.adminUsers);
      } catch (err) {
        toast.error("Sessione scaduta. Effettua di nuovo il login.");
        sessionStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    AccountAdmin();
  }, []);

  return (
    <>
      <ToastContainer/>
      <Navbar />
      <h1 className="title">Gestione Account</h1>
      <h3 className="spiegazione">Gestisci gli account degli amministratori.</h3>
      <AdminTabella rows={rows} setRows={setRows} />

      <div className="aggiungi-container">
        <button type="button" className="aggiungi" onClick={handleOpen}>
          <FaPlusCircle /> Aggiungi disponibilità
        </button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "#000" }}>Crea Account</DialogTitle>
        <DialogContent>
          <TextField label="Nome Scuola" name="nomeScuola" fullWidth value={adminData.nomeScuola} onChange={handleChange} margin="dense" />
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ backgroundColor: "#fff", padding: "0px 10px 0px 5px" }}>Tipologia</InputLabel>
            <Select name="tipologia" value={adminData.tipologia} onChange={handleChange}>
              <MenuItem value="Liceo">Liceo</MenuItem>
              <MenuItem value="Tecnico">Tecnico</MenuItem>
              <MenuItem value="Professionale">Professionale</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Codice Meccanografico" name="codiceMeccanografico" fullWidth value={adminData.codiceMeccanografico} onChange={handleChange} margin="dense" />
          <TextField label="Email Referente" name="emailReferente" fullWidth value={adminData.emailReferente} onChange={handleChange} margin="dense" />
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
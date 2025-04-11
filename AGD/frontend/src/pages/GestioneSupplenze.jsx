import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import SupplenzeTable from "../components/SupplenzeTabella.jsx";
import { FaPlusCircle } from "react-icons/fa";
import Navbar from "../components/Navbar2.jsx";
import "../styles/Pagine.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { fetchWithRefresh } from "../utils/api";

dayjs.extend(customParseFormat);

function GestioneSupplenze() {
  const [supplenze, setSupplenze] = useState([]);
  const [openSupplenza, setOpenSupplenza] = useState(false);
  const [fasceOrarie, setFasceOrarie] = useState([]);
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
    const parsedDate = dayjs(date, "DD/MM/YYYY", true); // 'true' forza la validazione esatta del formato
    return parsedDate.isValid(); // Se la data è valida, ritorna true
  };

  const handleAddSupplenza = () => {
    const { data, ora } = nuovaSupplenza;

    if (nuovaSupplenza.docente && nuovaSupplenza.classe && validateDate(data)) {
      setSupplenze((prev) => [...prev, { ...nuovaSupplenza, id: Date.now() }]);
      handleCloseSupplenza();
    } else {
      if (!nuovaSupplenza.docente || !nuovaSupplenza.classe || !data || !ora) {
        toast.error("Compila tutti i campi!", { position: "top-center" });
        return;
      }
      else if (!validateDate(data)) {
        toast.error("Formato data non valido. Usa il formato DD/MM/YYYY", { position: "top-center" });
        return;
      }
    }
  };

  useEffect(() => {
    const fetchFasceOrarie = async () => {
      try {
        const res = await fetchWithRefresh("http://localhost:5000/orari/fasce-orarie");
        const data = await res.json();

        if (!Array.isArray(data)) {
          if (data?.error === "Token non valido o scaduto") {
            toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
            sessionStorage.removeItem("accessToken");
            navigate("/");
          } else {
            toast.error("Errore imprevisto nel caricamento delle fasce orarie");
          }
          return;
        }

        const nuoveFasce = data.map(fascia => `${fascia.inizio} - ${fascia.fine}`);
        setFasceOrarie(prevFasce => {
          if (JSON.stringify(prevFasce) !== JSON.stringify(nuoveFasce)) {
            return nuoveFasce;
          }
          return prevFasce;
        });

      } catch (err) {
        toast.error("Sessione scaduta. Effettua di nuovo il login.");
        sessionStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    fetchFasceOrarie();
    const interval = setInterval(fetchFasceOrarie, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <h1 className="title">Supplenze</h1>
      <h3 className="spiegazione">Gestione supplenze odierne.</h3>

      <SupplenzeTable rows={supplenze} setRows={setSupplenze} fasceOrarie={fasceOrarie} />
      <div className="aggiungi-container">
        <button type="button" className="aggiungi" onClick={handleOpenSupplenza}>
          <FaPlusCircle /> Aggiungi supplenza
        </button>
      </div>

      <Dialog open={openSupplenza} onClose={handleCloseSupplenza}>
        <DialogTitle sx={{ color: "black" }}>Aggiungi Supplenza</DialogTitle>
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
            placeholder="DD/MM/YYYY"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="ora-label" sx={{ backgroundColor: "#fff", padding: "0px 10px 0px 5px" }}>Fascia Oraria</InputLabel>
            <Select
              labelId="ora-label"
              name="ora"
              value={nuovaSupplenza.ora}
              onChange={handleChangeSupplenza}
              sx={{
                fontFamily: "Poppins",
                fontSize: "16px",
                color: "#333",
                backgroundColor: "#f9f9f9",
                borderRadius: "5px",
              }}
            >
              {fasceOrarie.map((fascia, index) => (
                <MenuItem key={index} value={fascia}>
                  {fascia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, InputLabel, FormControl, Autocomplete } from "@mui/material";
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
  const [suggestioniDocenti, setSuggestioniDocenti] = useState([]);
  const [fasceOrarie, setFasceOrarie] = useState([]);
  const [Classi, setClassi] = useState([]);
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

  const handleAddSupplenza = async() => {
    const { data } = nuovaSupplenza;

    if (nuovaSupplenza.docente && nuovaSupplenza.classe && validateDate(data)) {
      try {
        const token = sessionStorage.getItem("accessToken");
        const response = await fetchWithRefresh("http://localhost:5000/supplenze/sub", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(nuovaSupplenza),
        });

        const data = await response.json();

        
      } catch (error) {
        console.error("Errore nella richiesta:", error);
      }

      setSupplenze((prev) => [...prev, { ...nuovaSupplenza, id: Date.now() }]);
      handleCloseSupplenza();
    } else {
      if (!nuovaSupplenza.docente || !nuovaSupplenza.classe || !data || !nuovaSupplenza.ora) {
        toast.error("Compila tutti i campi!", { position: "top-center" });
        return;
      }
      else if (!validateDate(data)) {
        toast.error("Formato data non valido. Usa il formato DD/MM/YYYY", { position: "top-center" });
        return;
      }
    }
    toast.success("Supplenza aggiunta con successo!", { position: "top-center" });
    setNuovaSupplenza({ docente: "", classe: "", data: "", ora: "", stato: "In attesa" });
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

  useEffect(() => {
    const fetchSupplenze = async () => {
      try {
        const res = await fetchWithRefresh("http://localhost:5000/supplenze/odierne");
        const data = await res.json();
        if (!Array.isArray(data)) {
          if (data?.error === "Token non valido o scaduto") {
            toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
            sessionStorage.removeItem("accessToken");
            navigate("/");
          } else {
            toast.error("Errore imprevisto nel caricamento delle supplenze");
          }
          return;
        }
        setSupplenze(data);
      } catch (err) {
        toast.error("Errore: " + err.message, { position: "top-center" });
      }
    };

    fetchSupplenze();
    const interval = setInterval(fetchSupplenze, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchClassi = async () => {
      try {
        const res = await fetchWithRefresh("http://localhost:5000/supplenze/classi");
        const data = await res.json();

        if (Array.isArray(data)) {
          const classiEstratte = data
            .map(c => c.nome || c.id)
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
          setClassi(classiEstratte);
        } else {
          toast.error("Errore nel caricamento delle classi");
        }
      } catch (err) {
        console.error("Errore nel recupero delle classi:", err);
        toast.error("Errore nel caricamento delle classi", { position: "top-center" });
      }
    };

    fetchClassi();
  }, []);

  useEffect(() => {
    if (
      nuovaSupplenza.data &&
      nuovaSupplenza.ora &&
      nuovaSupplenza.classe &&
      validateDate(nuovaSupplenza.data)
    ) {
      fetchDocentiDisponibili(nuovaSupplenza.data, nuovaSupplenza.ora);
    }
  }, [nuovaSupplenza.data, nuovaSupplenza.ora, nuovaSupplenza.classe]);

  const fetchDocentiDisponibili = async (data, ora) => {
    try {
      if (!nuovaSupplenza.classe) return;

      const res = await fetchWithRefresh(
        `http://localhost:5000/supplenze/disponibili?data=${data}&ora=${encodeURIComponent(ora)}&classe=${encodeURIComponent(nuovaSupplenza.classe)}`
      );

      const dataRes = await res.json();
      console.log("Docenti disponibili:", dataRes);

      if (Array.isArray(dataRes)) {
        setSuggestioniDocenti(dataRes);
      } else {
        setSuggestioniDocenti([]);
      }
    } catch (err) {
      console.error("Errore nel recupero dei docenti disponibili:", err);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <h1 className="title">Supplenze</h1>
      <h3 className="spiegazione">Gestione supplenze odierne.</h3>

      <SupplenzeTable rows={supplenze} setRows={setSupplenze} fasceOrarie={fasceOrarie} setFasceOrarie={setFasceOrarie} Classi={Classi} setClassi={setClassi} />
      <div className="aggiungi-container">
        <button type="button" className="aggiungi" onClick={handleOpenSupplenza}>
          <FaPlusCircle /> Aggiungi supplenza
        </button>
      </div>

      <Dialog open={openSupplenza} onClose={handleCloseSupplenza} fullWidth>
        <DialogTitle sx={{ color: "black" }}>Aggiungi Supplenza</DialogTitle>
        <DialogContent>
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
          <Autocomplete
            options={Classi}
            getOptionLabel={(option) => option}
            onChange={(e, value) => {
              setNuovaSupplenza({ ...nuovaSupplenza, classe: value });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Classe"
                fullWidth
                margin="dense"
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  color: "#333",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...rest } = props; // separa la chiave dagli altri props
              return (
                <li
                  key={key} // passa `key` direttamente
                  {...rest} // tutti gli altri props vengono spalmati
                  style={{ fontSize: "16px", padding: "8px 16px" }}
                >
                  {option}
                </li>
              );
            }}
          />
          <Autocomplete
            disabled={!nuovaSupplenza.data || !nuovaSupplenza.ora}
            options={suggestioniDocenti}
            getOptionLabel={(option) => `${option.nome} ${option.cognome}`}
            onChange={(e, value) => {
              if (value) {
                setNuovaSupplenza({
                  ...nuovaSupplenza,
                  docente: `${value.nome} ${value.cognome}`,
                  id: value.id
                });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Docente"
                fullWidth
                margin="dense"
                helperText={
                  !nuovaSupplenza.data || !nuovaSupplenza.ora
                    ? "Inserisci prima data, fascia oraria e classe"
                    : ""
                }
              />
            )}
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
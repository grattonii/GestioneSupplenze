import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../styles/Impostazioni.css";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import UtentiTabella from "../components/UtentiTabella";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchWithRefresh } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { faFileExcel, faFileArrowUp, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const sections = [
  { id: "Orario", label: "Configurazione orario" },
  { id: "Notifiche", label: "Notifiche e preferenze del sistema" },
  { id: "Utenti", label: "Gestione ruoli e permessi utenti" },
  { id: "Assistenza", label: "Segnalazione Problemi" }
];

function Impostazioni() {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Carica file");
  const [activeSection, setActiveSection] = useState("");
  const [emailNotifiche, setEmailNotifiche] = useState(true);
  const [pushNotifiche, setPushNotifiche] = useState(false);
  const [inputText, setInputText] = useState("");
  const maxWords = 50;

  const handleInputChange = (e) => {
    const text = e.target.value;
    const wordCount = text.trim().split(/\s+/).length;

    if (wordCount <= maxWords || text.trim() === "") {
      setInputText(text);
    }
  };

  const wordsUsed = inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length;

  useEffect(() => {
    const AccountUtenti = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetchWithRefresh("http://localhost:5000/admin/utenti", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (!data.success || !Array.isArray(data.Users)) {
          if (data?.error === "Token non valido o scaduto") {
            toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
            sessionStorage.removeItem("accessToken");
            navigate("/");
          } else {
            toast.error("Errore nel caricamento degli account");
          }
          return;
        }

        setUser(data.Users);
      } catch (err) {
        toast.error("Sessione scaduta. Effettua di nuovo il login.");
        sessionStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    AccountUtenti();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset per header
      for (let section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [orario, setOrario] = useState({
    inizioPrimaLezione: "",
    fineUltimaLezione: "",
    inizioRicreazione: "",
    fineRicreazione: "",
    durataLezioni: "",
    giorniLezione: "",
  });

  useEffect(() => {
    const fetchOrari = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetchWithRefresh("http://localhost:5000/orari/modifica", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (!data || typeof data !== "object") {
          toast.error("Errore nel caricamento degli orari.");
          return;
        }

        setOrario({
          inizioPrimaLezione: data.inizioPrimaLezione || "",
          fineUltimaLezione: data.fineUltimaLezione || "",
          inizioRicreazione: data.inizioRicreazione || "",
          fineRicreazione: data.fineRicreazione || "",
          durataLezioni: data.durataLezioni || "",
          giorniLezione: data.giorniLezione || "",
        });

      } catch (error) {
        console.error("Errore nel recupero degli orari:", error);
        toast.error("Sessione scaduta. Effettua di nuovo il login.");
        sessionStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    fetchOrari();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOrario((prevOrario) => ({
      ...prevOrario,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('accessToken');

      const saveRes = await fetchWithRefresh('http://localhost:5000/orari/salva', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orari: orario
        }),
      });

      const saveData = await saveRes.json();

      if (!saveData.success) {
        toast.error("Errore nel salvataggio degli orari.");
      }

    } catch (error) {
      console.error("Errore durante l'invio:", error);
      toast.error("Errore durante il salvataggio!", { position: "top-center" });
    }
  };

  const handleAbsenceSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = sessionStorage.getItem("accessToken");

      const response = await fetchWithRefresh("http://localhost:5000/root/segnalaProblema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          descrizione: inputText
        })
      });

      const result = await response.json();

      if (result.success) {
        setInputText("");
      } else {
        toast.error(result.message || "Errore nell'invio segnalazione");
      }
    } catch (error) {
      console.error("Errore durante l'invio:", error);
      toast.error("Errore durante il salvataggio!", { position: "top-center" });
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      const token = await refreshAccessToken();
      if (!token) {
        toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
        return;
      }
    }

    if (!file) {
      toast.warn("Seleziona un file prima di procedere!", { position: "top-center" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`
        },
      });

    } catch (error) {
      if (error.response)
        toast.error(error.response.data.message || "Errore sconosciuto!", { position: "top-center" }); // Errore specifico dal backend
      else
        toast.error("Errore di connessione al server!", { position: "top-center" });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="settings-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <FaRegCircleXmark className="close-icon" onClick={() => navigate(-1)} />
          <h2>Impostazioni</h2>
          <nav>
            {sections.map((section) => (
              <Link
                key={section.id}
                to={section.id}
                smooth={true}
                duration={500}
                className={`nav-link ${activeSection === section.id ? "active" : ""}`}
              >
                {section.id}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Contenuto */}
        <main className="content">
          <section id="Orario" className="section">
            <h1>Configurazione orario</h1>
            <h3>Modifica l'orario delle lezioni e delle ricreazioni.</h3>
            <form onSubmit={handleSubmit}>
              <div className="modifica-orario">
                <label className="direzione">
                  <h3>Ora inizio prima lezione giornata:</h3>
                  <input type="time" name="inizioPrimaLezione" value={orario.inizioPrimaLezione} className="input-campo" onChange={handleChange} />
                </label>
                <label className="direzione">
                  <h3>Ora fine ultima lezione giornata:</h3>
                  <input type="time" name="fineUltimaLezione" value={orario.fineUltimaLezione} className="input-campo" onChange={handleChange} />
                </label>
                <label className="direzione">
                  <h3>Ora inizio ricreazione:</h3>
                  <input type="time" name="inizioRicreazione" value={orario.inizioRicreazione} className="input-campo" onChange={handleChange} />
                </label>
                <label className="direzione">
                  <h3>Ora fine ricreazione:</h3>
                  <input type="time" name="fineRicreazione" value={orario.fineRicreazione} className="input-campo" onChange={handleChange} />
                </label>
                <label className="direzione">
                  <h3>Durata lezioni:</h3>
                  <input type="number" name="durataLezioni" value={orario.durataLezioni} className="input-campo" onChange={handleChange} />
                </label>
                <label className="direzione">
                  <h3>Giorni lezione:</h3>
                  <select className="input-campo" name="giorniLezione" value={orario.giorniLezione} onChange={handleChange}>
                    <option value="" disabled hidden></option>
                    <option value="lun-ven" style={{ color: "black" }}>Lunedì - Venerdì</option>
                    <option value="lun-sab" style={{ color: "black" }}>Lunedì - Sabato</option>
                  </select>
                </label>
              </div>
              <div className="button-container">
                <button type="submit" className="aggiunto">Salva orario</button>
              </div>
            </form>
          </section>

          <section id="Notifiche" className="section">
            <h1>Notifiche e preferenze</h1>
            <h3>Gestisci le notifiche e scegli come ricevere aggiornamenti dal sistema.</h3>
            <div className="direzioni">
              <h3>
                <input
                  type="checkbox"
                  id="checkbox-email"
                  style={{ display: "none" }}
                  checked={emailNotifiche}
                  onChange={() => setEmailNotifiche(!emailNotifiche)}
                />
                <label htmlFor={"checkbox-email"} className="checkbox"></label>
                Ricevi notifiche via email
              </h3>
              <h3>
                <input
                  type="checkbox"
                  id="checkbox-push"
                  style={{ display: "none" }}
                  checked={pushNotifiche}
                  onChange={() => setPushNotifiche(!pushNotifiche)}
                />
                <label htmlFor={"checkbox-push"} className="checkbox"></label>
                Ricevi notifiche push
              </h3>
            </div>
            <div className="button-container">
              <button className="aggiunto">Salva preferenze</button>
            </div>
          </section>

          <section id="Utenti" className="section">
            <h1>Gestione utenti e ruoli</h1>
            <h3>Modifica i permessi e assegna ruoli agli utenti.</h3>
            <UtentiTabella rows={user} setRows={setUser} />
            <div className="button-container">
              <button className="aggiunto" onClick={handleOpen}><FaPlusCircle />Aggiungi nuovo utente</button>
            </div>
          </section>

          <section id="Assistenza" className="section">
            <h1>Segnalazione Problemi</h1>
            <h3>Hai riscontrato un problema? Segnalalo al team di sviluppo.</h3>
            <form className="absence-form" onSubmit={handleAbsenceSubmit}>
              <div className="direzione">
                <label style={{ fontSize: "20px" }}>
                  Descrizione del problema:
                </label>
                <textarea
                  id="problema"
                  name="problema"
                  className="input-campo"
                  placeholder="Descrivi brevemente il problema riscontrato..."
                  value={inputText}
                  onChange={handleInputChange}
                  style={{ fontSize: "18px", resize: "none", minHeight: "150px", maxHeight: "200px" }}
                  required
                />
              </div>
              <small style={{ color: "#aaa", display: "block", textAlign: "right", marginRight: "5px" }}>
                {wordsUsed}/{maxWords} parole
              </small>

              <div className="button-container">
                <button className="aggiunto">Invia segnalazione</button>
              </div>
            </form>
          </section>
        </main>
      </div>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "black" }}>Aggiungi Docenti</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "Poppins" }}>Carica il file contenente i dati dei docenti{" "}<FontAwesomeIcon
            icon={faCircleQuestion}
            data-tooltip-id="professoriTip"
            style={{ cursor: "pointer", color: "#007BFF" }}
          /></Typography>
          <ReactTooltip id="professoriTip" place="right" effect="solid">
            <strong>Formato del file Excel:</strong>
            <ul>
              <li>Cognome (ordine alfabetico)</li>
              <li>Nome</li>
              <li>Email</li>
              <li>Telefono</li>
              <li>Classi</li>
              <li>Materie</li>
            </ul>
          </ReactTooltip>
          <div className="uploadBottoni">
            <button
              className="custom-file-upload"
              type="button"
              onClick={() => document.getElementById("fileInput1").click()}
            >
              <input
                id="fileInput1"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <FontAwesomeIcon
                icon={file ? faFileExcel : faFileArrowUp}
                style={{ color: file ? "#217346" : "#007BFF" }}
              />{" "}
              <span>{fileName} </span>
            </button>
          </div>
          <Typography sx={{ fontFamily: "Poppins" }}>Carica il file contenente gli orari dei docenti{" "}<FontAwesomeIcon
            icon={faCircleQuestion}
            data-tooltip-id="professoriTip2"
            style={{ cursor: "pointer", color: "#007BFF" }}
          /></Typography>
          <ReactTooltip id="professoriTip2" place="right" effect="solid">
            <strong>Formato del file Excel:</strong>
            <ul>
              <li>Cognome e Nome (ordine alfabetico)</li>
              <li>Classi</li>
              <li>Ore buche segnate con X</li>
            </ul>
          </ReactTooltip>
          <div className="uploadBottoni">
            <button
              className="custom-file-upload"
              type="button"
              onClick={() => document.getElementById("fileInput1").click()}
            >
              <input
                id="fileInput1"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <FontAwesomeIcon
                icon={file ? faFileExcel : faFileArrowUp}
                style={{ color: file ? "#217346" : "#007BFF" }}
              />{" "}
              <span>{fileName} </span>
            </button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontFamily: "Poppins" }} onClick={handleClose}>Annulla</Button>
          <Button color="error" sx={{ fontFamily: "Poppins" }}>Aggiungi</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Impostazioni;
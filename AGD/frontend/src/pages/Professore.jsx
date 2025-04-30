import { useState, useEffect } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from "@mui/material";
import "../styles/Professore.css";
import "../styles/Dashboard.css";
import Navbar from "../components/NavbarProf.jsx";
import WeeklySchedule from "../components/WeeklySchedule.jsx";
import { FaCalendarWeek, FaCalendarCheck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SupplenzeDocenti from "../components/SupplenzeDocenti.jsx";
import { fetchWithRefresh } from "../utils/api.js";

function Professore() {
  const [schedule, setSchedule] = useState({});
  const [substitutions, setSubstitutions] = useState([]);
  const [absenceNote, setabsenceNote] = useState("");
  const [absenceReason, setAbsenceReason] = useState("");
  const [absenceDate, setAbsenceDate] = useState("");
  const [disponibilita, setDisponibilita] = useState([]);
  const [supplenzeAccettate, setSupplenzeAccettate] = useState([]);

  const handleAbsenceSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("accessToken");

    const absenceData = {
      date: absenceDate,
      reason: absenceReason,
      note: absenceNote,
    };

    try {
      const response = await fetchWithRefresh("http://localhost:5000/assenze/docente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Invia il token nell'header
        },
        body: JSON.stringify(absenceData),
      });

      console.log(response);

      if (response.ok) {
        console.log("Richiesta assenza inviata con successo:", absenceData);
        setAbsenceDate("");
        setAbsenceReason("");
        setabsenceNote("");
      } else {
        console.error("Errore durante l'invio della richiesta di assenza");
        toast.error("Errore durante l'invio della richiesta di assenza.", { position: "top-center" });
      }
    } catch (error) {
      console.error("Errore di rete:", error);
      toast.error("Errore di rete durante l'invio della richiesta di assenza.", { position: "top-center" });
    }
  };

  useEffect(() => {
    const fetchDisponibilitaAccettate = async () => {

      try {
        const response = await fetchWithRefresh(`http://localhost:5000/disp/disponibilita/${sessionStorage.getItem("accessToken")}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDisponibilita(data.disponibilita);
        } else if (response.status === 401) {
          toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
          sessionStorage.removeItem("accessToken");
        } else {
          toast.error("Errore durante il recupero delle disponibilità accettate.", { position: "top-center" });
        }
      } catch (error) {
        console.error("Errore di rete:", error);
        toast.error("Errore di rete durante il recupero delle disponibilità accettate.", { position: "top-center" });
      }
    };

    fetchDisponibilitaAccettate();
  }, []);

  useEffect(() => {
    const fetchSupplenze = async () => {
      const token = sessionStorage.getItem("accessToken");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const idDocente = decodedToken.id;

      try {
        const response = await fetchWithRefresh(`http://localhost:5000/supplenze/sub/${idDocente}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubstitutions(data.supplenze);
        }
      } catch (error) {
        console.error("Errore di rete:", error);
        toast.error("Errore di rete durante il recupero delle supplenze.", { position: "top-center" });
      }
    }

    fetchSupplenze();

  });

  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <ToastContainer />
      <Navbar />
      <Typography variant="h3" align="center" gutterBottom className="title">
        Dashboard Professore
      </Typography>

      <h1 className="dashboard-title">Dashboard Professore</h1>

      <h2 className="dashboard-title">
        Calendario Disponibilità <FaCalendarWeek className="widget-icon" />
      </h2>

      <WeeklySchedule schedule={schedule} disponibilita={disponibilita} />

      <h2>Accetta Disponibilità <FaCalendarCheck className="widget-icon" /></h2>

      <SupplenzeDocenti rows={substitutions} setRows={setSubstitutions} setSupplenzeAccettate={setSupplenzeAccettate} />

      <h2>Richiedi Assenza</h2>
      <form className="absence-form" onSubmit={handleAbsenceSubmit}>
        <div className="input">
          <label htmlFor="absenceDate">Data</label>
          <input
            id="absenceDate"
            type="date"
            value={absenceDate}
            onChange={(e) => setAbsenceDate(e.target.value)}
          />
        </div>

        <div className="input">
          <label>Seleziona un motivo</label>
          <div style={{ display: "flex", gap: "20px", marginBottom: "0px" }}>
            <div
              onClick={() => setAbsenceReason("Salute")}
              style={{
                padding: "10px 20px",
                border: "2px solid",
                color: "black",
                borderColor: absenceReason === "Salute" ? "#1976d2" : "#ccc",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: absenceReason === "Salute" ? "#e3f2fd" : "e0e0e0",
                textAlign: "center",
                flex: 1,
                fontFamily: "Poppins",
              }}
            >
              Salute
            </div>
            <div
              onClick={() => setAbsenceReason("Ferie")}
              style={{
                padding: "10px 20px",
                border: "2px solid",
                color: "black",
                borderColor: absenceReason === "Ferie" ? "#1976d2" : "#ccc",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: absenceReason === "Ferie" ? "#e3f2fd" : "e0e0e0",
                textAlign: "center",
                flex: 1,
                fontFamily: "Poppins",
              }}
            >
              Ferie
            </div>
            <div
              onClick={() => setAbsenceReason("Permessi")}
              style={{
                padding: "10px 20px",
                border: "2px solid",
                color: "black",
                borderColor: absenceReason === "Permessi" ? "#1976d2" : "#ccc",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: absenceReason === "Permessi" ? "#e3f2fd" : "e0e0e0",
                textAlign: "center",
                flex: 1,
                fontFamily: "Poppins",
              }}
            >
              Permessi
            </div>
          </div>
        </div>

        <div className="input">
          <label htmlFor="absenceNote">Note (facoltative)</label>
          <textarea
            id="absenceNote"
            value={absenceReason === "" ? absenceNote : ""}
            onChange={(e) => setabsenceNote(e.target.value)}
            placeholder="Inserisci eventuali note..."
            style={{ fontFamily: "Poppins", resize: "none", minHeight: "100px" }}
          />
        </div>
        <Button type="submit" variant="contained" color="primary" fullWidth className="submit-button">
          Invia Richiesta
        </Button>
      </form>
    </div>
  );
}

export default Professore;
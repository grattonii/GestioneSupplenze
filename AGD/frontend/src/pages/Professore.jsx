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

function Professore() {
  const [schedule, setSchedule] = useState({});
  const [substitutions, setSubstitutions] = useState([]);
  const [absenceNote, setabsenceNote] = useState("");
  const [absenceReason, setAbsenceReason] = useState("");
  const [absenceDate, setAbsenceDate] = useState("");
  const [disponibilitaAccettate, setDisponibilitaAccettate] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const filteredSubstitutions = [
      { class: "3Ai", date: "24/03/2025", time: "10:00", id: 1 }, // supplenza futura
      { class: "4Bi", date: "25/03/2025", time: "11:00", id: 2 }, // supplenza settimana successiva
      { class: "5Ci", date: "28/03/2025", time: "12:00", id: 3 }, // supplenza questa settimana
    ];

    setSchedule({
      "Lunedì": ["8:00 - 9:00", "10:00 - 11:00"],
      "Martedì": ["9:00 - 10:00"],
      "Mercoledì": ["11:00 - 12:00"],
      "Giovedì": ["8:00 - 9:00", "10:00 - 11:00"],
      "Venerdì": ["9:00 - 10:00"],
    });

    setSubstitutions(filteredSubstitutions); // Imposta le supplenze filtrate
  };

  const handleAbsenceSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("accessToken");

    const absenceData = {
      date: absenceDate,
      reason: absenceReason,
      note: absenceNote,
    };

    try {
      const response = await fetch("http://localhost:5000/assenze/docente", {
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
  
  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <ToastContainer/>
      <Navbar />
      <Typography variant="h3" align="center" gutterBottom className="title">
        Dashboard Professore
      </Typography>

      <h1 className="dashboard-title">Dashboard Professore</h1>

      <h2 className="dashboard-title">
        Calendario Disponibilità <FaCalendarWeek className="widget-icon" />
      </h2>

      <WeeklySchedule schedule={schedule} disponibilita={disponibilitaAccettate} />

      <h2>Accetta Disponibilità <FaCalendarCheck className="widget-icon" /></h2>

      <SupplenzeDocenti rows={substitutions} setRows={setSubstitutions} setDisponibilitaAccettate={setDisponibilitaAccettate}/>

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
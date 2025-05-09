import { useState, useEffect } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/Professore.css";
import "../styles/Dashboard.css";
import Navbar from "../components/NavbarProf.jsx";
import WeeklySchedule from "../components/WeeklySchedule.jsx";
import { FaCalendarWeek, FaCalendarCheck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Professore() {
  const [schedule, setSchedule] = useState({});
  const [substitutions, setSubstitutions] = useState([]);
  const [absenceNote, setabsenceNote] = useState([]);
  const [absenceReason, setAbsenceReason] = useState("");
  const [absenceDate, setAbsenceDate] = useState("");
  const [disponibilitaAccettate, setDisponibilitaAccettate] = useState([]);

  useEffect(() => {
    fetchData();
    fetchOrario(); // Recupera le impostazioni dell'orario
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

  const fetchOrario = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5000/orari/modifica", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (data) {
        // Aggiorna il calendario in base alle impostazioni dell'orario
        const updatedSchedule = {};
        const giorniLezione = data.giorniLezione === "lun-ven" ? 5 : 6;
  
        const giorniSettimana = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
        for (let i = 0; i < giorniLezione; i++) {
          updatedSchedule[giorniSettimana[i]] = [
            `${data.inizioPrimaLezione} - ${data.fineUltimaLezione}`,
          ];
        }
  
        setSchedule(updatedSchedule);
      }
    } catch (error) {
      console.error("Errore nel recupero delle impostazioni dell'orario:", error);
    }
  };

  const isDateValid = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay(); // 0 = Domenica, 6 = Sabato
  
    // Controlla se la data è nel passato, è una domenica o un sabato (se la scuola è chiusa)
    if (
      selectedDate < today ||
      dayOfWeek === 0 || // Domenica
      (dayOfWeek === 6 && !isSchoolOpenOnSaturday) // Sabato (se chiuso)
    ) {
      return false;
    }
    return true;
  };

  const handleAbsenceSubmit = async (e) => {
    e.preventDefault();
         
    if (!isDateValid(absenceDate)) {
      toast.error("Data non valida! Seleziona una data futura, non di domenica o sabato (se chiuso).");
      return;
    }
  
    const token = sessionStorage.getItem("accessToken");
  
    if (!token) {
      toast.warn("Sessione scaduta. Effettua di nuovo il login.");
      return;
    }
  
    const absenceData = {
      date: absenceDate,
      reason: absenceReason,
      note: absenceNote,
    };
  
    try {
      console.log("Dati inviati:", absenceData);
  
      const response = await fetch("http://localhost:5000/api/assenze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(absenceData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Errore API:", errorData);
        toast.error("Errore durante l'invio della richiesta di assenza.");
        return;
      }
  
      console.log("Richiesta inviata con successo:", await response.json());
      toast.success("Richiesta assenza inviata con successo!");
      setAbsenceDate("");
      setAbsenceReason("");
      setabsenceNote("");
    } catch (error) {
      console.error("Errore di rete:", error);
      toast.error("Errore di rete durante l'invio della richiesta di assenza.");
    }
  };

  const rejectSubstitution = (sub) => {
    // Rimuovi la supplenza dalla lista delle supplenze in attesa
    const updatedSubstitutions = substitutions.filter((s) => s.id !== sub.id);
    setSubstitutions(updatedSubstitutions);
  };

  const acceptSubstitution = (sub) => {
    const dayOfWeek = new Date(
      sub.date.split(" ")[1] // Ottieni il giorno della settimana
    ).toLocaleDateString("it-IT", { weekday: "long" });
  
    setSchedule((prevSchedule) => {
      const updatedSchedule = { ...prevSchedule };
      
      if (!updatedSchedule[dayOfWeek]) {
        updatedSchedule[dayOfWeek] = []; // Se il giorno non esiste, inizializzalo
      }
      
      // Aggiungi l'orario solo se non è già presente
      if (!updatedSchedule[dayOfWeek].includes(sub.time)) {
        updatedSchedule[dayOfWeek] = [...updatedSchedule[dayOfWeek], sub.time];
      }
  
      return { ...updatedSchedule }; // Restituiamo un nuovo oggetto per forzare il re-render
    });
  
    setSubstitutions((prevSubstitutions) =>
      prevSubstitutions.filter((s) => s.id !== sub.id)
    );
  };

  const handleAcceptAvailability = (date, time, className) => {
    const dayName = new Date(date).toLocaleDateString("it-IT", { weekday: "long" }); // Ottieni il giorno della settimana
    const nuovaDisponibilita = { day: dayName, time, className };
    setDisponibilitaAccettate((prev) => [...prev, nuovaDisponibilita]);
    alert("Disponibilità accettata!");
  };

  const handleAcceptSubstitution = (sub) => {
    setSchedule((prevSchedule) => {
      const updatedSchedule = { ...prevSchedule };
      const dayOfWeek = new Date(sub.date).toLocaleDateString("it-IT", { weekday: "long" });
  
      if (!updatedSchedule[dayOfWeek]) {
        updatedSchedule[dayOfWeek] = [];
      }
  
      if (!updatedSchedule[dayOfWeek].includes(sub.time)) {
        updatedSchedule[dayOfWeek].push(sub.time);
      }
  
      return updatedSchedule;
    });
  
    setSubstitutions((prev) => prev.filter((s) => s.id !== sub.id));
    alert(`Supplenza accettata per la classe ${sub.class} il ${sub.date} alle ${sub.time}`);
  };
  
  const handleRejectSubstitution = (sub) => {
    setSubstitutions((prev) => prev.filter((s) => s.id !== sub.id));
    alert(`Supplenza rifiutata per la classe ${sub.class} il ${sub.date} alle ${sub.time}`);
  };
  
  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Navbar />
      <ToastContainer />
      <Typography variant="h3" align="center" gutterBottom className="title">
        Dashboard Professore
      </Typography>

      <h1 className="dashboard-title">Dashboard Professore</h1>

      <h2 className="dashboard-title">
        Calendario Disponibilità <FaCalendarWeek className="widget-icon" />
      </h2>

      {/* Passiamo le disponibilità accettate a WeeklySchedule */}
      <WeeklySchedule
        schedule={schedule}
        disponibilita={disponibilitaAccettate}
        orario={{
          inizioPrimaLezione: "08:00",
          fineUltimaLezione: "14:00",
          durataLezioni: "60",
          giorniLezione: "lun-ven",
        }}
      />

      <h2>Accetta Supplenza <FaCalendarCheck className="widget-icon" /></h2>

      <TableContainer component={Paper} sx={{
        maxWidth: "1200px",
        margin: "auto",
        marginBottom: 15,
        borderRadius: 2,
        boxShadow: 3,
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#335C81" }}>
              <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins" }}>Classe</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins" }}>Data</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins" }}>Orario</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins" }}>Azione</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {substitutions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", padding: 3, fontFamily: "Poppins" }}>
                  <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                    Nessun richiesta disponibile al momento.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              substitutions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{sub.class}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{sub.date}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{sub.time}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                    <IconButton
                      color="success"
                      onClick={() => handleAcceptSubstitution(sub)}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleRejectSubstitution(sub)}>
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
                backgroundColor: absenceReason === "Salute" ? "#e3f2fd" : "white",
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
                backgroundColor: absenceReason === "Ferie" ? "#e3f2fd" : "white",
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
                backgroundColor: absenceReason === "Permessi" ? "#e3f2fd" : "white",
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
            style={{ fontFamily: "Poppins" }}
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
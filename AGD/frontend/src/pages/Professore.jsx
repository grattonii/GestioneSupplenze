import { useState, useEffect } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/Professore.css";
import "../styles/Dashboard.css";
import Navbar from "../components/NavbarProf.jsx";
import WeeklySchedule from "../components/WeeklySchedule.jsx";
import { FaCalendarWeek, FaCalendarCheck } from "react-icons/fa";

function Professore() {
  const [schedule, setSchedule] = useState({});
  const [substitutions, setSubstitutions] = useState([]);
  const [absenceReason, setAbsenceReason] = useState("");
  const [absenceDate, setAbsenceDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const filteredSubstitutions = [
      { class: "3Ai", date: "Lunedì 24/03/2025", time: "10:00", id: 1 }, // supplenza futura
      { class: "4Bi", date: "Martedì 25/03/2025", time: "11:00", id: 2 }, // supplenza settimana successiva
      { class: "5Ci", date: "Venerdì 28/03/2025", time: "12:00", id: 3 }, // supplenza questa settimana
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

  const handleAbsenceSubmit = (e) => {
    e.preventDefault();
    console.log("Richiesta assenza inviata:", { absenceDate, absenceReason });
  };

  const rejectSubstitution = (sub) => {
    // Rimuovi la supplenza dalla lista delle supplenze in attesa
    const updatedSubstitutions = substitutions.filter((s) => s.id !== sub.id);
    setSubstitutions(updatedSubstitutions);
  };

  return (
    <div>
      <Navbar />
      <Typography variant="h3" align="center" gutterBottom className="title">
        Dashboard Professore
      </Typography>

      <h1 className="dashboard-title">Dashboard Professore</h1>

      <h2 className="dashboard-title">
        Calendario Disponibilità <FaCalendarWeek className="widget-icon" />
      </h2>

      {/* Calendario */}
      <WeeklySchedule />

      <h2>Accetta Disponibilità <FaCalendarCheck className="widget-icon" /></h2>

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
              <TableCell sx={{ color: "white", textAlign: "center" }}>Classe</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>Data</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>Orario</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center" }}>Azione</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {substitutions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", padding: 3 }}>
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
                    <IconButton color="success" onClick={() => rejectSubstitution(sub)}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => rejectSubstitution(sub)}>
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
          <label htmlFor="absenceReason">Motivo</label>
          <textarea
            id="absenceReason"
            value={absenceReason}
            onChange={(e) => setAbsenceReason(e.target.value)}
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
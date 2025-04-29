import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const WeeklySchedule = ({ schedule, disponibilita }) => {
  const [fasceOrarie, setFasceOrarie] = useState([]);
  const [giorni, setGiorni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  // Utility
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setFullYear(date.getFullYear(), date.getMonth(), diff));
  };

  const getWeekDays = (startOfWeek) => {
    return Array.from({ length: giorni.length }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const espandiGiorniLezione = (range) => {
    const abbrev = ["lun", "mar", "mer", "gio", "ven", "sab"];
    const mappaGiorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
    const [inizio, fine] = range.split("-");
    const startIdx = abbrev.indexOf(inizio);
    const endIdx = abbrev.indexOf(fine);
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return [];
    return mappaGiorni.slice(startIdx, endIdx + 1);
  };

  useEffect(() => {
    const fetchFasceOrarieEGiorni = () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
        navigate("/");
        return;
      }

      fetch("http://localhost:5000/orari/fasce-orarie", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data || data.length === 0) return;

          const nuoveFasce = data.map((fascia) => `${fascia.inizio} - ${fascia.fine}`);
          const nuoviGiorni = espandiGiorniLezione(data[0].giorniLezione);

          setFasceOrarie((prevFasce) =>
            JSON.stringify(prevFasce) !== JSON.stringify(nuoveFasce) ? nuoveFasce : prevFasce
          );

          setGiorni((prevGiorni) =>
            JSON.stringify(prevGiorni) !== JSON.stringify(nuoviGiorni) ? nuoviGiorni : prevGiorni
          );

          if (!hasLoadedOnce) {
            setHasLoadedOnce(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Errore nel caricamento delle fasce orarie:", err);
        });
    };

    fetchFasceOrarieEGiorni();
    const interval = setInterval(fetchFasceOrarieEGiorni, 5000);
    return () => clearInterval(interval);
  }, []);

  const startOfWeek = getStartOfWeek(new Date(currentDate));
  const weekDays = giorni.length > 0 ? getWeekDays(startOfWeek) : [];

  if (loading || fasceOrarie.length === 0 || giorni.length === 0) {
    return <Typography align="center">Caricamento in corso...</Typography>;
  }

  console.log("fasceOrarie:", fasceOrarie);
  console.log("giorni:", giorni);
  console.log("disponibilita:", disponibilita);

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: "1200px",
        margin: "auto",
        borderRadius: 2,
        boxShadow: 3,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#335C81",
          color: "white",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
          sx={{ backgroundColor: "#1D3557", color: "white" }}
        >
          Settimana Precedente
        </Button>
        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "16px" }}>
          {weekDays[0].toLocaleDateString()} - {weekDays[weekDays.length - 1].toLocaleDateString()}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
          sx={{ backgroundColor: "#1D3557", color: "white" }}
        >
          Settimana Successiva
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#335C81" }}>
            <TableCell sx={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Ora</TableCell>
            {weekDays.map((day, index) => (
              <TableCell
                key={index}
                sx={{ color: "white", textAlign: "center", fontWeight: "bold" }}
              >
                {giorni[index]}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {fasceOrarie.map((hour, hourIndex) => (
            <TableRow key={hourIndex}>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{hour}</TableCell>
              {giorni.map((giorno, dayIndex) => {
                const isAccepted = disponibilita[giorno]?.attivo && disponibilita[giorno]?.orari.some(o => o.fascia === hour);
                return (
                  <TableCell
                    key={dayIndex}
                    sx={{
                      textAlign: "center",
                      backgroundColor: isAccepted ? "#d4edda" : "#f8d7da",
                      color: isAccepted ? "#155724" : "#721c24",
                      fontWeight: "bold",
                    }}
                  >
                    {isAccepted ? "Disponibile" : "Non disponibile"}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeeklySchedule;
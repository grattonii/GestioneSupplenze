import React, { useState } from "react";
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

const WeeklySchedule = ({ schedule, disponibilita }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const schoolHours = ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00"];

  // Funzione per ottenere l'inizio della settimana (lunedì)
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // Funzione per ottenere i giorni della settimana (solo lunedì-venerdì)
  const getWeekDays = (startOfWeek) => {
    return Array.from({ length: 5 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  const startOfWeek = getStartOfWeek(new Date(currentDate));
  const weekDays = getWeekDays(startOfWeek);

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
          {weekDays[0].toLocaleDateString()} - {weekDays[4].toLocaleDateString()}
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
                {day.toLocaleDateString("it-IT", { weekday: "long" })}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {schoolHours.map((hour, hourIndex) => (
            <TableRow key={hourIndex}>
              <TableCell sx={{ textAlign: "center", fontWeight: "bold" }}>{hour}</TableCell>
              {weekDays.map((day, dayIndex) => {
                const dayName = day.toLocaleDateString("it-IT", { weekday: "long" });
                const isAccepted = disponibilita.some(
                  (d) => d.day === dayName && d.time === hour
                );
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
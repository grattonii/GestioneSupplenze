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

const WeeklySchedule = ({ schedule }) => {
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
          sx={{ fontFamily: "Poppins", backgroundColor: "#1D3557", color: "white" }}
        >
          Settimana Precedente
        </Button>
        <Typography
          variant="h6"
          sx={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "16px" }}
        >
          {weekDays[0].toLocaleDateString()} - {weekDays[4].toLocaleDateString()}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
          sx={{ fontFamily: "Poppins", backgroundColor: "#1D3557", color: "white" }}
        >
          Settimana Successiva
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#335C81" }}>
            <TableCell
              sx={{ color: "white", textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}
            >
              Ora
            </TableCell>
            {weekDays.map((day, index) => (
              <TableCell
                key={index}
                sx={{ color: "white", textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}
              >
                {day.toLocaleDateString("it-IT", { weekday: "long" })}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {schoolHours.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: "center", padding: 3 }}>
                <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                  Vuoto
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            schoolHours.map((hour, hourIndex) => (
              <TableRow key={hourIndex}>
                <TableCell
                  sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}
                >
                  {hour}
                </TableCell>
                {weekDays.map((day, dayIndex) => {
                  const dayName = day.toLocaleDateString("it-IT", { weekday: "long" });
                  return (
                    <TableCell
                      key={dayIndex}
                      sx={{
                        textAlign: "center",
                        fontFamily: "Poppins",
                        cursor: "pointer",
                        backgroundColor: schedule[dayName]?.includes(hour) ? "#d4edda" : "#f8d7da",
                        color: schedule[dayName]?.includes(hour) ? "#155724" : "#721c24",
                        fontWeight: "bold",
                      }}
                    >
                      {schedule[dayName]?.includes(hour) ? "Disponibile" : "Non disponibile"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeeklySchedule;
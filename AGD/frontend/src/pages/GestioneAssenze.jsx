import { useState, useEffect } from "react";
import Navbar from "../components/Navbar2.jsx";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

function GestioneAssenze() {
  const [assenze, setAssenze] = useState([]);

  useEffect(() => {
    fetchAssenze();
  }, []);

  const fetchAssenze = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/assenze");
      if (response.ok) {
        const data = await response.json();
        setAssenze(data);
      } else {
        console.error("Errore durante il recupero delle assenze");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ fontFamily: "Poppins, sans-serif", padding: "20px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Gestione Assenze
        </Typography>
        {assenze.length === 0 ? (
          <Typography variant="h6" align="center" color="textSecondary">
            Nessuna assenza registrata.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ maxWidth: "1200px", margin: "auto", marginTop: 3, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#335C81" }}>
                  <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                    Data
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                    Motivo
                  </TableCell>
                  <TableCell sx={{ color: "white", textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                    Note
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assenze.map((assenza) => (
                  <TableRow key={assenza.id}>
                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "600"}}>{assenza.date}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "600"}}>{assenza.reason}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "600" }}>
                      {assenza.note || "Nessuna nota"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </>
  );
}

export default GestioneAssenze;
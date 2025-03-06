import React, { useState } from "react";
import {Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";

function ReportTabella({ rows}) {
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "1000px",
          margin: "auto",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2c3e50" }}>
              {["Docente", "Ore disponibilita", "Ore pagate"].map((header) => (
                <TableCell
                  key={header}
                  sx={{ color: "white", textAlign: "center" }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", padding: 2 }}>
                  <Typography variant="h6">Nessun dato diponibile al momento.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} onClick={() => handleOpen(row)} sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    color: "black",
                  }
                }}>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 200 }}>{row.docente}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 300 }}>{row.disponibilità}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 300 }}>{row.pagamento}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ReportTabella;
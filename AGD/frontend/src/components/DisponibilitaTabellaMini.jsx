import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function DisponibilitaTabellaMini({ rows, setRows }) {
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
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#335C81" }}>
                        {["Docente", "Giorno", "Ora"].map((header) => (
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
                            <TableCell colSpan={3} sx={{ textAlign: "center", padding: 3 }}>
                                <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                                    Nessun docente disponibile al momento.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row) => (
                            <TableRow key={row.id} onClick={() => handleOpen(row)} sx={{
                                cursor: "pointer",
                                transition: "transform 0.2s",
                                "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                }
                            }}>
                                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.docente}</TableCell>
                                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.giorno}</TableCell>
                                <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.ora}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DisponibilitaTabellaMini;
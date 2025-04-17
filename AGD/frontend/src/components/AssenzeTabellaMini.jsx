import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function AssenzeTabella({ rows }) {
    return (
        <>
            <TableContainer component={Paper} sx={{
                maxWidth: "1200px",
                margin: "auto",
                marginBottom: 15,
                borderRadius: 2,
                boxShadow: 3,
            }}>
                <Table>
                    <TableHead
                        sx={{
                            display: "table",
                            width: "100%",
                            tableLayout: "fixed",
                            backgroundColor: "#335C81",
                        }}>
                        <TableRow>
                            {["Data", "Docente", "Motivo", "Note"].map((header) => (
                                <TableCell
                                    key={header}
                                    sx={{
                                        color: "white",
                                        textAlign: "center",
                                        fontFamily: "Poppins",
                                        fontWeight: 600,
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} sx={{ textAlign: "center", padding: 3 }}>
                                    <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                                        Nessun richiesta disponibile al momento.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.id} sx={{
                                    display: "table",
                                    tableLayout: "fixed",
                                    width: "100%",
                                    transition: "background-color 0.2s",
                                    "&:hover": {
                                        backgroundColor: "#f9f9f9",
                                    },
                                }}>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.date}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.docente}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.reason}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: 600 }}>
                                        {row.note || "Nessuna nota"}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default AssenzeTabella;
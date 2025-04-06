import React from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton} from "@mui/material";

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
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#335C81" }}>
                            <TableCell sx={{ color: "white", textAlign: "center" }}>Docente</TableCell>
                            <TableCell sx={{ color: "white", textAlign: "center" }}>Data</TableCell>
                            <TableCell sx={{ color: "white", textAlign: "center" }}>Motivazione</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: "center", padding: 3 }}>
                                    <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                                        Nessun richiesta disponibile al momento.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={rows.id}>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.docente}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.data}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.motivazione}</TableCell>
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
import {useState} from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton} from "@mui/material";
import Navbar from "../components/Navbar2.jsx";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function Configurazione () {
    const [substitutions, setSubstitutions] = useState([]);
    return (
        <>
            <Navbar />
            <h1 className="title">Gestione Assenze</h1>
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
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{sub.docente}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{sub.date}</TableCell>
                                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{sub.motivazione}</TableCell>
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
        </>
    );
};

export default Configurazione;
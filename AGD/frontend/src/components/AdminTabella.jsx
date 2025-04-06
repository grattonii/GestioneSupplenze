import React, { useState } from "react";
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton
} from "@mui/material";
import { FaTrash, FaPlayCircle, FaPauseCircle } from "react-icons/fa";

function AdminTabella({ rows, setRows }) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpen = (row) => {
    if (row) {
      setSelectedRow({ ...row });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleChange = (e) => {
    setSelectedRow((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = () => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === selectedRow.id ? { ...selectedRow } : row))
    );
    handleClose();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const toggleStatus = (e, id) => {
    e.stopPropagation();
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, stato: row.stato === "attivo" ? "sospeso" : "attivo" } : row
      )
    );
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: "1200px", margin: "auto", borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#335C81" }}>
              {["Scuola", "Email referente", "Stato", ""].map((header) => (
                <TableCell key={header} sx={{ color: "white", textAlign: "center" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          <Table sx={{ tableLayout: "fixed" }}>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} style={{ textAlign: "center", padding: 3 }}>
                    <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                      Nessun admin disponibile.
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
                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.nomeScuola}</TableCell>
                    <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.emailReferente}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton onClick={(e) => toggleStatus(e, row.id)}>
                        {row.stato === "attivo" ? (
                          <FaPauseCircle color="yellow" size={23} />
                        ) : (
                          <FaPlayCircle color="green" size={23} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton onClick={(e) => handleDelete(e, row.id)}>
                        <FaTrash color="red" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </TableContainer>
    </>
  );
}

export default AdminTabella;
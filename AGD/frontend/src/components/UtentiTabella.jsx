import React, { useState, useEffect, useRef } from "react";
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { FaTrash } from "react-icons/fa";
import "../styles/Tabelle.css";
import { fetchWithRefresh } from "../utils/api";

function UtentiTabella({ rows, setRows }) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

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

  const handleDeleteRequest = (id) => {
    setRowToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleReset = async (row) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetchWithRefresh(`http://localhost:5000/admin/reset/${row.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Errore durante il reset:", error);
      setRows(rows);
    }
  };

  const handleChangeRole = async (e) => {
    const newRole = e.target.value;
    setSelectedRow((prev) => ({ ...prev, role: newRole }));
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === selectedRow.id ? { ...row, role: newRole } : row
      )
    );

    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetchWithRefresh(`http://localhost:5000/admin/ruolo/${selectedRow.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ruolo: newRole }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error);
      setRows(rows); // Ripristina lo stato precedente
    }
  };

  const confirmDelete = async () => {
    const newRows = rows.filter((row) => row.id !== rowToDelete); // Filtro già fatto
    setRows(newRows); // Rimuovi la riga dalla tabella
    setConfirmDeleteOpen(false);
    setRowToDelete(null);

    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await fetchWithRefresh(`http://localhost:5000/admin/annullaUtente/${rowToDelete}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento:", error);
      setRows(rows); // Ripristina lo stato precedente
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setRowToDelete(null);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Table
          sx={{
            display: "block",
            width: "100%",
          }}
        >
          <TableHead
            sx={{
              display: "table",
              width: "100%",
              tableLayout: "fixed",
              backgroundColor: "#335C81",
            }}
          >
            <TableRow>
              {["Docente", "Email", "Ruolo", ""].map((header) => (
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

          <TableBody
            sx={{
              display: "block",
              maxHeight: "510px",
              overflowY: "auto",
              width: "100%",
            }}
          >
            {rows.length === 0 ? (
              <TableRow sx={{ display: "table", width: "100%", tableLayout: "fixed" }}>
                <TableCell colSpan={6} sx={{ textAlign: "center", padding: 3 }}>
                  <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                    Nessun utente disponibile.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleOpen(row)}
                  sx={{
                    display: "table",
                    tableLayout: "fixed",
                    width: "100%",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.username}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.email}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.role == "docente" ? "Docente" : "Admin"}</TableCell>
                  <TableCell sx={{ textAlign: "center", display: "flex", flexDirection: "row", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                    <button className="reset" onClick={(e) => handleReset(row)}>
                      Reset Default
                    </button>

                    <IconButton onClick={() => handleDeleteRequest(row.id)}>
                      <FaTrash color="red" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "black" }}>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "Poppins" }}>Sei sicuro di voler eliminare questo utente?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} sx={{ fontFamily: "Poppins" }}>Annulla</Button>
          <Button onClick={() => confirmDelete()} color="error" sx={{ fontFamily: "Poppins" }}>Elimina</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "black" }}>Modifica Ruolo</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label" sx={{ backgroundColor: "#fff", padding: "0px 10px 0px 5px" }}>Ruolo</InputLabel>
            <Select
              labelId="role-label"
              id="role-select"
              value={selectedRow?.role || ""}
              label="Ruolo"
              name="role"
              onChange={handleChangeRole}
              sx={{ fontFamily: "Poppins" }}
            >
              <MenuItem value="admin2">Admin</MenuItem>
              <MenuItem value="docente">Docente</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ fontFamily: "Poppins" }}>Annulla</Button>
          <Button onClick={handleUpdate} sx={{ fontFamily: "Poppins" }}>Salva</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UtentiTabella;
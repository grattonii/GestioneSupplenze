import React, { useState, useEffect, useRef } from "react";
import {
  Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton
} from "@mui/material";
import { FaTrash, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import "../styles/Tabelle.css";

function AdminTabella({ rows, setRows }) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [visibleRows, setVisibleRows] = useState({});

  const observer = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const updated = {};
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          updated[id] = entry.isIntersecting;
        });
        setVisibleRows((prev) => ({ ...prev, ...updated }));
      },
      {
        root: document.querySelector("#table-body-scroll"),
        threshold: 0.7,
      }
    );

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  const rowRefs = useRef({});

  useEffect(() => {
    if (!observer.current) return;
    rows.forEach((row) => {
      const el = rowRefs.current[row.id];
      if (el) observer.current.observe(el);
    });
  }, [rows]);

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

  const confirmDelete = () => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== rowToDelete));
    setConfirmDeleteOpen(false);
    setRowToDelete(null);
  };

  const cancelDelete = () => {
    setConfirmDeleteOpen(false);
    setRowToDelete(null);
  };

  const toggleStatus = async (e, id) => {
    e.stopPropagation();

    // Trova la riga da aggiornare
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        // Cambia lo stato in base al valore booleano
        return { ...row, attivo: row.attivo === true ? false : true }; // Cambia stato da attivo a sospeso e viceversa
      }
      return row;
    });

    // Aggiorna lo stato a livello di UI
    setRows(updatedRows);

    try {
      const token = sessionStorage.getItem("accessToken");
      const targetRow = updatedRows.find(r => r.id === id);

      // Invia la richiesta PATCH al backend per aggiornare lo stato
      const response = await fetch(`http://localhost:5000/root/admin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ attivo: targetRow.attivo }) // inviamo il valore booleano
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento dello stato:", error);
      // Ripristina lo stato precedente in caso di errore
      setRows(rows);
    }
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
              {["Scuola", "Email referente", "Stato", ""].map((header) => (
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
            id="table-body-scroll"
            sx={{
              display: "block",
              maxHeight: "510px",
              overflowY: "auto",
              width: "100%",
            }}
          >
            {rows.length === 0 ? (
              <TableRow sx={{ display: "table", width: "100%", tableLayout: "fixed" }}>
                <TableCell colSpan={4} sx={{ textAlign: "center", padding: 3 }}>
                  <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 500 }}>
                    Nessun admin disponibile.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  ref={(el) => (rowRefs.current[row.id] = el)}
                  data-id={row.id}
                  className={`table-row ${visibleRows[row.id] ? "in-view" : ""}`}
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
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.nomeScuola}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.emailReferente}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton onClick={(e) => toggleStatus(e, row.id)}>
                      {row.attivo ? (
                        <FaPlayCircle color="green" size={23} />  // attivo, icona verde
                      ) : (
                        <FaPauseCircle color="yellow" size={23} />  // sospeso, icona gialla
                      )}
                    </IconButton>
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
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
          <Button onClick={confirmDelete} color="error" sx={{ fontFamily: "Poppins" }}>Elimina</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AdminTabella;
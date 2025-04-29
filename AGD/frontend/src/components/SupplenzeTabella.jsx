import { useState, useEffect, useRef } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Select, MenuItem, InputLabel, FormControl, Autocomplete } from "@mui/material";
import { FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import "../styles/Tabelle.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { fetchWithRefresh } from "../utils/api";

dayjs.extend(customParseFormat);

function SupplenzeTabella({ rows, setRows, fasceOrarie, Classi }) {
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [suggestioniDocenti, setSuggestioniDocenti] = useState([]);

  // Apri il dialog con la riga selezionata
  const handleOpen = (row) => {
    setSelectedRow({ ...row }); // Copia i dati per evitare mutazioni dello stato originale
    setOpen(true);
  };

  // Chiudi il dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  // Gestisce le modifiche nei campi del dialog
  const handleChange = (e) => {
    setSelectedRow({ ...selectedRow, [e.target.name]: e.target.value });
  };

  const validateDate = (date) => {
    // Controlla se la data è nel formato corretto usando dayjs con il formato 'DD-MM-YYYY'
    const parsedDate = dayjs(date, "DD/MM/YYYY", true); // 'true' forza la validazione esatta del formato
    return parsedDate.isValid(); // Se la data è valida, ritorna true
  };

  const handleUpdate = () => {
    if (!selectedRow.docente || !selectedRow.classe || !selectedRow.data || !selectedRow.ora) {
      toast.error("Compila tutti i campi!", { position: "top-center" });
      return;
    }

    if (!validateDate(selectedRow.data)) {
      toast.error("Formato data non valido. Usa il formato DD/MM/YYYY", { position: "top-center" });
      return;
    }

    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === selectedRow.id ? { ...row, ...selectedRow } : row
      )
    );

    handleClose();
  };

  useEffect(() => {
    if (
      selectedRow?.data &&
      selectedRow?.ora &&
      selectedRow?.classe &&
      validateDate(selectedRow?.data)
    ) {
      fetchDocentiDisponibili();
    }
  }, [open, selectedRow?.data, selectedRow?.ora, selectedRow?.classe]);

  const fetchDocentiDisponibili = async () => {
    try {
      if (!selectedRow.classe) return;

      const res = await fetchWithRefresh(
        `http://localhost:5000/supplenze/disponibili?data=${selectedRow.data}&ora=${encodeURIComponent(selectedRow.ora)}&classe=${encodeURIComponent(selectedRow.classe)}`
      );

      const dataRes = await res.json();

      if (Array.isArray(dataRes)) {
        setSuggestioniDocenti(dataRes);
      } else {
        setSuggestioniDocenti([]);
      }
    } catch (err) {
      console.error("Errore nel recupero dei docenti disponibili:", err);
    }
  };

  // Cancella una riga
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

  return (
    <>
      {/* Tabella */}
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
              {["Docente", "Classe", "Data", "Ora", "Stato", ""].map((header) => (
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
                    Nessuna supplenza da gestire al momento.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  sx={{
                    display: "table",
                    tableLayout: "fixed",
                    width: "100%",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                  onClick={() => handleOpen(row)}
                >
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.docente}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.classe}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.data}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>{row.ora}</TableCell>
                  <TableCell sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                    {row.stato === "Accettata" ? (
                      <FaCheckCircle color="green" size={23} />
                    ) : row.stato === "In attesa" ? (
                      <FaHourglassHalf color="orange" size={23} />
                    ) : (
                      <FaTimesCircle color="red" size={23} />
                    )}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
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

      {/* Dialog per modificare i dati */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle sx={{ color: "black" }}>Modifica Supplenza</DialogTitle>
        <DialogContent>
          <TextField
            label="Data"
            name="data"
            type="text"
            fullWidth
            value={selectedRow?.data || ""}
            onChange={handleChange}
            margin="dense"
            placeholder="DD/MM/YYYY"
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="ora-label" sx={{ backgroundColor: "#fff", padding: "0px 10px 0px 5px" }}>
              Fascia Oraria
            </InputLabel>
            <Select
              labelId="ora-label"
              name="ora"
              value={selectedRow?.ora || ""}
              onChange={handleChange}
              sx={{
                fontFamily: "Poppins",
                fontSize: "16px",
                color: "#333",
                backgroundColor: "#f9f9f9",
                borderRadius: "5px",
              }}
            >
              {fasceOrarie.map((fascia, index) => (
                <MenuItem key={index} value={fascia}>
                  {fascia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            options={Classi}
            getOptionLabel={(option) => option}
            value={selectedRow?.classe || ""}
            onChange={(e, value) => {
              handleChange({ target: { name: "classe", value } });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Classe"
                fullWidth
                margin="dense"
                sx={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  color: "#333",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                }}
              />
            )}
            renderOption={(props, option) => (
              <li
                {...props}
                style={{
                  fontSize: "16px",
                  padding: "8px 16px",
                }}
              >
                {option}
              </li>
            )}
          />
          <Autocomplete
            disabled={!selectedRow?.data || !selectedRow?.ora}
            options={suggestioniDocenti}
            getOptionLabel={(option) => `${option.nome} ${option.cognome}`}
            value={selectedRow?.docente || ""}
            onChange={(e, value) => {
              handleChange({
                target: { name: "docente", value: value || "" },
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Docente"
                fullWidth
                margin="dense"
                helperText={
                  !selectedRow?.data || !selectedRow?.ora
                    ? "Inserisci prima data e fascia oraria"
                    : ""
                }
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annulla</Button>
          <Button onClick={handleUpdate}>Modifica</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={cancelDelete}>
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "black" }}>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "Poppins" }}>Sei sicuro di voler eliminare questa supplenza?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} sx={{ fontFamily: "Poppins" }}>Annulla</Button>
          <Button onClick={confirmDelete} color="error" sx={{ fontFamily: "Poppins" }}>Elimina</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SupplenzeTabella;
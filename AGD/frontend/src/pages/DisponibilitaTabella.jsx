import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { FaTrash } from "react-icons/fa";

function SupplenzeTabella({ rows, setRows }) {
  const handleDelete = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "1000px", margin: "auto", borderRadius: 2, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#2c3e50" }}>
            <TableCell sx={{ color: "white" }}>Docente</TableCell>
            <TableCell sx={{ color: "white" }}>Materia</TableCell>
            <TableCell sx={{ color: "white" }}>Ora</TableCell>
            <TableCell sx={{ color: "white" }}>Azioni</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.docente}</TableCell>
              <TableCell>{row.materia}</TableCell>
              <TableCell>{row.ora}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleDelete(row.id)}>
                  <FaTrash color="red" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SupplenzeTabella;
import React, { useState, useEffect, useRef } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import "../styles/Tabelle.css";

function AdminTabellaMini({ rows }) {
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
              {["Scuola", "Email referente", "Stato"].map((header) => (
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
                <TableCell colSpan={3} sx={{ textAlign: "center", padding: 3 }}>
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
                    <IconButton>
                      {row.stato === "attivo" ? (
                        <FaPauseCircle color="yellow" size={23} />
                      ) : (
                        <FaPlayCircle color="green" size={23} />
                      )}
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
}

export default AdminTabellaMini;
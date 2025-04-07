import React, { useState, useEffect, useRef  } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "../styles/Tabelle.css";

function ReportTabella({ rows }) {
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
        <Table sx={{ display: "block", width: "100%" }}>
          <TableHead
            sx={{
              display: "table",
              width: "100%",
              tableLayout: "fixed",
              backgroundColor: "#335C81",
            }}
          >
            <TableRow>
              {["Docente", "Ore disponibilita", "Ore pagate"].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    color: "white",
                    textAlign: "center",
                    fontFamily: "Poppins",
                    fontWeight: "bold",
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
              <TableRow
                sx={{
                  display: "table",
                  width: "100%",
                  tableLayout: "fixed",
                }}
              >
                <TableCell colSpan={3} sx={{ textAlign: "center", padding: 2 }}>
                  <Typography variant="h6">
                    Nessun dato disponibile al momento.
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
                  sx={{
                    display: "table",
                    width: "100%",
                    tableLayout: "fixed",
                    cursor: "default",
                    transition: "background 0.2s",
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontFamily: "Poppins",
                      fontWeight: "bold",
                    }}
                  >
                    {row.docente}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontFamily: "Poppins",
                      fontWeight: "bold",
                    }}
                  >
                    {row.disponibilità}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontFamily: "Poppins",
                      fontWeight: "bold",
                    }}
                  >
                    {row.pagamento}
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

export default ReportTabella;
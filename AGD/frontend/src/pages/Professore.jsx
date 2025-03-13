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
              {["Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi"].map((header) => (
                <TableCell key={header} sx={{ color: "white", textAlign: "center", fontFamily: "Poppins", fontWeight: 600 }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((hour) => (
              <TableRow key={hour} sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  color: "black",
                }
              }}>
                <TableCell sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>{hour}</TableCell>
                {Object.keys(schedule).map((day) => (
                  <TableCell key={day} sx={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold" }}>
                    {schedule[day] && schedule[day].length >= hour ? schedule[day][hour - 1] : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
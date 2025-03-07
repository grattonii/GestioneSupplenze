import React from "react";
import {Tooltip, ResponsiveContainer, PieChart, Pie, Cell  } from "recharts";
import Navbar from "../components/Navbar2.jsx";
import ReportTabella from "../components/ReportTabella.jsx";
import "../styles/Pagine.css";

const data = [
  { 
    docente: "Mario Rossi", 
    disponibilità: 40,
    pagamento: 30 
  },
  { 
    docente: "Luca Bianchi",
    disponibilità: 35, 
    pagamento: 28 
  },
  { 
    docente: "Anna Verdi", 
    disponibilità: 50, 
    pagamento: 45 
  },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

function Report() {
  return (
    <div>
      <Navbar />
      <h1 className="title">Report</h1>
      <ReportTabella rows={data}/>
      <div className="grafico">
          <h2>Distribuzione delle ore</h2>
          <ResponsiveContainer width="90%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="disponibilità"
                nameKey="docente"
                cx="50%"
                cy="50%"
                outerRadius={180}
                fill="#8884d8"
                label
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
}

export default Report;
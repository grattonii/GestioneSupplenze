import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

function Report() {
  return (
    <div>
      <Navbar />
      <h1 className="title">Report</h1>
      <ReportTabella rows={data}/>
      {/* Grafico */}
      <div className="grafico-container">
        <h2>Ore di supplenza per docente</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="docente" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="disponibilità" fill="#8884d8" />
            <Bar dataKey="pagamento" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Report;
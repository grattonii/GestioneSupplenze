import React from "react"; 
import Navbar from "../components/Navbar2.jsx";
import ReportTabella from "../components/ReportTabella.jsx";
import ReportGrafico from "../components/ReportGrafico.jsx";
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
  // Prepara i dati per il grafico
  const chartData = data.map(item => ({
    name: item.docente,
    value: item.disponibilità,
  }));

  return (
    <div>
      <Navbar />
      <h1 className="title">Report</h1>
      <ReportTabella rows={data} />
      <div className="grafico">
        <h2>Distribuzione delle ore</h2>
        <ReportGrafico data={chartData} />
      </div>
    </div>
  );
}

export default Report;
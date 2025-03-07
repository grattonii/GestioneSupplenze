import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaUsers, FaClipboardList, FaChartBar } from "react-icons/fa";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar.jsx";
import SupplenzeTabella from "../components/SupplenzeTabella.jsx";
import ReportTabella from "../components/ReportTabella.jsx";
import DisponibilitaTabella from "../components/DisponibilitaTabella.jsx";

function Dashboard() {
  const navigate = useNavigate();

  // Dati di esempio per i widget
  const supplenzeOggi = 5;
  const supplenzeInAttesa = 2;
  const ultimeSupplenze = [
    { docente: "Mario Rossi", classe: "3A", ora: "08:00-09:00", stato: "Confermato" },
    { docente: "Luca Bianchi", classe: "2B", ora: "09:00-10:00", stato: "In attesa" },
    { docente: "Anna Verdi", classe: "1C", ora: "10:00-11:00", stato: "Confermato" },
  ];

  const docentiDisponibiliOggi = ["Mario Rossi", "Luca Bianchi", "Anna Verdi"];
  const disponibilitaSettimana = 15;
  const prossimaDisponibilita = { docente: "Mario Rossi", ora: "08:00-09:00" };

  const orePagateMese = 120;
  const mediaOreDisponibilita = 30;

  const disponibilitaDocenti = [
    { docente: "Mario Rossi", ora: "08:00-09:00" },
    { docente: "Luca Bianchi", ora: "09:00-10:00" },
    { docente: "Anna Verdi", ora: "10:00-11:00" },
  ];

  const totaleDocentiDisponibili = docentiDisponibiliOggi.length;

  return (
    <>
      <div className="dashboard">
        <Navbar />
        <h1 className="dashboard-title">DASHBOARD</h1>
        <div className="dashboard-container">
          <div className="grid-container">
            <motion.div
              className="widget large"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/gestione-supplenze")}
            >
              <div className="header">
                <h2 className="titolo">
                  GESTIONE SUPPLENZE <FaChalkboardTeacher className="widget-icon" />
                </h2>
                <h3>Gestisci tutte le supplenze con facilità</h3>
                <p>Supplenze assegnate oggi: {supplenzeOggi}</p>
                <p>Supplenze in attesa: {supplenzeInAttesa}</p>
              </div>
              <div>
                <h3>Ultime 3 supplenze:</h3>
                <SupplenzeTabella rows={ultimeSupplenze} />
              </div>
            </motion.div>

            <motion.div
              className="widget large"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/disponibilita-docenti")}
            >
              <div className="header">
                <h2 className="titolo">
                  DISPONIBILITÀ <FaUsers className="widget-icon" />
                </h2>
                <h3>Verifica la disponibilità dei docenti</h3>
                <p>Totale docenti disponibili: {totaleDocentiDisponibili}</p>
                <p>Docenti disponibili oggi: {docentiDisponibiliOggi.join(", ")}</p>
              </div>
              <div>
                <h3>Ultime 3 disponibilità:</h3>
                <DisponibilitaTabella rows={disponibilitaDocenti} />
              </div>
            </motion.div>

            <motion.div
              className="widget large"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/storico-supplenze")}
            >
              <div className="header">
                <h2 className="titolo">
                  STORICO SUPPLENZE <FaClipboardList className="widget-icon" />
                </h2>
                <h3>Consulta lo storico delle supplenze</h3>
              </div>
              <div>
                <h3>Ultime 3 supplenze:</h3>
                <SupplenzeTabella rows={ultimeSupplenze} />
              </div>
            </motion.div>

            <motion.div
              className="widget large"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/report")}
            >
              <div className="header">
                <h2 className="titolo">
                  REPORT <FaChartBar className="widget-icon" />
                </h2>
                <h3>Visualizza i report dettagliati</h3>
                <p>Totale ore pagate nel mese: {orePagateMese}</p>
                <p>Media ore di disponibilità per docente: {mediaOreDisponibilita}</p>
              </div>
              <div>
                <h3>Ultimi 3 report:</h3>
                <ReportTabella rows={ultimeSupplenze} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import "../styles/Dashboard.css"; // Importiamo il file CSS

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">DASHBOARD</h1>
      <div className="dashboard-container">

        <div className="grid-container">
          {/* Gestione Supplenze - Elemento grande */}
          <motion.div className="widget large"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/gestione-supplenze")}>
            <h2>GESTIONE SUPPLENZE</h2>
          </motion.div>

          {/* Disponibilità - Medio */}
          <motion.div className="widget medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/disponibilita-docenti")}>
            <h2>DISPONIBILITÀ</h2>
          </motion.div>

          {/* Report - Piccolo */}
          <motion.div className="widget"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/report")}>
            <h2>REPORT</h2>
          </motion.div>

          {/* Due widget vuoti in basso 
          <motion.div className="widget empty"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/gestione-supplenze")}></motion.div>
          <motion.div className="widget empty"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/gestione-supplenze")}></motion.div>
          <motion.div className="widget empty"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/gestione-supplenze")}></motion.div>*/}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
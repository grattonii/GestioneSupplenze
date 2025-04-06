import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaUsers, FaClipboardList, FaChartBar } from "react-icons/fa";
import "../styles/Dashboard.css";
import Navbar from "../components/NavbarProf.jsx";

function DashboardRoot() {
  const navigate = useNavigate();

  return (
    <>
      <div className="dashboard">
        <Navbar />
        <h1 className="dashboard-title">DASHBOARD</h1>
        <div className="dashboard-container">
          <div className="grid-container">
            <motion.div
              className="widget"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/gestione-admin")}
            >
              <div className="header">
                <h2 className="titolo">
                  GESTIONE ACCOUNT <FaChalkboardTeacher className="widget-icon" />
                </h2>
              </div>
            </motion.div>

            <motion.div
              className="widget"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/disponibilita-docenti")}
            >
              <div className="header">
                <h2 className="titolo">
                  GESTIONE RICHIESTE <FaUsers className="widget-icon" />
                </h2>
              </div>
            </motion.div>

            <motion.div
              className="widget"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/storico-supplenze")}
            >
              <div className="header">
                <h2 className="titolo">
                  CONFIGURAZIONE DEL SISTEMA <FaClipboardList className="widget-icon" />
                </h2>
              </div>
            </motion.div>

            <motion.div
              className="widget"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/report")}
            >
              <div className="header">
                <h2 className="titolo">
                  REPORT <FaChartBar className="widget-icon" />
                </h2>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardRoot;
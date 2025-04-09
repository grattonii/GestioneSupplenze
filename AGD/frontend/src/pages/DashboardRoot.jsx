import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCog, FaClipboardList, FaCog, FaChartBar } from "react-icons/fa";
import "../styles/Dashboard.css";
import Navbar from "../components/NavbarProf.jsx";
import AdminTabellaMini from "../components/AdminTabellaMini.jsx";
import SegnalazioniTabella from "../components/SegnalazioniTabella.jsx";

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
                  GESTIONE ACCOUNT <FaUserCog className="widget-icon" />
                </h2>
              </div>
              <div>
                <AdminTabellaMini rows={[]} />
              </div>
            </motion.div>

            <motion.div
              className="widget"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/gestione-segnalazioni")}
            >
              <div className="header">
                <h2 className="titolo">
                  GESTIONE SEGNALAZIONI <FaClipboardList className="widget-icon" />
                </h2>
              </div>
              <div>
                <SegnalazioniTabella rows={[]} />
              </div>
            </motion.div>

            <motion.div
              className="widget"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/configurazione")}
            >
              <div className="header">
                <h2 className="titolo">
                  CONFIGURAZIONE DEL SISTEMA <FaCog className="widget-icon" />
                </h2>
              </div>
            </motion.div>

            <motion.div
              className="widget"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/report-root")}
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
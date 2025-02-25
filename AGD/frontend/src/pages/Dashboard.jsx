import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaUsers, FaClipboardList, FaChartBar } from "react-icons/fa";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar.jsx";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <script
        src="https://kit.fontawesome.com/2f5f6d0fd4.js"
        crossorigin="anonymous"
      ></script>
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
              <FaChalkboardTeacher className="widget-icon" />
              <h2>GESTIONE SUPPLENZE</h2>
            </motion.div>

            <motion.div
              className="widget medium"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/disponibilita-docenti")}
            >
              <FaUsers className="widget-icon" />
              <h2>DISPONIBILITÀ</h2>
            </motion.div>

            <motion.div
              className="widget medium"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/storico-supplenze")}
            >
              <FaClipboardList className="widget-icon" />
              <h2>STORICO SUPPLENZE</h2>
            </motion.div>

            <motion.div
              className="widget large"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/report")}
            >
              <FaChartBar className="widget-icon" />
              <h2>REPORT</h2>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
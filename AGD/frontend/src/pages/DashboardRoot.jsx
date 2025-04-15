import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCog, FaClipboardList, FaCog, FaChartBar } from "react-icons/fa";
import "../styles/Dashboard.css";
import Navbar from "../components/NavbarProf.jsx";
import AdminTabellaMini from "../components/AdminTabellaMini.jsx";
import SegnalazioniTabella from "../components/SegnalazioniTabella.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchWithRefresh } from "../utils/api";

function DashboardRoot() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState([]);
  const [segnalazioniData, setSegnalazioniData] = useState([]);

  useEffect(() => {
    const AccountAdmin = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        const res = await fetchWithRefresh("http://localhost:5000/root/admin", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (!data.success || !Array.isArray(data.adminUsers)) {
          if (data?.error === "Token non valido o scaduto") {
            toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
            sessionStorage.removeItem("accessToken");
            navigate("/");
          }
          else {
            toast.error("Errore nel caricamento degli account admin");
          }
          return;
        }

        setAdminData(data.adminUsers);
      } catch (err) {
        toast.error("Sessione scaduta. Effettua di nuovo il login.");
        sessionStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    AccountAdmin();
    const interval = setInterval(AccountAdmin, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchSegnalazioni = async () => {
      try {
        const response = await fetchWithRefresh("http://localhost:5000/root/segnalazioni");
        if (!response.ok) {
          throw new Error("Errore durante il recupero delle segnalazioni");
        }
        const data = await response.json();

        if (!data.success || !Array.isArray(data.segnalazioni)) {
          if (data?.error === "Token non valido o scaduto") {
            toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
            sessionStorage.removeItem("accessToken");
            navigate("/");
          } else {
            toast.error("Errore nel caricamento delle segnalazioni");
          }
          return;
        }

        setSegnalazioniData(data.segnalazioni); // Aggiorna lo stato con i dati delle segnalazioni
      } catch (error) {
        toast.error("Sessione scaduta. Effettua di nuovo il login.");
        sessionStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    fetchSegnalazioni();

    const interval = setInterval(fetchSegnalazioni, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ToastContainer />
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
                <h3>Gestisci gli account admin</h3>
              </div>
              <div>
                <h3>Ultimi 3 account admin:</h3>
                <AdminTabellaMini rows={adminData.slice(0, 3)} />
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
                <h3>Gestisci tutte le segnalazioni con facilità</h3>
              </div>
              <div>
                <h3>Ultime 3 segnalazioni:</h3>
                <SegnalazioniTabella rows={segnalazioniData.slice(0, 3)} />
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
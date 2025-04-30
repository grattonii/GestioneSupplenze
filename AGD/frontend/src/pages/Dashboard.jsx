import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChalkboardTeacher, FaUsers, FaClipboardList, FaChartBar, FaRegCalendarAlt } from "react-icons/fa";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar.jsx";
import SupplenzeTabellaMini from "../components/SupplenzeTabellaMini.jsx";
import ReportTabella from "../components/ReportTabella.jsx";
import DisponibilitaTabellaMini from "../components/DisponibilitaTabellaMini.jsx";
import AssenzeTabellaMini from "../components/AssenzeTabellaMini.jsx";
import StoricoTabellaMini from "../components/StoricoTabella.jsx";
import { fetchWithRefresh } from "../utils/api";

function Dashboard() {
  const navigate = useNavigate();
  const [assenze, setAssenze] = useState([]);
  const [supplenzeOggi, setSupplenzeOggi] = useState([]);
  const [storicosupplenze, setStoricoSupplenze] = useState([]);
  const [reportSupplenze, setReportSupplenze] = useState([]);
  const [disponibilitaDocenti, setDisponibilitaDocenti] = useState([]);

  useEffect(() => {
    fetchAssenze();
  }, []);

  const fetchAssenze = async () => {
    const token = sessionStorage.getItem("accessToken");

    try {
      const response = await fetchWithRefresh("http://localhost:5000/assenze/docenti", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAssenze(data);
      } else {
        console.error("Errore durante il recupero delle assenze");
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };

  useEffect(() => {
    const fetchSupplenze = async () => {
      try {
        const res = await fetchWithRefresh("http://localhost:5000/supplenze/odierne");
        const data = await res.json();
        if (!Array.isArray(data)) {
          if (data?.error === "Token non valido o scaduto") {
            toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
            sessionStorage.removeItem("accessToken");
            navigate("/");
          } else {
            toast.error("Errore imprevisto nel caricamento delle supplenze");
          }
          return;
        }
        setSupplenzeOggi(data);
      } catch (err) {
        toast.error("Errore: " + err.message, { position: "top-center" });
      }
    };

    fetchSupplenze();
    const interval = setInterval(fetchSupplenze, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStorico = async () => {
      try {
        const res = await fetchWithRefresh("http://localhost:5000/supplenze/storico");
        const data = await res.json();
        if (!Array.isArray(data)) {
          if (data?.error === "Token non valido o scaduto") {
            toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
            sessionStorage.removeItem("accessToken");
            navigate("/");
          } else {
            toast.error("Errore imprevisto nel caricamento delle supplenze");
          }
          return;
        }
        setStoricoSupplenze(data);
      } catch (err) {
        toast.error("Errore: " + err.message, { position: "top-center" });
      }
    };

    fetchStorico();
    const interval = setInterval(fetchStorico, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="dashboard">
        <Navbar />
        <h1 className="dashboard-title">DASHBOARD</h1>
        <div className="dashboard-container">
          <div className="grid-container">
            <motion.div
              className="widget report-widget"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/gestione-supplenze")}
            >
              <div className="header">
                <h2 className="titolo">
                  GESTIONE SUPPLENZE <FaChalkboardTeacher className="widget-icon" />
                </h2>
                <h3>Gestisci tutte le supplenze con facilità</h3>
                <ul className="widget-list">
                  <li>Supplenze assegnate oggi: {supplenzeOggi.length}</li>
                </ul>
              </div>
              <div>
                <h3>Ultime 3 supplenze:</h3>
                <SupplenzeTabellaMini rows={supplenzeOggi} />
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
                  DISPONIBILITÀ DOCENTI<FaUsers className="widget-icon" />
                </h2>
                <h3>Verifica la disponibilità dei docenti</h3>
                <ul className="widget-list">
                  <li>Disponibilità totali: {disponibilitaDocenti.length}</li>
                </ul>
              </div>
              <div>
                <h3>Ultime 3 disponibilità:</h3>
                <DisponibilitaTabellaMini rows={disponibilitaDocenti} />
              </div>
            </motion.div>

            <motion.div
              className="widget"
              whileHover={{ translateY: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/assenze")}
            >
              <div className="header">
                <h2 className="titolo">
                  GESTIONE ASSENZE <FaRegCalendarAlt className="widget-icon" />
                </h2>
                <h3>Gestisci le richieste di assenza</h3>
                <ul className="widget-list">
                  <li>Richieste di assenza totali: {assenze.length}</li>
                  <li>Richieste in attesa: {assenze.filter(assenza => !assenza.accettata).length}</li>
                </ul>
              </div>
              <div>
                <h3>Ultime 3 richieste:</h3>
                <AssenzeTabellaMini rows={assenze.slice(0, 3)} />
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
                  STORICO SUPPLENZE <FaClipboardList className="widget-icon" />
                </h2>
                <h3>Consulta lo storico delle supplenze</h3>
                <ul className="widget-list">
                  <li>Totale supplenze: {storicosupplenze.length}</li>
                  <li>Ultima supplenza: {storicosupplenze[0]?.data}</li>
                </ul>
              </div>
              <div>
                <h3>Ultime 3 supplenze:</h3>
                <StoricoTabellaMini rows={storicosupplenze} />
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
                <h3>Visualizza i report dettagliati</h3>
                <ul className="widget-list">
                  <li>Report totali: {reportSupplenze.length}</li>
                  <li>Ultimo report: {reportSupplenze[0]?.data}</li>
                </ul>
              </div>
              <div>
                <h3>Ultimi 3 report:</h3>
                <ReportTabella rows={reportSupplenze} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
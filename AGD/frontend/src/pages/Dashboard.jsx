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

  const supplenzeOggi = 5;
  const supplenzeInAttesa = 2;
  const ultimeSupplenze = [
    { docente: "Mario Rossi", classe: "3A", data: "31/03/2025", ora: "08:00-09:00", stato: "Confermato" },
    { docente: "Luca Bianchi", classe: "2B", data: "31/03/2025", ora: "09:00-10:00", stato: "In attesa" },
    { docente: "Anna Verdi", classe: "1C", data: "31/03/2025", ora: "10:00-11:00", stato: "Confermato" },
  ];

  const docentiDisponibiliOggi = ["Mario Rossi", "Luca Bianchi", "Anna Verdi"];
  const orePagateMese = 120;
  const mediaOreDisponibilita = 30;

  const disponibilitaDocenti = [
    { docente: "Mario Rossi", giorno: "Martedì", ora: "08:00-09:00" },
    { docente: "Luca Bianchi", giorno: "Martedì", ora: "09:00-10:00" },
    { docente: "Anna Verdi", giorno: "Martedì", ora: "10:00-11:00" },
  ];

  const reportSupplenze = [
    { docente: "Mario Rossi", disponibilità: "8", pagamento: "100" },
    { docente: "Luca Bianchi", disponibilità: "6", pagamento: "80" },
    { docente: "Anna Verdi", disponibilità: "10", pagamento: "120" },
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
                <p>Supplenze assegnate oggi: {supplenzeOggi}</p>
                <p>Supplenze in attesa: {supplenzeInAttesa}</p>
              </div>
              <div>
                <h3>Ultime 3 supplenze:</h3>
                <SupplenzeTabellaMini rows={ultimeSupplenze} />
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
                <p>Totale docenti disponibili: {totaleDocentiDisponibili}</p>
                <p>Docenti disponibili oggi: {docentiDisponibiliOggi.join(", ")}</p>
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
                <ul className="widget-list">
                  <li>Richieste di assenza totali: {assenze.length}</li>
                  <li>Richieste in attesa: {assenze.filter(assenza => !assenza.accettata).length}</li>
                </ul>
              </div>
              <div>
                <h3>Ultime 3 richieste:</h3>
                <AssenzeTabellaMini rows={assenze.slice(0,3)} />
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
              </div>
              <div>
                <h3>Ultime 3 supplenze:</h3>
                <StoricoTabellaMini rows={ultimeSupplenze} />
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
                <p>Totale ore pagate nel mese: {orePagateMese}</p>
                <p>Media ore di disponibilità per docente: {mediaOreDisponibilita}</p>
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
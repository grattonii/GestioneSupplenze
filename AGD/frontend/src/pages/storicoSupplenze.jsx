import { useState, useEffect } from "react";
import StoricoTable from "../components/StoricoTabella.jsx";
import Navbar from "../components/Navbar2.jsx";
import "../styles/Pagine.css";
import { fetchWithRefresh } from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function storicoSupplenze() {
  const [supplenze, setSupplenze] = useState([]);
  const navigate = useNavigate();

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
          setSupplenze(data);
        } catch (err) {
          toast.error("Errore: " + err.message, { position: "top-center" });
        }
      };
  
      fetchStorico();
    }, []);

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <h1 className="title">Storico Supplenze</h1>
      <h3 className="spiegazione">Visualizza lo storico delle supplenze</h3>
      <StoricoTable rows={supplenze} />
    </div>
  );
}

export default storicoSupplenze;
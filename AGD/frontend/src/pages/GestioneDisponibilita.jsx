import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Accesso.css";
import { color } from "d3";

function GestioneDisponibilita() {
  const [disponibilita, setDisponibilita] = useState({});
  const [fasceOrarie, setFasceOrarie] = useState([]);
  const [giorni, setGiorni] = useState([]); // Aggiungi questa riga per definire 'giorni'
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      toast.error("Token mancante, effettua il login.");
      return;
    }

    fetch("http://localhost:5000/orari/fasce-orarie", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          toast.error("Nessuna fascia oraria trovata.", { position: "top-center" });
          return;
        }

        // Trasforma le fasce orarie in un array di stringhe formato "inizio - fine"
        const fasce = data.map(fascia => `${fascia.inizio} - ${fascia.fine}`);
        setFasceOrarie(fasce);

        // Imposta la variabile giorni
        const giorni = espandiGiorniLezione(data[0].giorniLezione);
        setGiorni(giorni); // Aggiungi questa riga per aggiornare lo stato 'giorni'

        const nuovaDisponibilita = {};
        giorni.forEach((giorno) => {
          nuovaDisponibilita[giorno] = { attivo: false, orari: [] };
        });
        setDisponibilita(nuovaDisponibilita);

        setLoading(false); // Caricamento completato
      })
      .catch((err) => {
        console.error("Errore nel caricamento delle fasce orarie:", err);
        toast.error("Errore nel caricamento fasce: " + err.message, { position: "top-center" });
        setLoading(false); // Caricamento completato, anche se c'è stato un errore
      });
  }, []);

  const mappaGiorni = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

  const espandiGiorniLezione = (range) => {
    const abbrev = ["lun", "mar", "mer", "gio", "ven", "sab"];
    const [inizio, fine] = range.split("-");
    const startIdx = abbrev.indexOf(inizio);
    const endIdx = abbrev.indexOf(fine);
    if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return [];

    return mappaGiorni.slice(startIdx, endIdx + 1);
  };

  const toggleDisponibilita = (giorno) => {
    setDisponibilita({
      ...disponibilita,
      [giorno]: { ...disponibilita[giorno], attivo: !disponibilita[giorno].attivo },
    });
  };

  const aggiungiOrario = (giorno) => {
    const orariGiorno = disponibilita[giorno].orari;

    const esisteOrarioNonCompilato = orariGiorno.some(orario => orario.fascia === "");

    if (esisteOrarioNonCompilato) {
      toast.warning("Completa la fascia oraria esistente prima di aggiungerne un'altra.", { position: "top-center" });
      return;
    }

    setDisponibilita({
      ...disponibilita,
      [giorno]: {
        ...disponibilita[giorno],
        orari: [...orariGiorno, { fascia: "" }],
      },
    });
  };

  const modificaOrario = (giorno, index, valore) => {
    const nuoviOrari = [...disponibilita[giorno].orari];
    nuoviOrari[index].fascia = valore;

    setDisponibilita({
      ...disponibilita,
      [giorno]: { ...disponibilita[giorno], orari: nuoviOrari },
    });
  };

  const rimuoviOrario = (giorno, index) => {
    const nuoviOrari = disponibilita[giorno].orari.filter((_, i) => i !== index);
    setDisponibilita({
      ...disponibilita,
      [giorno]: { ...disponibilita[giorno], orari: nuoviOrari },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
      return;
    }

    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const idDocente = decodedToken ? decodedToken.id : null;

    if (!idDocente) {
      toast.error("Errore: ID docente mancante!", { position: "top-center" });
      return;
    }

    const payload = {
      idDocente: idDocente,
      disponibilita: disponibilita,
    };

    fetch('http://localhost:5000/disp/disponibilita', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        navigate("/professore");
      })
      .catch((error) => {
        toast.error("Errore durante il salvataggio!", { position: "top-center" });
      });
  };

  return (
    <>
      <ToastContainer />
      <form id="TeacherBox" onSubmit={handleSubmit}>
        <h1 className="d1">Disponibilità</h1>
        <h3>Seleziona i giorni e le fasce orarie in cui sei disponibile</h3>
        <div className="giorni">
          {/* Mostra il messaggio di caricamento se i giorni non sono ancora caricati */}
          {loading ? (
            <p>Caricamento dei giorni...</p>
          ) : (
            giorni.map((giorno) => (
              <div key={giorno} className="giorno">
                <h3>
                  <input
                    type="checkbox"
                    id={`checkbox-${giorno}`}
                    checked={disponibilita[giorno]?.attivo || false}
                    onChange={() => toggleDisponibilita(giorno)}
                    style={{ display: "none" }}
                  />
                  <label htmlFor={`checkbox-${giorno}`} className="checkbox"></label>
                  {giorno}
                </h3>

                {disponibilita[giorno]?.attivo && (
                  <div className="orari">
                    {disponibilita[giorno].orari.map((orario, index) => (
                      <div key={index} className="orario">
                        <select
                          value={orario.fascia || ""}
                          required
                          onChange={(e) => modificaOrario(giorno, index, e.target.value)}
                          className="input-orario"
                        >
                          <option value="" hidden></option>
                          {fasceOrarie.map((fascia, i) => (
                            <option key={i} value={fascia} style={{color: "black"}}>{fascia}</option>
                          ))}
                        </select>
                        <button type="button" className="rimuovi-btn" onClick={() => rimuoviOrario(giorno, index)}>
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="aggiungi-btn" onClick={() => aggiungiOrario(giorno)}>
                      <FaPlusCircle /> Aggiungi fascia oraria
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div id="containerPulsanti">
          <button type="submit" className="side">Salva Disponibilità</button>
        </div>
      </form>
    </>
  );
}

export default GestioneDisponibilita;
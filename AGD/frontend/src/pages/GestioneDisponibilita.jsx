import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Accesso.css";

function GestioneDisponibilita() {
  const [disponibilita, setDisponibilita] = useState({});
  const [fasceOrarie, setFasceOrarie] = useState([]);
  const [orario, setOrario] = useState([]);
  const [giorni, setGiorni] = useState([]); // Aggiungi questa riga per definire 'giorni'
  const [loading, setLoading] = useState(true); // Stato per il caricamento
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFasceOrarieEGiorni = () => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
        navigate("/");
        return;
      }

      fetch("http://localhost:5000/orari/fasce-orarie", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data || data.length === 0) return;

          const nuoveFasce = data.map(fascia => `${fascia.inizio} - ${fascia.fine}`);
          const nuoviGiorni = espandiGiorniLezione(data[0].giorniLezione); // Assumendo che ogni entry abbia la stessa lista giorni

          setFasceOrarie(prevFasce => {
            if (JSON.stringify(prevFasce) !== JSON.stringify(nuoveFasce)) {
              return nuoveFasce;
            }
            return prevFasce;
          });

          setGiorni(prevGiorni => {
            if (JSON.stringify(prevGiorni) !== JSON.stringify(nuoviGiorni)) {
              return nuoviGiorni;
            }
            return prevGiorni;
          });

          setDisponibilita(prevDisponibilita => {
            const nuovaDisponibilita = { ...prevDisponibilita };

            // Aggiunge nuovi giorni
            nuoviGiorni.forEach(giorno => {
              if (!nuovaDisponibilita[giorno]) {
                nuovaDisponibilita[giorno] = { attivo: false, orari: [] };
              }
            });

            // Rimuove giorni non più validi
            Object.keys(nuovaDisponibilita).forEach(giorno => {
              if (!nuoviGiorni.includes(giorno)) {
                delete nuovaDisponibilita[giorno];
              }
            });

            return nuovaDisponibilita;
          });

          if (!hasLoadedOnce) {
            setHasLoadedOnce(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Errore nel caricamento delle fasce orarie:", err);
        });
    };

    // Fetch iniziale subito al mount
    fetchFasceOrarieEGiorni();

    // Fetch periodico ogni 5 secondi
    const interval = setInterval(fetchFasceOrarieEGiorni, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
      navigate("/");
      return;
    }

    const fetchOrarioDocente = () => {
      fetch(`http://localhost:5000/disp/orarioDocente/${token}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setOrario(data);
          }
        })
        .catch((err) => {
          console.error("Errore nel caricamento dell'orario del docente:", err);
        });
    };

    fetchOrarioDocente();
  });

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

  const checkDisponibilita = (giorno, fascia) => {
    const orarioDocente = orario.find(o => o.giorni[giorno]);
    if (!orarioDocente) {
      toast.error(`Orario non trovato per il giorno ${giorno}`, { position: "top-center" });
      return false;
    }
  
    const fasciaOraria = orarioDocente.giorni[giorno][fascia - 1]; // Accedi alla fascia oraria per il giorno e fascia
    
    if (fasciaOraria === "X") {
      return true; // Disponibile
    } else {
      toast.error(`Impossibile impostare la disponibilità: il docente ha già la classe ${fasciaOraria} alla fascia ${fascia} di ${giorno}.`, { position: "top-center" });
      return false; // Non disponibile
    }
  };
  
  
  // Uso della funzione durante l'aggiunta/modifica dell'orario di disponibilità
  const aggiungiOrario = (giorno, fascia) => {
    // Verifica se il docente è disponibile in quella fascia oraria
    const disponibile = checkDisponibilita(giorno, fascia);
    
    if (!disponibile) {
      return; // Se non è disponibile, non aggiungere la fascia oraria
    }
  
    // Aggiungi la fascia oraria (se disponibile)
    const orariGiorno = disponibilita[giorno].orari;
    setDisponibilita({
      ...disponibilita,
      [giorno]: {
        ...disponibilita[giorno],
        orari: [...orariGiorno, { fascia: `${fascia}° ora` }],
      },
    });
  };

  const modificaOrario = (giorno, index, valore) => {
    const orariGiorno = disponibilita[giorno].orari;

    // Controlla se la fascia è già presente (escludendo quella attualmente in modifica)
    const fasciaDuplicata = orariGiorno.some((orario, i) => i !== index && orario.fascia === valore);

    if (fasciaDuplicata) {
      toast.error("Questa fascia oraria è già stata selezionata per questo giorno.", { position: "top-center" });
      return;
    }

    const nuoviOrari = [...orariGiorno];
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
      id: idDocente,
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
                            <option key={i} value={fascia} style={{ color: "black" }}>{fascia}</option>
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
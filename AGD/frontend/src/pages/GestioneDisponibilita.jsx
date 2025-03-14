import { useState } from "react";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Accesso.css";

const giorniSettimana = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

function GestioneDisponibilita() {
  const [disponibilita, setDisponibilita] = useState(
    giorniSettimana.reduce((acc, giorno) => ({ ...acc, [giorno]: { attivo: false, orari: [] } }), {})
  );

  const toggleDisponibilita = (giorno) => {
    setDisponibilita({
      ...disponibilita,
      [giorno]: { ...disponibilita[giorno], attivo: !disponibilita[giorno].attivo },
    });
  };

  const aggiungiOrario = (giorno) => {
    const orariGiorno = disponibilita[giorno].orari;
  
    // Controlla se esiste una fascia oraria non compilata
    const esisteOrarioNonCompilato = orariGiorno.some(orario => orario.inizio === "" || orario.fine === "");
  
    if (esisteOrarioNonCompilato) {
      toast.warning("Completa la fascia oraria esistente prima di aggiungerne un'altra.", { position: "top-center" });
      return;
    }
  
    setDisponibilita({
      ...disponibilita,
      [giorno]: {
        ...disponibilita[giorno],
        orari: [...orariGiorno, { inizio: "", fine: "" }],
      },
    });
  };

  const modificaOrario = (giorno, index, campo, valore) => {
    const nuoviOrari = [...disponibilita[giorno].orari];
    nuoviOrari[index][campo] = valore;

    if (campo === "fine" && nuoviOrari[index].inizio && valore <= nuoviOrari[index].inizio) {
      toast.error("L'orario di fine deve essere successivo a quello di inizio.", { position: "top-center" });
      return;
    }

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
      const token = await refreshAccessToken();
      if (!token) {
        toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
        return;
      }
    }

    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const idDocente = decodedToken ? decodedToken.id : null;

    console.log("Token decodificato:", decodedToken);

    if (!idDocente) {
      console.error("Errore: idDocente non trovato!");
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
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Disponibilità salvata:', data);
      })
      .catch((error) => {
        console.error('Errore durante l\'invio:', error);
        toast.error("Dati errati!", { position: "top-center" });
      });
  };

  return (
    <>
    <ToastContainer />
    <form id="TeacherBox" onSubmit={handleSubmit}>
      <h1 className="d1">Disponibilità</h1>
      <h3>Seleziona i giorni e gli orari in cui sei disponibile per le lezioni</h3>
      <div className="giorni">
      {giorniSettimana.map((giorno) => (
        <div key={giorno} className="giorno">
          <h3>
            <input
              type="checkbox"
              id={`checkbox-${giorno}`}
              checked={disponibilita[giorno].attivo}
              onChange={() => toggleDisponibilita(giorno)}
              style={{ display: "none" }}
            />
            <label htmlFor={`checkbox-${giorno}`} className="checkbox"></label>
            {giorno}
          </h3>

          {disponibilita[giorno].attivo && (
            <div className="orari">
              {disponibilita[giorno].orari.map((orario, index) => (
                <div key={index} className="orario">
                  <input
                    type="time"
                    value={orario.inizio}
                    required
                    onChange={(e) => modificaOrario(giorno, index, "inizio", e.target.value)}
                    className="input-orario"
                  />
                  <input
                    type="time"
                    value={orario.fine}
                    required
                    onChange={(e) => modificaOrario(giorno, index, "fine", e.target.value)}
                    className="input-orario"
                  />
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
      ))}
      </div>
      <div id="containerPulsanti">
        <button type="submit" className="side">Salva Disponibilità</button>
      </div>
    </form>
    </>
  );
}

export default GestioneDisponibilita;
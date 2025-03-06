import { useState } from "react";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
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
    setDisponibilita({
      ...disponibilita,
      [giorno]: {
        ...disponibilita[giorno],
        orari: [...disponibilita[giorno].orari, { inizio: "", fine: "" }],
      },
    });
  };

  const modificaOrario = (giorno, index, campo, valore) => {
    const nuoviOrari = [...disponibilita[giorno].orari];
    nuoviOrari[index][campo] = valore;
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Disponibilità salvata:", disponibilita);
    // Qui puoi aggiungere una chiamata API per salvare i dati nel backend
  };

  return (
    <form id="TeacherBox" onSubmit={handleSubmit}>
      <h2>Imposta la tua disponibilità</h2>
      {giorniSettimana.map((giorno) => (
        <div key={giorno} className="giorno">
          <h3>
            <input
              type="checkbox"
              checked={disponibilita[giorno].attivo}
              onChange={() => toggleDisponibilita(giorno)}
            />
            {giorno}
          </h3>

          {disponibilita[giorno].attivo && (
            <div className="orari">
              {disponibilita[giorno].orari.map((orario, index) => (
                <div key={index} className="orario">
                  <input
                    type="time"
                    value={orario.inizio}
                    onChange={(e) => modificaOrario(giorno, index, "inizio", e.target.value)}
                  />
                  <input
                    type="time"
                    value={orario.fine}
                    onChange={(e) => modificaOrario(giorno, index, "fine", e.target.value)}
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
      <div id="containerPulsanti">
        <button type="submit">Salva Disponibilità</button>
      </div>
    </form>
  );
}

export default GestioneDisponibilita;
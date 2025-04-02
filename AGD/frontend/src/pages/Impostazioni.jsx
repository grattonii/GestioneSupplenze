import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../styles/Impostazioni.css";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";

const sections = [
  { id: "Orario", label: "Configurazione orario" },
  { id: "Notifiche", label: "Notifiche e preferenze del sistema" },
  { id: "Utenti", label: "Gestione ruoli e permessi utenti" },
  { id: "Assistenza", label: "Segnalazione Problemi" }
];

const handleAbsenceSubmit = (event) => {
  event.preventDefault();
  console.log("Segnalazione inviata!");
};

function Impostazioni() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");
  const [emailNotifiche, setEmailNotifiche] = useState(true);
  const [pushNotifiche, setPushNotifiche] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset per header
      for (let section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [orario, setOrario] = useState({
    inizioPrimaLezione: "",
    fineUltimaLezione: "",
    inizioRicreazione: "",
    fineRicreazione: "",
    durataLezioni: "",
    giorniLezione: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/orari/modifica", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`
      }
    })
      .then((response) => {
        if (response.data) {
          setOrario({
            inizioPrimaLezione: response.data.orari.inizioPrimaLezione || "",
            fineUltimaLezione: response.data.orari.fineUltimaLezione || "",
            inizioRicreazione: response.data.orari.inizioRicreazione || "",
            fineRicreazione: response.data.orari.fineRicreazione || "",
            durataLezioni: response.data.orari.durataLezioni || "",
            giorniLezione: response.data.orari.giorniLezione || "",
          });
        }
      })
      .catch((error) => console.error("Errore nel recupero degli orari:", error));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOrario((prevOrario) => ({
      ...prevOrario,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('accessToken');

    if (!token) {
      const token = await refreshAccessToken();
      if (!token) {
        toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
        return;
      }
    }

    const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
    const idAdmin = decodedToken ? decodedToken.id : null;

    console.log("Token decodificato:", decodedToken);

    if (!idAdmin) {
      console.error("Errore: idAdmin non trovato!");
      toast.error("Errore: ID admin mancante!", { position: "top-center" });
      return;
    }

    const payload = {
      idAdmin: idAdmin,
      orari: orario,
    };

    fetch('http://localhost:5000/orari/salva', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Orari salvati:', data);
      })
      .catch((error) => {
        console.error("Errore durante l'invio:", error);
        toast.error("Errore durante il salvataggio!", { position: "top-center" });
      });
  };

  return (
    <div className="settings-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <FaRegCircleXmark className="close-icon" onClick={() => navigate(-1)} />
        <h2>Impostazioni</h2>
        <nav>
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.id}
              smooth={true}
              duration={500}
              className={`nav-link ${activeSection === section.id ? "active" : ""}`}
            >
              {section.id}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Contenuto */}
      <main className="content">
        <section id="Orario" className="section">
          <h1>Configurazione orario</h1>
          <h3>Modifica l'orario delle lezioni e delle ricreazioni.</h3>
          <form onSubmit={handleSubmit}>
            <div className="modifica-orario">
              <label className="direzione">
                <h3>Ora inizio prima lezione giornata:</h3>
                <input type="time" name="inizioPrimaLezione" value={orario.inizioPrimaLezione} className="input-campo" onChange={handleChange} />
              </label>
              <label className="direzione">
                <h3>Ora fine ultima lezione giornata:</h3>
                <input type="time" name="fineUltimaLezione" value={orario.fineUltimaLezione} className="input-campo" onChange={handleChange} />
              </label>
              <label className="direzione">
                <h3>Ora inizio ricreazione:</h3>
                <input type="time" name="inizioRicreazione" value={orario.inizioRicreazione} className="input-campo" onChange={handleChange} />
              </label>
              <label className="direzione">
                <h3>Ora fine ricreazione:</h3>
                <input type="time" name="fineRicreazione" value={orario.fineRicreazione} className="input-campo" onChange={handleChange} />
              </label>
              <label className="direzione">
                <h3>Durata lezioni:</h3>
                <input type="number" name="durataLezioni" value={orario.durataLezioni} className="input-campo" onChange={handleChange} />
              </label>
              <label className="direzione">
                <h3>Giorni lezione:</h3>
                <select className="input-campo" name="giorniLezione" value={orario.giorniLezione} onChange={handleChange}>
                  <option value="" disabled hidden></option>
                  <option value="lun-ven" style={{ color: "black" }}>Lunedì - Venerdì</option>
                  <option value="lun-sab" style={{ color: "black" }}>Lunedì - Sabato</option>
                </select>
              </label>
            </div>
            <div className="button-container">
              <button type="submit" className="aggiunto">Salva orario</button>
            </div>
          </form>
        </section>

        <section id="Notifiche" className="section">
          <h1>Notifiche e preferenze</h1>
          <h3>Gestisci le notifiche e scegli come ricevere aggiornamenti dal sistema.</h3>
          <div className="direzioni">
            <h3>
              <input
                type="checkbox"
                id="checkbox-email"
                style={{ display: "none" }}
                checked={emailNotifiche}
                onChange={() => setEmailNotifiche(!emailNotifiche)}
              />
              <label htmlFor={"checkbox-email"} className="checkbox"></label>
              Ricevi notifiche via email
            </h3>
            <h3>
              <input
                type="checkbox"
                id="checkbox-push"
                style={{ display: "none" }}
                checked={pushNotifiche}
                onChange={() => setPushNotifiche(!pushNotifiche)}
              />
              <label htmlFor={"checkbox-push"} className="checkbox"></label>
              Ricevi notifiche push
            </h3>
          </div>
          <div className="button-container">
            <button className="aggiunto">Salva preferenze</button>
          </div>
        </section>

        <section id="Utenti" className="section">
          <h1>Gestione utenti e ruoli</h1>
          <h3>Modifica i permessi e assegna ruoli agli utenti.</h3>
          <h3>Utenti:</h3>
          <ul>
            <li>Mario Rossi - Admin <button className="aggiungi">Modifica</button></li>
            <li>Giulia Bianchi - Professore <button className="aggiungi">Modifica</button></li>
            <li>Luca Verdi - Professore <button className="aggiungi">Modifica</button></li>
          </ul>
          <div className="button-container">
            <button className="aggiunto"><FaPlusCircle />Aggiungi nuovo utente</button>
          </div>
        </section>

        <section id="Assistenza" className="section">
          <h1>Segnalazione Problemi</h1>
          <h3>Hai riscontrato un problema? Segnalalo al team di sviluppo.</h3>
          <form className="absence-form" onSubmit={handleAbsenceSubmit}>
            <label className="direzione">
              Descrizione del problema:
              <textarea className="input-campo" style={{ resize: "none", height: 80 }} />
            </label>
            <div className="button-container">
              <button className="aggiunto">Invia segnalazione</button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Impostazioni;
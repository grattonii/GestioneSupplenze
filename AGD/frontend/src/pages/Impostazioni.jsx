import { useEffect, useState } from "react";
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
          <div className="direzione">
            <label className="direzione">
              <span>Ora inizio prima lezione:</span>
              <input type="time" className="input-campo" />
            </label>
            <label className="direzione">
              <span>Ora fine ultima lezione:</span>
              <input type="time" className="input-campo" />
            </label>
            <label className="direzione">
              <span>Ora inizio ricreazione:</span>
              <input type="time" className="input-campo" />
            </label>
            <label className="direzione">
              <span>Ora fine ricreazione:</span>
              <input type="time" className="input-campo" />
            </label>
            <label className="direzione">
              <span>Durata lezioni:</span>
              <input type="number" className="input-campo" />
            </label>
            <label className="direzione">
              <span>Giorni lezione:</span>
              <select className="input-campo">
                <option value="lun-ven" style={{color: "black"}}>Lun-Ven</option>
                <option value="lun-sab" style={{color: "black"}}>Lun-Sab</option>
              </select>
            </label>
          </div>
          <button className="aggiungi">Salva orario</button>
        </section>

        <section id="Notifiche" className="section">
          <h1>Notifiche e preferenze</h1>
          <h3>Gestisci le notifiche e scegli come ricevere aggiornamenti dal sistema.</h3>
          <div className="direzione">
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
          <button className="aggiungi">Salva preferenze</button>
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
          <button className="aggiungi"><FaPlusCircle/>Aggiungi nuovo utente</button>
        </section>

        <section id="Assistenza" className="section">
          <h1>Segnalazione Problemi</h1>
          <h3>Hai riscontrato un problema? Segnalalo al team di sviluppo.</h3>
          <label className="direzione">
            Descrizione del problema:
            <textarea className="input-campo" />
          </label>
          <button className="aggiungi">Invia segnalazione</button>
        </section>
      </main>
    </div>
  );
}

export default Impostazioni;
import { useState } from "react";
import "../styles/Accesso.css";

function GestioneOrari() {
  const [formData, setFormData] = useState({
    inizioPrimaLezione: "",
    inizioRicreazione: "",
    fineRicreazione: "",
    fineUltimaLezione: "",
    durataLezioni: "",
    giorniLezione: "lun-ven",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Orari salvati:", formData);
  };

  return (
    <form id="TeacherBox" onSubmit={handleSubmit}>
      <h1 className="go1">Gestione Orari</h1>
      <div className="giorni">
        <div className="campo">
          <h3 className="etichetta">Ora inizio prima lezione</h3>
          <input
            type="time"
            name="inizioPrimaLezione"
            value={formData.inizioPrimaLezione}
            onChange={handleChange}
            required
            className="input-campo"
          />
        </div>
        <div className="campo">
          <h3 className="etichetta">Ora inizio ricreazione</h3>
          <input
            type="time"
            name="inizioRicreazione"
            value={formData.inizioRicreazione}
            onChange={handleChange}
            required
            className="input-campo"
          />
        </div>
        <div className="campo">
          <h3 className="etichetta">Ora fine ricreazione</h3>
          <input
            type="time"
            name="fineRicreazione"
            value={formData.fineRicreazione}
            onChange={handleChange}
            required
            className="input-campo"
          />
        </div>
        <div className="campo">
          <h3 className="etichetta">Ora fine ultima lezione</h3>
          <input
            type="time"
            name="fineUltimaLezione"
            value={formData.fineUltimaLezione}
            onChange={handleChange}
            required
            className="input-campo"
          />
        </div>
        <div className="campo">
          <h3 className="etichetta">Durata lezioni (minuti)</h3>
          <input
            type="number"
            name="durataLezioni"
            value={formData.durataLezioni}
            onChange={handleChange}
            required
            className="input-campo"
          />
        </div>
        <div className="campo">
          <h3 className="etichetta">Giorni di lezione</h3>
          <select
            name="giorniLezione"
            value={formData.giorniLezione}
            onChange={handleChange}
            required
            className="input-campo"
          >
            <option value="lun-ven">Lunedì - Venerdì</option>
            <option value="lun-sab">Lunedì - Sabato</option>
          </select>
        </div>
      </div>
      <div id="containerPulsanti">
        <button type="submit" className="side">Salva Orari</button>
      </div>
    </form>
  );
}

export default GestioneOrari;
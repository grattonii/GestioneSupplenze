import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Accesso.css";

const etichette = {
  inizioPrimaLezione: "Ora inizio prima lezione",
  fineUltimaLezione: "Ora fine ultima lezione",
  inizioRicreazione: "Ora inizio ricreazione",
  fineRicreazione: "Ora fine ricreazione",
  durataLezioni: "Durata lezioni (minuti)",
  giorniLezione: "Giorni di lezione",
};

function GestioneOrari() {
  const [formData, setFormData] = useState({
    inizioPrimaLezione: "",
    fineUltimaLezione: "",
    inizioRicreazione: "",
    fineRicreazione: "",
    durataLezioni: "",
    giorniLezione: "lun-ven",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    let nuovoFormData = { ...formData, [name]: value };
  
    // Controllo degli orari
    if (
      (name === "fineUltimaLezione" && value <= formData.inizioPrimaLezione) ||
      (name === "fineRicreazione" && value <= formData.inizioRicreazione)
    ) {
      toast.error("L'orario di fine deve essere successivo a quello di inizio.", { position: "top-center" });
      return;
    }
  
    setFormData(nuovoFormData);
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
      orari: formData,
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
    <>
      <ToastContainer />
      <form id="TeacherBox" onSubmit={handleSubmit}>
        <h1 className="go1">Gestione Orari</h1>
        <div className="giorni">
          {Object.keys(formData).map((campo, index) => (
            campo !== "giorniLezione" ? (
              <div key={index} className="campo">
                <h3 className="etichetta">{etichette[campo]}</h3>
                <input
                  type={campo === "durataLezioni" ? "number" : "time"}
                  name={campo}
                  value={formData[campo]}
                  onChange={handleChange}
                  required
                  className="input-campo"
                  {...(campo === "durataLezioni" ? { min: 1, max: 60 } : { min: "07:00", max: "18:00" })}
                />
              </div>
            ) : (
              <div key={index} className="campo">
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
            )
          ))}
        </div>
        <div id="containerPulsanti">
          <button type="submit" className="side">Salva Orari</button>
        </div>
      </form>
    </>
  );
}

export default GestioneOrari;
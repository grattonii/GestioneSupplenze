import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "../styles/Impostazioni.css";
import { FaRegCircleXmark } from "react-icons/fa6";

const sections = [
  { id: "Assegnazioni", label: "Configurazione criteri di assegnazione" },
  { id: "Notifiche", label: "Notifiche e preferenze del sistema" },
  { id: "Utenti", label: "Gestione ruoli e permessi utenti" },
];

function Impostazioni() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("");

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
    <>
      <div className="settings-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <FaRegCircleXmark className="close-icon" onClick={() => navigate(-1)}/>
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
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="section">
              <h2>{section.label}</h2>
              <p>Nel cuore di una foresta antica, dove gli alberi si innalzano maestosi verso il cielo e i loro rami intrecciati creano un fitto intreccio di ombre e luci che danzano sul terreno coperto di muschio, un piccolo ruscello scorre placido tra le radici contorte, mormorando dolcemente mentre l'acqua cristallina riflette i raggi dorati del sole che filtrano tra le foglie tremolanti, e proprio lì, accanto a una grande quercia secolare le cui radici emergono dalla terra come antiche mani nodose, si trova un vecchio ponte di legno ormai consumato dal tempo, con assi scricchiolanti che raccontano storie di viandanti solitari e viaggiatori erranti che, nel corso dei secoli, hanno attraversato quel passaggio sospeso sopra il lento fluire del corso d'acqua, fermandosi talvolta a riposare sulla sua balaustra per ascoltare il canto degli uccelli nascosti tra le fronde e il sussurro del vento che porta con sé il profumo del sottobosco, fatto di foglie umide, funghi selvatici e l’aroma pungente della resina che stilla dai tronchi degli alberi più giovani, mentre nel cielo azzurro, qualche nube bianca scivola pigramente, proiettando ombre in continuo mutamento sulla radura poco distante, dove un cervo solitario, con le sue corna imponenti e lo sguardo vigile, osserva con attenzione ogni piccolo movimento nel fitto della vegetazione, percependo forse la presenza di un lupo che, nascosto dietro a un cespuglio di felci, attende il momento opportuno per rivelarsi, mentre un gruppo di scoiattoli saltella agilmente tra i rami più alti, rincorrendosi in un gioco senza fine che li porta a sparire tra il fogliame solo per riapparire poco dopo su un tronco caduto, dove un tappeto di funghi variopinti cresce indisturbato, aggiungendo un tocco di colore al paesaggio verdeggiante che, con il passare delle ore, cambia sfumatura man mano che il sole inizia la sua lenta discesa verso l’orizzonte, tingendo il cielo di tonalità calde che vanno dall’arancione intenso al rosa tenue, mentre l’aria si riempie del suono dei grilli che annunciano l’arrivo della sera, e la foresta, con i suoi innumerevoli abitanti, si prepara a un nuovo ciclo di vita notturna, in cui le lucciole iniziano a danzare come piccole stelle cadute sulla terra, creando un’atmosfera incantata che avvolge ogni cosa in un alone di mistero e meraviglia, mentre il lento scorrere dell’acqua continua, ininterrotto, a raccontare la storia millenaria di quel luogo nascosto, dove nel cuore di una foresta antica, dove gli alberi si innalzano maestosi verso il cielo e i loro nel cuore di una foresta antica, dove gli alberi si innalzano maestosi verso il cielo e i loro </p>
            </section>
          ))}
        </main>
      </div>
    </>
  );
}

export default Impostazioni;
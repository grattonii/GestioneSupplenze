import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import GestioneFile from "./pages/GestioneFile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GestioneSupplenze from "./pages/GestioneSupplenze.jsx";
import DisponibilitaDocenti from "./pages/DisponibilitaDocenti.jsx";
import Report from "./pages/Report.jsx";
import SetAdmin from "./pages/SetAdmin.jsx";
import StoricoSupplenze from "./pages/storicoSupplenze.jsx";
import PaginaProf from "./pages/Professori.jsx";
import Impostazioni from "./pages/Impostazioni.jsx";
import DisponibilitaDocente from "./pages/GestioneDisponibilita.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/gestione-file" element={<GestioneFile/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/gestione-supplenze" element={<GestioneSupplenze/>} />
        <Route path="/disponibilita-docenti" element={<DisponibilitaDocenti/>} />
        <Route path="/report" element={<Report/>} />
        <Route path="/gestione-account" element={<SetAdmin/>} />
        <Route path="/storico-supplenze" element={<StoricoSupplenze/>} />
        <Route path="/professori" element={<PaginaProf/>} />
        <Route path="/impostazioni" element={<Impostazioni/>} />
        <Route path="/disponibilita-docente" element={<DisponibilitaDocente/>} />
      </Routes>
    </Router>
  );
}

export default App;
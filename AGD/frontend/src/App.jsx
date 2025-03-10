import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import GestioneFile from "./pages/GestioneFile";
import Dashboard from "./pages/Dashboard";
import DashboardRoot from "./pages/DashboardRoot.jsx";
import GestioneSupplenze from "./pages/GestioneSupplenze";
import DisponibilitaDocenti from "./pages/DisponibilitaDocenti";
import Report from "./pages/Report";
import SetAdmin from "./pages/SetAdmin";
import StoricoSupplenze from "./pages/storicoSupplenze";
import PaginaProf from "./pages/Professore.jsx";
import DisponibilitaDocente from "./pages/GestioneDisponibilita.jsx";
import Impostazioni from "./pages/Impostazioni.jsx";
import GestioneOrari from "./pages/GestioneOrari.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/root" element={<DashboardRoot/>} />
        <Route path="/gestione-file" element={<GestioneFile/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/gestione-supplenze" element={<GestioneSupplenze/>} />
        <Route path="/disponibilita-docenti" element={<DisponibilitaDocenti/>} />
        <Route path="/report" element={<Report/>} />
        <Route path="/gestione-account" element={<SetAdmin/>} />
        <Route path="/storico-supplenze" element={<StoricoSupplenze/>} />
        <Route path="/professore" element={<PaginaProf/>} />
        <Route path="/disponibilita-docente" element={<DisponibilitaDocente/>} />
        <Route path="/impostazioni" element={<Impostazioni/>} />
        <Route path="/gestione-orari" element={<GestioneOrari/>} />
      </Routes>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GestioneFile from "./pages/GestioneFile";
import Dashboard from "./pages/Dashboard";
import GestioneSupplenze from "./pages/GestioneSupplenze";
import DisponibilitaDocenti from "./pages/DisponibilitaDocenti";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GestioneFile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gestione-supplenze" element={<GestioneSupplenze />} />
        <Route path="/disponibilita-docenti" element={<DisponibilitaDocenti />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
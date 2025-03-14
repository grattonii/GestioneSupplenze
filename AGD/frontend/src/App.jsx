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
import AuthRoute from "./components/AuthRoute.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/root" element={
          <AuthRoute allowedRoles={["root"]}>
            <DashboardRoot />
          </AuthRoute>
        } />
        <Route path="/gestione-file" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <GestioneFile />
          </AuthRoute>
        } />
        <Route path="/dashboard" element={
            <AuthRoute allowedRoles={["admin", "root"]}>
              <Dashboard />
            </AuthRoute>
          }
        />
        <Route path="/gestione-supplenze" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <GestioneSupplenze />
          </AuthRoute>
        } />
        <Route path="/disponibilita-docenti" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <DisponibilitaDocenti />
          </AuthRoute>
        } />
        <Route path="/report" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <Report />
          </AuthRoute>
        } />
        <Route path="/gestione-account" element={
          <AuthRoute allowedRoles={["admin", "professore", "root"]}>
            <SetAdmin />
          </AuthRoute>
        } />
        <Route path="/storico-supplenze" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <StoricoSupplenze />
          </AuthRoute>
        } />
        <Route path="/professore" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <PaginaProf />
          </AuthRoute>
        } />
        <Route path="/disponibilita-docente" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <DisponibilitaDocente />
          </AuthRoute>
        } />
        <Route path="/impostazioni" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <Impostazioni />
          </AuthRoute>
        } />
        <Route path="/gestione-orari" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <GestioneOrari />
          </AuthRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
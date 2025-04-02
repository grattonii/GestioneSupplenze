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
import GestioneAccount from "./pages/GestioneAccount.jsx";
// Importa WeeklySchedule e Professore per passare le props
import WeeklySchedule from "./components/WeeklySchedule";
import Professore from "./pages/Professore";
import GestioneAssenze from "./pages/GestioneAssenze.jsx";

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
        <Route path="/gestione-admin" element={
          <AuthRoute allowedRoles={["root"]}>
            <GestioneAccount />
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
        <Route path="/assenze" element={
          <AuthRoute allowedRoles={["admin", "root"]}>
            <GestioneAssenze />
          </AuthRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Rimuove il token
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <button className="nav-button" onClick={() => navigate("/impostazioni")}> 
          <FaCog /> Impostazioni
        </button>
        <button className="nav-button logout" onClick={handleLogout}> 
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
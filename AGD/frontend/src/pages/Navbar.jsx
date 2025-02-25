import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSignOutAlt, FaEllipsisV } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false); // 🔹 Stato per mostrare/nascondere il menu

  const handleLogout = () => {
    localStorage.removeItem("token"); // Rimuove il token
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        {/* 🔹 Pulsante con menu a tendina */}
        <div className="dropdown">
          <button className="nav-button" onClick={() => setShowMenu(!showMenu)}>
            <FaEllipsisV />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/impostazioni")}><FaCog className="icon"/>Impostazioni</button>
              <button className="logout" onClick={handleLogout}><FaSignOutAlt className="icon"/>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
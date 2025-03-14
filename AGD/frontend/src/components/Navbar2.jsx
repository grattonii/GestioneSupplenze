import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSignOutAlt, FaEllipsisV, FaChevronLeft } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar2() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Effettua una richiesta al backend per fare il logout
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", // Assicurati di includere i cookie nella richiesta
      });

      sessionStorage.removeItem("token");

      // Reindirizza l'utente alla pagina di login
      navigate("/");
    } catch (error) {
      console.error("Errore nel logout", error);
    }
  };
  
  return (
    <nav className="navbar navbar-secondaria">
      <div className="navbar-left">
        <button className="bn-indietro" onClick={() => navigate(-1)}>
          <FaChevronLeft className="icon-back" /> Indietro
        </button>
      </div>
      <div className="navbar-right">
        <div className="dropdown" ref={menuRef}>
          <button className="nav-button" onClick={() => setShowMenu(!showMenu)}>
            <FaEllipsisV />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/impostazioni")}>
                <FaCog className="icon" /> Impostazioni
              </button>
              <button className="logout" onClick={handleLogout}>
                <FaSignOutAlt className="icon" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;
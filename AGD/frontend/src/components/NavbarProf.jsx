import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "../styles/Navbar.css";

function NavbarProf() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      // Effettua una richiesta al backend per fare il logout
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include", // Assicurati di includere i cookie nella richiesta
      });

      sessionStorage.removeItem("accessToken");

      // Reindirizza l'utente alla pagina di login
      navigate("/");
    } catch (error) {
      console.error("Errore nel logout", error);
    }
  };

    return (
        <nav className="navbar navbar-principale">
            <div className="navbar-right">
                <button className="Logout" onClick={handleLogout}>
                    <FaSignOutAlt className="icon" /> Logout
                </button>
            </div>
        </nav>
    );
}

export default NavbarProf;
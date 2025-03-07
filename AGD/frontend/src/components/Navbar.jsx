import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSignOutAlt, FaEllipsisV } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar() {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-principale">
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

export default Navbar;
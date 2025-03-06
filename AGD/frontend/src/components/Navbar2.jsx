import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faChevronLeft,faGear,faRightFromBracket,faEllipsisVertical, faC } from "@fortawesome/free-solid-svg-icons";
import "../styles/Navbar.css";

function Navbar2() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-secondaria">
      <div className="navbar-left">
        <button className="bn-indietro" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faChevronLeft} classname="icon" /> Indietro
      
        </button>
      </div>
      <div className="navbar-right">
        <div className="dropdown">
          <button className="nav-button" onClick={() => setShowMenu(!showMenu)}>
          <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/impostazioni")}>
              <FontAwesomeIcon icon={faGear} /> Impostazioni
              </button>
              <button className="logout" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar2;
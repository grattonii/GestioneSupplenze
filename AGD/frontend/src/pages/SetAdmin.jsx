import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Accesso.css";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function SetAdmin() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "user") setUser(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !password || !confirmPassword) {
      toast.warn("Compila tutti i campi!", { position: "top-center" });
      return;
    }

    if (password !== confirmPassword) {
      toast.warn("Le password non corrispondono", { position: "top-center" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
    
      if (!token) {
        toast.warn("Devi essere autenticato per cambiare le credenziali!", { position: "top-center" });
        return;
      }
    
      const response = await axios.put(
        "http://localhost:5000/auth/update",
        { newUsername: user, newPassword: password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      // Salviamo il nuovo token dopo l'aggiornamento
      const newToken = response.data?.token;

      if (!newToken) {
        console.error("Errore: Nessun token ricevuto dal server");
        toast.error("Errore durante l'aggiornamento delle credenziali!",{ position: "top-center" });
        return;
      }

      localStorage.setItem("token", newToken);
    
      // Decodifichiamo il nuovo token per ottenere il ruolo
      const decodedToken = JSON.parse(atob(newToken.split(".")[1]));
    
      if (decodedToken.role !== "admin")
        navigate("/disponibilita-docente");
      else
        navigate("/gestione-file");
    
    } catch (error) {
      console.error("Errore durante l'aggiornamento", error);
      toast.error("Errore durante l'aggiornamento delle credenziali!",{ position: "top-center" });
    }    
  };

  return (
    <>
      <script
        src="https://kit.fontawesome.com/2f5f6d0fd4.js"
        crossOrigin="anonymous"
      ></script>
      <ToastContainer/>
      <div id="loginBox">
        <div id="titolo">
          <h1>Cambia Password</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div id="formLogin">
            <div className="input">
              <h3>
                <FontAwesomeIcon icon={faLock} /> <span>Nuova Password</span>
              </h3>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="show-password-button"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div className="input">
              <h3>
                <FontAwesomeIcon icon={faLock} /> <span>Conferma Password</span>
              </h3>
              <div className="password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="conferma password"
                  value={confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="show-password-button"
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                  />
                </button>
              </div>
            </div>

            <div id="containerPulsanti">
              <button type="submit">Accedi</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SetAdmin;
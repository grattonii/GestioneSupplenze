import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Accesso.css";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function SetAdmin() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const toggleShowPassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = (event) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isPasswordStrong = (pwd) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return strongPasswordRegex.test(pwd);
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      toast.warn("Compila tutti i campi!", { position: "top-center" });
      return;
    }

    if (password !== confirmPassword) {
      toast.warn("Le password non corrispondono", { position: "top-center" });
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.warn(
        "La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale.",
        { position: "top-center" }
      );
      return;
    }

    let token = sessionStorage.getItem("accessToken");
    if (!token) {
      toast.warn("Sessione scaduta, effettua nuovamente il login!", { position: "top-center" });
      sessionStorage.removeItem("accessToken");
      navigate("/");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/auth/update",
        { newPassword: password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newToken = response.data?.token;
      if (newToken) {
        sessionStorage.setItem("accessToken", newToken);
        console.log("Nuovo token salvato:", newToken);  // Aggiungi un log per il nuovo token
      }

      let decodedToken;
      try {
        decodedToken = newToken ? JSON.parse(atob(newToken.split(".")[1])) : null;
      } catch (error) {
        console.error("Errore nella decodifica del token:", error);
        toast.error("Errore nell'autenticazione, riprova!", { position: "top-center" });
        return;
      }

      console.log("Token decodificato:", decodedToken);  // Aggiungi un log per il token decodificato

      if (decodedToken?.role == "admin") {
        navigate("/gestione-orari");
      } else {
        navigate("/disponibilita-docente");
      }

    } catch (error) {
      console.error("Errore durante l'aggiornamento", error);
      toast.error("Errore durante l'aggiornamento delle credenziali!", { position: "top-center" });
    }
  };

  return (
    <>
      <ToastContainer />
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
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
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
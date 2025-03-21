import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Accesso.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  // Stati per username e password
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Funzione per il login automatico
    const attemptAutoLogin = async () => {
        try {
          // Se esiste un token, verifica se è ancora valido
          const response = await axios.post(
            "http://localhost:5000/auth/refresh", 
            {}, 
            { withCredentials: true }
          );
          console.log(response.data);  // Log della risposta
          const accessToken = response.data.accessToken;

          if (accessToken) {
            sessionStorage.setItem("accessToken", accessToken);
            const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
            
            if (decodedToken.role === "root") navigate("/root");
            else if (decodedToken.role === "admin") navigate("/dashboard");
            else if (decodedToken.role === "professore") navigate("/professore");
          }
        } catch (error) {
          console.log("Nessun token di refresh presente, accesso manuale richiesto.");
        }
    };

    attemptAutoLogin(); // Prova a fare login automatico
  }, [navigate]);

  // Funzione per aggiornare gli stati quando l'utente digita
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "user") setUser(value);
    if (name === "password") setPassword(value);
  };

  // Funzione per inviare i dati del login
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita il refresh della pagina

    if (!user || !password) {
      toast.warn("Compila tutti i campi!", { position: "top-center" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username: user,
        password,
      }, { withCredentials: true });

      const { role, firstLogin, accessToken } = response.data;
      sessionStorage.setItem("accessToken", accessToken); // Salva temporaneamente il token

      if(role == "root") {
        navigate("/root");
      } 
      else if (role === "admin") {
        if (firstLogin) 
          navigate("/gestione-account");
        else
          navigate("/dashboard");
      } 
      else if (role === "professore") {
        if (firstLogin) 
          navigate("/gestione-account");
        else
          navigate("/professore");
      } 
      else {
        toast.error("Ruolo non riconosciuto!", { position: "top-center" });
        return;
      }

    } catch (error) {
      console.error("Errore durante il login", error);
      toast.error("Credenziali errate!", { position: "top-center" });
    }
  };

  // Funzione per mostrare/nascondere la password
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <ToastContainer />
      <div id="loginBox">
        <div id="titolo">
          <h1>Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div id="formLogin">
            <div className="input">
              <h3> <FontAwesomeIcon icon={faUser} /> <span>Username</span> </h3>
              <input type="text" name="user" placeholder="username" value={user} onChange={handleChange} />
            </div>

            <div className="input">
              <h3> <FontAwesomeIcon icon={faLock} /> <span> Password </span> </h3>
              <div className="password-container">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="password" value={password} onChange={handleChange} />
                <button type="button" onClick={toggleShowPassword} className="show-password-button">
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
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

export default Login;
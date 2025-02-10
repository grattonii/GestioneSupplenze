import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  // Stati per username e password
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      alert("Compila tutti i campi!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username: user,
        password,
      });

      console.log("Risposta dal server:", response.data);
      alert("Login riuscito!");

      const userRole = response.data.role;

      // Esegui un'azione in base al ruolo
      if (userRole === "admin") {
        // Se l'utente è admin, naviga nella pagina di gestione admin
        navigate("/gestione-file");
      } else if (userRole === "professore") {
        // Se l'utente è professore, naviga nella pagina di gestione professori
        navigate("/disponibilita-docenti");
      } else {
        alert("Ruolo non riconosciuto");
        return;
      }

    } catch (error) {
      console.error("Errore durante il login", error);
      alert("Credenziali errate!");
    }
  };

  return (
    <>
      <script
        src="https://kit.fontawesome.com/2f5f6d0fd4.js"
        crossorigin="anonymous"
      ></script>
      <div id="loginBox">
        <div id="titolo">
          <h1>Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div id="formLogin">
            <div className="input">
              <h3>Username</h3>
              <input type="text" name="user" placeholder="username" value={user} onChange={handleChange} />
            </div>

            <div className="input">
              <h3>Password</h3>
              <input type="password" name="password" placeholder="password" value={password} onChange={handleChange} />
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
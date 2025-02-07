import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

function Login() {
  // Stati per email e password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Funzione per aggiornare gli stati quando l'utente digita
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  // Funzione per inviare i dati del login
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita il refresh della pagina

    if (!email || !password) {
      alert("Compila tutti i campi!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      console.log("Risposta dal server:", response.data);
      alert("Login riuscito!");
    } catch (error) {
      console.error("Errore durante il login", error);
      alert("Credenziali errate!");
    }
  };

    return (
      <>
        <script src="https://kit.fontawesome.com/2f5f6d0fd4.js" crossorigin="anonymous"></script>
        <div id="loginBox">
          <div id="titolo">
            <h1>Login</h1>
          </div>
          <form action="">
            <div id="formLogin">
              
              <div className="input">
                <h3>Email</h3> 
                <input type="email" name="email" placeholder="esempio@exp.com" />
              </div>

              <div className="input">
                <h3>Password</h3> 
                <input type="password" name="password" placeholder="password" />
              </div>

              <div id="containerPulsanti">
              <div className="input"></div>
                <div class="invia">

                    <button type="submit">Accedi</button>

                </div>

                </div>  
            </div>
          </form>
        </div>
      </>
    );
  }
  
  export default Login; 
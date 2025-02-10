import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/Admin.css";


function SetAdmin() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "user") setUser(value);
    if (name === "password") setPassword(value);
    if (name == "confirmPassword") setConfirmPassword(value);
   };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user || !password || !confirmPassword) {
      alert("Compila Tutti i Campi");
      return;
    }

    if (password !== confirmPassword){
        alert("Le Password Non Combaciano")
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username: user,
        password,
      });

      console.log("Risposta dal server:", response.data);
      alert("Login riuscito!");
      navigate("/gestione-supplenze");
    } catch (error) {
      console.error("Errore durante il login", error);
      alert("Credenziali errate!");
    }
  };

  return (
    <div id="loginBox">
      <div id="titolo">
        <h1>Crea L'Account</h1>
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

          
          <div className="input">
            <h3>Conferma password</h3>
            <input type="password" name="confirmPassword" placeholder="password" value={confirmPassword} onChange={handleChange} />
          </div>

          <div id="containerPulsanti">
            <button type="submit">Accedi</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SetAdmin;
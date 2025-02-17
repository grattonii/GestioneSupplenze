import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Accesso.css";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser} from "@fortawesome/free-solid-svg-icons";

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
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("Devi essere autenticato per cambiare le credenziali!");
        return;
      }
  
      const response = await axios.put(
        "http://localhost:5000/auth/update",
        { newUsername: user, newPassword: password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      navigate("/gestione-file");
    } catch (error) {
      console.error("Errore durante l'aggiornamento", error);
      alert("Errore durante l'aggiornamento delle credenziali!");
    }
  };

  return (
    <div id="AdminBox">
      <div id="titolo">
        <h1>Crea L'Account</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div id="formLogin">
          <div className="input">
          <h3><FontAwesomeIcon icon={faUser}/> <span>Username </span>   </h3> <input type="text" name="user" placeholder="username" value={user} onChange={handleChange} />
          </div>

          <div className="input">
          
          <h3> <FontAwesomeIcon icon={faLock} /> <span>Password</span>   </h3>
      
            <input type="password" name="password" placeholder="password" value={password} onChange={handleChange} />
          </div>

          
          <div className="input">
            
          <h3>  <FontAwesomeIcon icon={faLock} /> <span>Conferma Password</span> </h3>
            <input type="password" name="confirmPassword" placeholder="conferma password" value={confirmPassword} onChange={handleChange} />
          
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
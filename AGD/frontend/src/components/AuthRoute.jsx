import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AuthRoute({ children, allowedRoles }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    // Se non c'è il token, reindirizza al login
    if (!token) {
      console.error("Token non trovato, utente non autenticato.");
      try {
        // Effettua una richiesta al backend per fare il logout
        fetch("http://localhost:5000/auth/logout", {
          method: "POST",
          credentials: "include", // Assicurati di includere i cookie nella richiesta
        });
  
        sessionStorage.removeItem("accessToken");
  
        // Reindirizza l'utente alla pagina di login
        navigate("/");
      } catch (error) {
        console.error("Errore nel logout", error);
      }
      return;
    }

    // Decodifica il token
    try {
        const decodedToken = token ? JSON.parse(atob(token.split(".")[1])) : null;
      const userRole = decodedToken ? decodedToken.role : null; // Estrai il ruolo dal token

      // Se il ruolo dell'utente non è tra quelli consentiti, reindirizza alla pagina principale
      if (!allowedRoles.includes(userRole)) {
        navigate(-1); 
      }
    } catch (error) {
      console.error("Errore nel decodificare il token:", error);
      navigate(-1);
    }
  }, [navigate, allowedRoles]);

  return children; // Se tutto è a posto, renderizza i figli (le pagine protette)
}

export default AuthRoute;
import { useState, useEffect } from "react";

function LoginPage({ onClickMenu, setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [csrfToken, setToken] = useState(null); 


  useEffect(() => {
    fetchCsrfToken();
  }, []); 

  const fetchCsrfToken = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/csrf/", { 
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          `Error HTTP al obtener CSRF token: ${response.status} ${response.statusText}`,
          errorData
        );
        setMensaje("Error al cargar token de seguridad.");
        return null;
      }

      const data = await response.json();

      if (data && data.csrfToken) {
        setToken(data.csrfToken);
        return data.csrfToken;
      } else {
        console.error("La respuesta JSON no contiene 'csrfToken'.", data);
        setMensaje("Token de seguridad no encontrado en la respuesta.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener CSRF token (problema de red o parsing):", error);
      setMensaje("Error de conexión al cargar token de seguridad.");
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let currentCsrfToken = csrfToken; 

    if (!currentCsrfToken) {
      setMensaje("Token de seguridad no cargado. Intentando obtenerlo...");
      currentCsrfToken = await fetchCsrfToken();
      if (!currentCsrfToken) {
        setMensaje("No se pudo obtener el token de seguridad. Intente de nuevo.");
        return;
      }
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": currentCsrfToken, 
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("Login exitoso!");
        setUser(username); 
        onClickMenu("home"); 
      } else {
        setMensaje(`Error de login: ${data.message || 'Credenciales incorrectas'}`);
        console.error("Error en el login:", data);
      }
    } catch (error) {
      console.error("Error durante la petición de login:", error);
      setMensaje("Ocurrió un error de red. Intente de nuevo.");
    }

    const res = await fetch("http://127.0.0.1:8000/api/auth/yo/", {
      method: "GET",
      credentials: "include"
    });
    const userStatus = await res.json();
  };

  return (
    <div className="formulario">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="user">Usuario:</label>
          <input
            id="user"
            type="text"
            autoComplete="off"
            placeholder="Usuario"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <br />
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />
          
          <button type="submit" disabled={!csrfToken}>Entrar</button>
        </div>
      </form>
      {mensaje && <p className="mensaje-error">{mensaje}</p>} 
      {!csrfToken && <p className="loading-message">Cargando token de seguridad...</p>}
      <button onClick={() => onClickMenu("home")}>Volver</button>
    </div>
  );
}

export default LoginPage;